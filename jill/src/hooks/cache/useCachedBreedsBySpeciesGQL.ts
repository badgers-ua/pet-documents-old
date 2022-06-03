import { DropDownOption, SPECIES } from '../../types';
import { GET_BREEDS_BY_SPECIES_SCHEMA } from '../api/schemas';
import sortBy from 'lodash/sortBy';
import { mapStaticArrayToDropDownOptions } from '../../utils/formatter.utils';
import { useApolloClient } from '@apollo/client/react/hooks/useApolloClient';

const useCachedBreedsBySpeciesGQL = () => {
  const apolloClient = useApolloClient();

  const getCachedBreedOptions = (
    species?: SPECIES,
  ): DropDownOption<string>[] => {
    if (!Number.isInteger(species)) {
      return [];
    }
    const cachedBreedsRes = apolloClient.readQuery({
      query: GET_BREEDS_BY_SPECIES_SCHEMA,
      variables: {
        species,
      },
    });

    return sortBy<DropDownOption<string>>(
      mapStaticArrayToDropDownOptions(
        cachedBreedsRes?.getBreedsBySpecies ?? [],
      ),
      'label',
    );
  };

  return {
    loadCachedBreedsBySpecies: (species: SPECIES) =>
      getCachedBreedOptions(species),
  };
};

export default useCachedBreedsBySpeciesGQL;
