interface IPetBase {
  _id: string;
  name: string;
  species: SPECIES;
  gender?: GENDER;
  dateOfBirth?: string;
  colour?: string;
  notes?: string;
  weight?: number;
  avatar?: string;
}

export enum SPECIES {
  CAT,
  DOG,
}

export enum GENDER {
  MALE,
  FEMALE,
}

export enum EVENT {
  VACCINATION,
  DEWORMING,
  TICK_TREATMENT,
  VACCINATION_AGAINST_RABIES,
  VETERINARIAN_EXAMINATION,
  SHOW,
  REWARD,
  PHOTO_SESSION,
  TRAINING,
  START_OF_TREATMENT,
  END_OF_TREATMENT,
  OPERATION,
  CHILDBIRTH,
  STERILIZATION,
  PAIRING,
  ESTRUS,
  MOLT,
}

export interface IStaticResDto {
  _id: string;
  name: string;
}

export interface IOwnerEmailDto {
  ownerEmail: string;
}

export interface IOwner {
  _id: string;
  email?: string;
  name?: string;
  avatar?: string;
}

export interface IBreed extends IStaticResDto {}

export interface IPetResDto extends IPetBase {
  owners: IOwner[];
  breed?: IBreed;
}

export interface IPetPreviewResDto extends IPetBase {
  owners: string[];
  breed?: string;
}

export interface IEventResDto {
  _id: string;
  type: EVENT;
  petId: string;
  petName: string;
  date: string;
  description?: string;
}
