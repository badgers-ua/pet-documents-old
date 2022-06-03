import { UseGuards } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PatchPetReqDto, PetReqDto } from './dto/pet-req.dto';
import { User } from '../utils/decorators';
import { AddOwnerReqDto } from './dto/add-owner-req.dto';
import {
  CreatedPetResDto,
  PatchedPetResDto,
  PetPreviewResDto,
  PetResDto,
} from './dto/pet-res.dto';
import { FirebaseAuthGuard } from '../shared/guards/firebase-auth/firebase-auth-guard';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MongoIdReqDto } from '../shared/dto/mongo-id-req.dto';
import { auth } from 'firebase-admin';
import { AddOwnerResDto } from './dto/add-owner-res.dto';
import { RemoveOwnerResDto } from './dto/remove-owner-res.dto';
import { RemoveOwnerReqDto } from './dto/remove-owner-req.dto';
import { DeletePetReqDto } from './dto/delete-pet-req.dto';
import { DeletePetResDto } from './dto/delete-pet-res.dto';

@Resolver()
@UseGuards(FirebaseAuthGuard)
export class PetsResolver {
  constructor(private readonly petService: PetsService) {}

  @Query(() => [PetPreviewResDto], { name: 'getPets' })
  public getPets(
    @User() { uid }: auth.UserRecord,
  ): Promise<PetPreviewResDto[]> {
    return this.petService.getPetsByOwner(uid);
  }

  @Query(() => PetResDto, { name: 'getPet', nullable: true })
  public getPet(
    @User() { uid }: auth.UserRecord,
    @Args('data') { _id }: MongoIdReqDto,
  ): Promise<PetResDto> {
    return this.petService.getPetByIdAndOwner(_id, uid);
  }

  @Mutation(() => CreatedPetResDto, { name: 'createPet' })
  public createPet(
    @User() { uid }: auth.UserRecord,
    @Args('data') petReqDto: PetReqDto,
  ): Promise<CreatedPetResDto> {
    // TODO: avatar
    return this.petService.createPet(petReqDto, petReqDto.avatar, uid);
  }

  @Mutation(() => PatchedPetResDto, { name: 'patchPet' })
  public patchPet(
    @User() { uid }: auth.UserRecord,
    @Args('data') patchPetReqDto: PatchPetReqDto,
  ): Promise<PatchedPetResDto> {
    // TODO: avatar
    return this.petService.patchPet(
      patchPetReqDto._id,
      patchPetReqDto.avatar,
      uid,
      patchPetReqDto,
    );
  }

  @Mutation(() => AddOwnerResDto, { name: 'addOwner' })
  public addOwner(
    @User() { uid }: auth.UserRecord,
    @Args('data') ownerEmailReqDto: AddOwnerReqDto,
  ): Promise<AddOwnerResDto> {
    return this.petService.addOwner(
      ownerEmailReqDto.petId,
      uid,
      ownerEmailReqDto,
    );
  }

  @Mutation(() => RemoveOwnerResDto, { name: 'removeOwner' })
  public removeOwner(
    @User() { uid }: auth.UserRecord,
    @Args('data') removeOwnerReqDto: RemoveOwnerReqDto,
  ): Promise<RemoveOwnerResDto> {
    return this.petService.removeOwner(
      removeOwnerReqDto.petId,
      uid,
      removeOwnerReqDto,
    );
  }

  @Mutation(() => DeletePetResDto, { name: 'deletePet' })
  public deletePet(
    @User() { uid }: auth.UserRecord,
    @Args('data') { _id }: DeletePetReqDto,
  ): Promise<DeletePetResDto> {
    return this.petService.deletePet(_id, uid);
  }
}
