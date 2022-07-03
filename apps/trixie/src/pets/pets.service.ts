import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Pet, PetDocument } from './schemas/pet.schema';
import { PetReqDto } from './dto/pet-req.dto';
import {
  PET_CRUD_ERROR,
  PET_LAST_OWNER_ERROR,
  PET_LIMIT_REACHED,
  PET_LIMIT_REACHED_BY,
  USER_CRUD_ERROR,
} from './_constants';
import { CatBreed, CatBreedDocument } from '../static/schemas/cat-breed.schema';
import { DogBreed, DogBreedDocument } from '../static/schemas/dog-breed.schema';
import { AddOwnerReqDto } from './dto/add-owner-req.dto';
import { petHasOwnerMessageFormatter } from '../utils/formatter.utils';
import {
  CreatedPetResDto,
  PatchedPetResDto,
  PetPreviewResDto,
  PetResDto,
} from './dto/pet-res.dto';
import { unlinkSync } from 'fs';
import { FB_BUCKET_PROVIDER_KEY } from '../_constants';
import { Bucket } from '@google-cloud/storage';
import { UploadResponse } from '@google-cloud/storage/build/src/bucket';
import { forkJoin, from, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { File } from '@google-cloud/storage/build/src/file';
import { EditPetReqDto } from './dto/edit-pet-req.dto';
import { UsersService } from '../shared/users/users.service';
import { auth } from 'firebase-admin';
import { Event, EventDocument } from '../events/schemas/event.schema';
import { Owner } from '../shared/types';
import { AddOwnerResDto } from './dto/add-owner-res.dto';
import { RemoveOwnerResDto } from './dto/remove-owner-res.dto';
import { RemoveOwnerReqDto } from './dto/remove-owner-req.dto';
import { DeletePetResDto } from './dto/delete-pet-res.dto';

@Injectable()
export class PetsService {
  constructor(
    @Inject(FB_BUCKET_PROVIDER_KEY) private readonly _bucket: Bucket,
    @InjectModel(Pet.name) private readonly petModel: Model<PetDocument>,
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(CatBreed.name)
    private readonly catBreedModel: Model<CatBreedDocument>,
    @InjectModel(DogBreed.name)
    private readonly dogBreedModel: Model<DogBreedDocument>,
    private readonly usersService: UsersService,
  ) {}

  public async patchPet(
    petId: string,
    avatar,
    ownerId: string,
    petDto: EditPetReqDto,
  ): Promise<PatchedPetResDto> {
    return await from(
      this.petModel.findById(new mongoose.Types.ObjectId(petId)).exec(),
    )
      .pipe(
        filter((pet) => {
          if (!pet) {
            throw new BadRequestException(PET_CRUD_ERROR);
          }
          if (!pet.owners.map((objId) => objId).includes(ownerId)) {
            throw new BadRequestException(PET_CRUD_ERROR);
          }
          return !!pet;
        }),
        switchMap((pet: PetDocument) => {
          if (!!pet.avatar && petDto.isAvatarChanged) {
            const file: File = this._bucket.file(pet.avatar);
            return forkJoin([of(pet), from(file.delete())]);
          }
          return forkJoin([of(pet), of(null)]);
        }),
        switchMap(([pet]) => {
          return petDto.isAvatarChanged
            ? forkJoin([of(pet), this._getUploadedFileObservable(avatar)])
            : forkJoin([of(pet), of(null)]);
        }),
        switchMap(([pet, avatarFileName]) => {
          return this.petModel
            .findOneAndUpdate(
              { _id: new mongoose.Types.ObjectId(petId) },
              {
                ...petDto,
                avatar: petDto.isAvatarChanged ? avatarFileName : pet.avatar,
              },
              {
                new: true,
              },
            )
            .exec();
        }),
        map(({ _id }: PetDocument) => {
          return new PatchedPetResDto(_id);
        }),
      )
      .toPromise();
  }

  public async addOwner(
    petId: string,
    currentOwnerId: string,
    { ownerEmail }: AddOwnerReqDto,
  ): Promise<AddOwnerResDto> {
    const pet: PetDocument = await this.petModel
      .findById(new mongoose.Types.ObjectId(petId))
      .exec();

    if (!pet) {
      throw new BadRequestException(PET_CRUD_ERROR);
    }

    const requestedUser: auth.UserRecord =
      await this.usersService.getUserByEmail(ownerEmail);

    if (!requestedUser) {
      throw new BadRequestException(USER_CRUD_ERROR);
    }

    // TODO: [CLEANUP] Subscription feature
    const newOwnerCurrentPets: PetPreviewResDto[] = await this.getPetsByOwner(
      requestedUser.uid,
    );

    if (newOwnerCurrentPets?.length >= 2) {
      throw new NotAcceptableException(
        PET_LIMIT_REACHED_BY(requestedUser?.email),
      );
    }

    if (pet.owners.toString().includes(requestedUser.uid)) {
      throw new BadRequestException(
        petHasOwnerMessageFormatter(pet.name, ownerEmail),
      );
    }

    await this.petModel
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(pet._id) },
        { owners: [...pet.owners, requestedUser.uid] },
        {
          new: true,
        },
      )
      .exec();

    return { _id: requestedUser.uid };
  }

  public async removeOwner(
    petId: string,
    currentOwnerId: string,
    { ownerId }: RemoveOwnerReqDto,
  ): Promise<RemoveOwnerResDto> {
    const pet: PetDocument = await this.petModel
      .findById(new mongoose.Types.ObjectId(petId))
      .exec();

    if (!pet) {
      throw new BadRequestException(PET_CRUD_ERROR);
    }

    const requestedUser: auth.UserRecord = await this.usersService.getUserById(
      ownerId,
    );

    if (!requestedUser) {
      throw new BadRequestException(USER_CRUD_ERROR);
    }

    if (!pet.owners.map((objId) => objId).includes(currentOwnerId)) {
      throw new BadRequestException(PET_CRUD_ERROR);
    }

    if (
      (pet.owners || []).length === 1 &&
      pet.owners.map((objId) => objId).includes(currentOwnerId)
    ) {
      throw new BadRequestException(PET_LAST_OWNER_ERROR);
    }

    await this.petModel
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(pet._id) },
        {
          owners: pet.owners.filter((user_id) => user_id !== ownerId),
        },
        {
          new: true,
        },
      )
      .exec();

    return { _id: ownerId };
  }

  public async getPetByIdAndOwner(
    petId: string,
    ownerId: string,
  ): Promise<PetResDto> {
    const [petDocument] = await this.petModel
      .aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(petId),
            owners: {
              $in: [ownerId],
            },
          },
        },
        {
          $addFields: {
            breed: {
              $toObjectId: '$breed',
            },
          },
        },
        {
          $lookup: {
            from: 'catbreeds',
            localField: 'breed',
            foreignField: '_id',
            as: 'catBreed',
          },
        },
        {
          $lookup: {
            from: 'dogbreeds',
            localField: 'breed',
            foreignField: '_id',
            as: 'dogBreed',
          },
        },
        {
          $unwind: {
            path: '$catBreed',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$dogBreed',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            breed: ['$catBreed', '$dogBreed'],
          },
        },
        {
          $project: {
            catBreed: 0,
            dogBreed: 0,
          },
        },
        {
          $addFields: {
            breed: {
              $filter: {
                input: '$breed',
                as: 'breed',
                cond: {
                  $ne: ['$$breed', null],
                },
              },
            },
          },
        },
        {
          $unwind: {
            path: '$breed',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .exec();

    if (!petDocument) {
      throw new BadRequestException(PET_CRUD_ERROR);
    }

    const { users }: auth.GetUsersResult = await this.usersService.getUsers(
      petDocument.owners.map((id) => ({ uid: id })),
    );

    if (!users?.length) {
      throw new BadRequestException(PET_CRUD_ERROR);
    }

    const owners: Owner[] = users.map(
      ({ uid, displayName, photoURL, email }): Owner => {
        return {
          _id: uid,
          name: displayName,
          avatar: photoURL,
          email,
        };
      },
    );

    const petResponse: PetResDto = {
      ...petDocument,
      owners,
    };

    return petResponse;
  }

  public async getPetsByOwner(ownerId: string): Promise<PetPreviewResDto[]> {
    const pets: PetDocument[] = await this.petModel
      .find({ owners: { $in: [ownerId] } }, { __v: 0 })
      .exec();
    // TODO: remove this shit
    return pets as unknown as PetPreviewResDto[];
  }

  public async createPet(
    petDto: PetReqDto,
    avatar,
    ownerId: string,
  ): Promise<CreatedPetResDto> {
    // TODO: [CLEANUP] Subscription feature
    const userPets: PetPreviewResDto[] = await this.getPetsByOwner(ownerId);
    if (userPets?.length >= 2) {
      throw new NotAcceptableException(PET_LIMIT_REACHED);
    }

    return await of(avatar)
      .pipe(
        switchMap((avatar) => {
          return this._getUploadedFileObservable(avatar);
        }),
        map((avatarFileName?: string) => {
          const newPet: Pet = {
            owners: [ownerId],
            avatar: avatarFileName,
            ...petDto,
          };
          return newPet;
        }),
        switchMap((newPet: Pet) => {
          return new this.petModel(newPet).save();
        }),
        map(({ _id }: PetDocument) => {
          return new CreatedPetResDto(_id);
        }),
      )
      .toPromise();
  }

  public async deletePet(
    petId: string,
    ownerId: string,
  ): Promise<DeletePetResDto> | never {
    await from(
      this.petModel
        .findOne({
          $and: [
            { _id: new mongoose.Types.ObjectId(petId) },
            { owners: ownerId },
          ],
        })
        .exec(),
    )
      .pipe(
        switchMap((petDocument: PetDocument) => {
          return forkJoin([
            of(petDocument.delete()),
            from(
              this.eventModel
                .deleteMany({
                  petId: petId,
                })
                .exec(),
            ),
            !!petDocument.avatar
              ? from(this._bucket.file(petDocument.avatar).delete())
              : of(undefined),
          ]);
        }),
        map(() => undefined),
        catchError(() => {
          throw new BadRequestException(PET_CRUD_ERROR);
        }),
      )
      .toPromise();

    return { _id: petId };
  }

  private _deleteAvatarFile(avatar): void {
    try {
      return unlinkSync(avatar.path);
    } catch (err) {
      console.error(err);
    }
  }

  private _getUploadedFileObservable(avatar) {
    return !!avatar
      ? from(
          this._bucket.upload(avatar.path, {
            gzip: true,
            destination: `pet-photos/${avatar.filename}`,
          }),
        ).pipe(
          tap(() => this._deleteAvatarFile(avatar)),
          map(([file]: UploadResponse) => {
            return file.name;
          }),
          catchError(() => {
            throw new InternalServerErrorException();
          }),
        )
      : of(null);
  }
}
