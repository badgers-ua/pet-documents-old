import { gql } from '@apollo/client/core';

export const PET_PREVIEW_FRAGMENT = gql`
  fragment PetPreview on PetPreviewResDto {
    _id
    name
    species
    owners
    gender
    dateOfBirth
    colour
    avatar
    notes
    weight
    breed
  }
`;

export const PET_FRAGMENT = gql`
  fragment Pet on PetResDto {
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
`;

export const EVENT_FRAGMENT = gql`
  fragment Event on EventResDto {
    _id
    type
    petId
    petName
    date
    description
  }
`;
