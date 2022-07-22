import { gql } from '@apollo/client/core';

export const PET_COMMON_FRAGMENT = gql`
  fragment PetCommon on PetPreviewResDto {
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
