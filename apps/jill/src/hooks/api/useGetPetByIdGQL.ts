import { useStorage } from 'reactfire';
import { getBucketDownloadUrl } from './../../utils/factory.utils';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { PET_SCHEMA } from './schemas';
import { useState } from 'react';
import { PetWithAvatarUrl } from '../../types';

const useGetPetByIdGQL = (petId: string) => {
  const storage = useStorage();
  const { loading: isLoadingPet, error: petLoadingError } = useQuery(
    PET_SCHEMA,
    {
      variables: { id: petId },
      onCompleted: async ({ getPet }) => {
        if (!getPet.avatar) {
          return;
        }
        const avatarDownloadUrl: string = await getBucketDownloadUrl(
          storage,
          getPet.avatar,
        );
        setPet({ getPet: { ...getPet, avatar: avatarDownloadUrl } });
      },
    },
  );

  const [pet, setPet] = useState<{ getPet: PetWithAvatarUrl }>();

  return { pet, isLoadingPet, petLoadingError };
};

export default useGetPetByIdGQL;
