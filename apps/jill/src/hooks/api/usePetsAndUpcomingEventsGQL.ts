import { useQuery } from '@apollo/client';
import { IEventResDto } from '@pdoc/types';
import sortBy from 'lodash/sortBy';
import { useState } from 'react';
import { useStorage } from 'reactfire';
import { isLoading, PetWithAvatarUrl } from '../../types';
import { isToday } from '../../utils/date.utils';
import { getBucketDownloadUrl } from '../../utils/factory.utils';
import { PETS_SCHEMA_AND_UPCOMING_EVENTS_GQL } from './schemas';

export type PetsAndUpcomingEvents = {
  pets: PetWithAvatarUrl[];
  upcomingEvents: IEventResDto[];
  todayEvents: IEventResDto[];
} & isLoading;

interface PetsAndUpcomingEventsGQLRes {
  getPets: PetWithAvatarUrl[];
  getUpcomingEvents: IEventResDto[];
}

const usePetsAndUpcomingEventsGQL = (): PetsAndUpcomingEvents => {
  const [pets, setPets] = useState<PetWithAvatarUrl[]>([]);

  const storage = useStorage();
  const { data, loading } = useQuery<PetsAndUpcomingEventsGQLRes>(
    PETS_SCHEMA_AND_UPCOMING_EVENTS_GQL,
    {
      onCompleted: async ({ getPets }) => {
        if (!getPets.length) {
          return;
        }

        const _petsWithAvatars: PetWithAvatarUrl[] = [];
        const loadAvatars = async () => {
          for (let i = 0; i < getPets.length; i++) {
            const pet = getPets[i];

            const avatar: string | undefined = pet.avatar
              ? await getBucketDownloadUrl(storage, pet.avatar)
              : undefined;

            _petsWithAvatars.push({ ...pet, avatar });
          }

          setIsLoading(false);
          setPets(_petsWithAvatars);
        };
        loadAvatars();
      },
    },
  );

  const [isLoading, setIsLoading] = useState<boolean>(loading);

  const { getUpcomingEvents: upcomingEvents }: PetsAndUpcomingEventsGQLRes =
    data ?? {
      getPets: [],
      getUpcomingEvents: [],
    };

  const sortedPets: PetWithAvatarUrl[] = sortBy(pets, 'name') ?? [];

  const sortedUpcomingEvents: IEventResDto[] =
    sortBy(
      upcomingEvents.filter(({ date }) => !isToday(date)),
      'date',
    ) ?? [];

  const sortedTodayEvents: IEventResDto[] =
    sortBy(
      upcomingEvents.filter(({ date }) => isToday(date)),
      'date',
    ) ?? [];

  return {
    pets: sortedPets,
    upcomingEvents: sortedUpcomingEvents,
    todayEvents: sortedTodayEvents,
    isLoading,
  };
};

export default usePetsAndUpcomingEventsGQL;
