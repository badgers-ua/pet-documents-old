import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { IEventResDto } from '@pdoc/types';
import { useState } from 'react';
import { useStorage } from 'reactfire';
import { PetWithAvatarUrl } from '../../types';
import { getBucketDownloadUrl } from './../../utils/factory.utils';
import { PET_PROFILE_GQL } from './schemas';

export type PetProfileGQLRes = {
  getPet: PetWithAvatarUrl;
  getEventsByPet: IEventResDto[];
};

const useGetPetProfileGQL = (petId: string) => {
  const storage = useStorage();
  const {
    data: res,
    loading,
    error: petLoadingError,
  } = useQuery(PET_PROFILE_GQL, {
    variables: { petId },
    onCompleted: async ({ getPet, getEventsByPet }) => {
      const pet = { ...getPet };

      if (pet.avatar) {
        const avatarDownloadUrl: string | undefined =
          await getBucketDownloadUrl(storage, getPet.avatar);
        pet.avatar = avatarDownloadUrl ?? pet.avatar;
      }

      setIsLoading(false);
      setData({
        getPet: pet,
        getEventsByPet,
      });
    },
  });

  const [data, setData] = useState<PetProfileGQLRes>({
    getPet: res?.getPet ? { ...res?.getPet, avatar: 'loading' } : undefined,
    getEventsByPet: res?.getEventsByPet,
  });
  const [isLoading, setIsLoading] = useState<boolean>(loading);

  return { data, isLoading, petLoadingError };
};

export default useGetPetProfileGQL;
