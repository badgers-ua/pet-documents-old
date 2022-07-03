import { useQuery } from '@apollo/client';
import sortBy from 'lodash/sortBy';
import { EventResDto, isLoading, PetPreviewResDto } from '../../types';
import { isToday } from '../../utils/date.utils';
import { PETS_SCHEMA_AND_UPCOMING_EVENTS_GQL } from './schemas';

export type PetsAndUpcomingEvents = {
  pets: PetPreviewResDto[];
  upcomingEvents: EventResDto[];
  todayEvents: EventResDto[];
} & isLoading;

interface PetsAndUpcomingEventsGQLRes {
  getPets: PetPreviewResDto[];
  getUpcomingEvents: EventResDto[];
}

const usePetsAndUpcomingEventsGQL = (): PetsAndUpcomingEvents => {
  const { data, loading } = useQuery<PetsAndUpcomingEventsGQLRes>(
    PETS_SCHEMA_AND_UPCOMING_EVENTS_GQL,
  );

  const {
    getPets: pets,
    getUpcomingEvents: upcomingEvents,
  }: PetsAndUpcomingEventsGQLRes = data ?? {
    getPets: [],
    getUpcomingEvents: [],
  };

  const sortedPets: PetPreviewResDto[] = sortBy(pets, 'name') ?? [];

  const sortedUpcomingEvents: EventResDto[] =
    sortBy(
      upcomingEvents.filter(({ date }) => !isToday(date)),
      'date',
    ) ?? [];

  const sortedTodayEvents: EventResDto[] =
    sortBy(
      upcomingEvents.filter(({ date }) => isToday(date)),
      'date',
    ) ?? [];

  return {
    pets: sortedPets,
    upcomingEvents: sortedUpcomingEvents,
    todayEvents: sortedTodayEvents,
    isLoading: loading,
  };
};

export default usePetsAndUpcomingEventsGQL;
