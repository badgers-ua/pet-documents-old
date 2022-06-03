export enum NODE_ENV {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

export enum SPECIES {
  CAT,
  DOG,
}

export enum GENDER {
  MALE,
  Female,
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

export type Children = {
  children: JSX.Element;
};

export interface DropDownOption<T> {
  label: string;
  value: T;
}

interface TypeName {
  __typename: string;
}

interface PetResDtoCommon extends TypeName {
  _id: string;
  name: string;
  species: SPECIES;
  gender?: GENDER;
  dateOfBirth?: string;
  colour?: string;
  notes?: string;
  weight?: number;
}

export interface PetPreviewResDto extends PetResDtoCommon {
  owners: string[];
  breed?: string;
}

export interface PetResDto extends PetResDtoCommon {
  owners: Owner[];
  breed?: StaticResDto;
}

export interface Owner {
  _id: string;
  email?: string;
  name?: string;
  avatar?: string;
}

export interface StaticResDto extends TypeName {
  _id: string;
  name: string;
}

export interface PetReqDto {
  name: string;
  species: SPECIES;
  breed?: string | null;
  gender?: GENDER | null;
  dateOfBirth?: string | null;
  colour?: string | null;
  notes?: string | null;
  weight?: number | null;
  avatar?: any | null;
}

export interface CreateEventReqDto {
  type: number;
  date: string;
  petId: string;
  description?: string | null;
}

export interface EventResDto extends TypeName {
  _id: string;
  type: EVENT;
  petId: string;
  petName: string;
  date: string;
  description?: string;
}

export interface PatchPetReqDto extends PetReqDto {
  _id: string;
}

export interface PatchEventReqDto extends CreateEventReqDto {
  _id: string;
}

export interface GetEventReqDto {
  _id: string;
  petId: string;
}

export interface AddOwnerReqDto {
  ownerEmail: string;
  petId: string;
}

export interface RemoveOwnerReqDto {
  ownerId: string;
  petId: string;
}

export interface RemoveOwnerResDto extends TypeName {
  _id: string;
}

export interface DeletePetReqDto {
  _id: string;
}

export interface DeletePetResDto extends TypeName {
  _id: string;
}

export interface DeleteEventReqDto {
  _id: string;
}

export interface DeleteEventResDto extends TypeName {
  _id: string;
}

export interface AddEventToCalendarParams {
  petName: string;
  eventName: string;
  eventDate: string; // ISO
  eventDescription?: string;
}

export type isLoading = {
  isLoading: boolean;
};
