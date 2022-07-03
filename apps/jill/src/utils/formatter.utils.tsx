import React from 'react';
import { DropDownOption } from '../types';
import { ReactComponent as CatSVG } from '../icons/cat.svg';
import { ReactComponent as DogSVG } from '../icons/dog.svg';
import i18next from 'i18next';
import { GENDER, IStaticResDto, SPECIES } from '@pdoc/types';

/**
 *
 * @param species {SPECIES}
 * @param size {number}
 */
export const getPetPreviewAvatarBySpecies = (species: SPECIES, size = 48) => {
  const dictionary = {
    [SPECIES.CAT]: (
      <CatSVG data-test-id="cat-icon" width={size} height={size} />
    ),
    [SPECIES.DOG]: (
      <DogSVG data-test-id="dog-icon" width={size} height={size} />
    ),
  };
  return dictionary[species];
};

/**
 *
 * @param gender {GENDER}
 */
export const getGenderLabel = (gender: GENDER) => {
  const dictionary = {
    [GENDER.MALE]: i18next.t('male'),
    [GENDER.FEMALE]: i18next.t('female'),
  };
  return dictionary[gender];
};

/**
 *
 * @param staticArr {IStaticResDto[]}
 */
export const mapStaticArrayToDropDownOptions = (staticArr: IStaticResDto[]) =>
  staticArr.map(
    ({ _id, name }) => ({ label: name, value: _id } as DropDownOption<string>),
  );
