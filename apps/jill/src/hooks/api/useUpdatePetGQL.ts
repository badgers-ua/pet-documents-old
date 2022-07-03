import { useMutation } from '@apollo/client/react/hooks/useMutation';
import { PATCH_PET_SCHEMA, PET_SCHEMA, PETS_SCHEMA } from './schemas';
import { PatchPetReqDto } from '../../types';
import { useMemo } from 'react';

type UseUpdatePetGQLProps = {
  petId: string;
  onCompleted: () => void;
};

const useUpdatePetGQL = ({ petId, onCompleted }: UseUpdatePetGQLProps) => {
  const [updatePet, { loading: isUpdatePetLoading }] = useMutation(
    PATCH_PET_SCHEMA,
    {
      refetchQueries: [
        { query: PETS_SCHEMA },
        { query: PET_SCHEMA, variables: { id: petId } },
      ],
      onCompleted,
    },
  );

  const loadUpdatePet = useMemo(
    () => (patchPetReqDto: PatchPetReqDto) =>
      updatePet({ variables: { patchPetReqDto } }),
    [updatePet],
  );

  return {
    loadUpdatePet,
    isUpdatePetLoading,
  };
};

export default useUpdatePetGQL;
