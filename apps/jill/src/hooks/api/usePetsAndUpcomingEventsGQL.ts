import { useQuery } from '@apollo/client';
import sortBy from 'lodash/sortBy';
import { isLoading } from '../../types';
import { isToday } from '../../utils/date.utils';
import { PETS_SCHEMA_AND_UPCOMING_EVENTS_GQL } from './schemas';
import { IEventResDto, IPetPreviewResDto } from '@pdoc/types';

export type PetsAndUpcomingEvents = {
  pets: IPetPreviewResDto[];
  upcomingEvents: IEventResDto[];
  todayEvents: IEventResDto[];
} & isLoading;

interface PetsAndUpcomingEventsGQLRes {
  getPets: IPetPreviewResDto[];
  getUpcomingEvents: IEventResDto[];
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

  const sortedPets: IPetPreviewResDto[] = sortBy(pets, 'name') ?? [];

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
