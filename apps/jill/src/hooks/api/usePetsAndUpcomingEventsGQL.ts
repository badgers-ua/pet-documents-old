import { useQuery } from '@apollo/client';
import { IEventResDto, IPetResDto } from '@pdoc/types';
import sortBy from 'lodash/sortBy';
import { isLoading } from '../../types';
import { isToday } from '../../utils/date.utils';
import { PETS_SCHEMA_AND_UPCOMING_EVENTS_GQL } from './schemas';

export type PetsAndUpcomingEvents = {
  pets: IPetResDto[];
  upcomingEvents: IEventResDto[];
  todayEvents: IEventResDto[];
} & isLoading;

interface PetsAndUpcomingEventsGQLRes {
  getPets: IPetResDto[];
  getUpcomingEvents: IEventResDto[];
}

const usePetsAndUpcomingEventsGQL = (): PetsAndUpcomingEvents => {
  const { data, loading } = useQuery<PetsAndUpcomingEventsGQLRes>(
    PETS_SCHEMA_AND_UPCOMING_EVENTS_GQL,
  );

  const {
    getUpcomingEvents: upcomingEvents,
    getPets: pets,
  }: PetsAndUpcomingEventsGQLRes = data ?? {
    getPets: [],
    getUpcomingEvents: [],
  };

  const sortedPets: IPetResDto[] = sortBy(pets, 'name') ?? [];

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
    isLoading: loading,
  };
};

export default usePetsAndUpcomingEventsGQL;
