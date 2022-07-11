import { gql } from '@apollo/client/core';
import { PET_COMMON_FRAGMENT } from './fragments';

export const PETS_SCHEMA_AND_UPCOMING_EVENTS_GQL = gql`
  ${PET_COMMON_FRAGMENT}
  query petsAndUpcomingEvents {
    getPets {
      ...PetCommon
    }
    getUpcomingEvents {
      _id
      type
      petId
      petName
      date
      description
    }
  }
`;

export const UPCOMING_EVENTS_SCHEMA = gql`
  query getUpcomingEvents {
    getUpcomingEvents {
      _id
      type
      petId
      petName
      date
      description
    }
  }
`;

export const PETS_SCHEMA = gql`
  query getPets {
    getPets {
      _id
      name
      species
      owners
      gender
      dateOfBirth
      colour
      notes
      weight
      breed
      avatar
    }
  }
`;

export const GET_BREEDS_BY_SPECIES_SCHEMA = gql`
  query getBreedsBySpecies($species: Int!) {
    getBreedsBySpecies(data: { species: $species }) {
      _id
      name
    }
  }
`;

export const CREATE_PET_SCHEMA = gql`
  mutation createPet($petReqDto: PetReqDto!, $avatar: Upload) {
    createPet(data: $petReqDto, avatar: $avatar) {
      _id
    }
  }
`;

export const PET_SCHEMA = gql`
  query getPet($id: String!) {
    getPet(data: { _id: $id }) {
      _id
      name
      species
      gender
      dateOfBirth
      colour
      notes
      weight
      avatar
      owners {
        _id
        name
        email
      }
      breed {
        _id
        name
      }
    }
  }
`;

export const PET_PROFILE_GQL = gql`
  query getPetProfile($petId: String!) {
    getPet(data: { _id: $petId }) {
      _id
      name
      species
      gender
      dateOfBirth
      colour
      notes
      weight
      avatar
      owners {
        _id
        name
        email
      }
      breed {
        _id
        name
      }
    }
    getEventsByPet(data: { petId: $petId }) {
      _id
      type
      petId
      petName
      date
      description
    }
  }
`;

export const EVENTS_SCHEMA = gql`
  query getEventsByPet($petId: String!) {
    getEventsByPet(data: { petId: $petId }) {
      _id
      type
      petId
      petName
      date
      description
    }
  }
`;

export const ADD_OWNER_SCHEMA = gql`
  mutation addOwner($addOwnerReqDto: AddOwnerReqDto!) {
    addOwner(data: $addOwnerReqDto) {
      _id
    }
  }
`;

export const REMOVE_OWNER_SCHEMA = gql`
  mutation removeOwner($removeOwnerReqDto: RemoveOwnerReqDto!) {
    removeOwner(data: $removeOwnerReqDto) {
      _id
    }
  }
`;

export const DELETE_PET_SCHEMA = gql`
  mutation deletePet($deletePetReqDto: DeletePetReqDto!) {
    deletePet(data: $deletePetReqDto) {
      _id
    }
  }
`;

export const DELETE_EVENT_SCHEMA = gql`
  mutation deleteEvent($deleteEventReqDto: DeleteEventReqDto!) {
    deleteEvent(data: $deleteEventReqDto) {
      _id
    }
  }
`;

export const PATCH_PET_SCHEMA = gql`
  mutation patchPet($patchPetReqDto: PatchPetReqDto!) {
    patchPet(data: $patchPetReqDto) {
      _id
    }
  }
`;

export const EVENT_SCHEMA = gql`
  query getEvent($getEventReqDto: GetEventReqDto!) {
    getEvent(data: $getEventReqDto) {
      _id
      type
      petId
      petName
      date
      description
    }
  }
`;

export const CREATE_EVENT_SCHEMA = gql`
  mutation createEvent($createEventReqDto: CreateEventReqDto!) {
    createEvent(data: $createEventReqDto) {
      _id
    }
  }
`;

export const UPDATE_EVENT_SCHEMA = gql`
  mutation patchEvent($patchEventReqDto: PatchEventReqDto!) {
    patchEvent(data: $patchEventReqDto) {
      _id
    }
  }
`;
