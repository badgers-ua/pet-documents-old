import { useMutation } from '@apollo/client/react/hooks/useMutation';
import { EVENTS_SCHEMA, UPDATE_EVENT_SCHEMA } from './schemas';
import { useMemo } from 'react';
import { PatchEventReqDto } from '../../types';

type UseUpdateEventGQLProps = {
  petId: string;
  onCompleted: () => void;
};

const useUpdateEventGQL = ({ petId, onCompleted }: UseUpdateEventGQLProps) => {
  const [patchEvent, { loading: isUpdateEventLoading }] = useMutation(
    UPDATE_EVENT_SCHEMA,
    {
      refetchQueries: [{ query: EVENTS_SCHEMA, variables: { petId } }],
      onCompleted,
    },
  );

  const loadUpdateEvent = useMemo(
    () => (patchEventReqDto: PatchEventReqDto) =>
      patchEvent({ variables: { patchEventReqDto } }),
    [patchEvent],
  );

  return { loadUpdateEvent, isUpdateEventLoading };
};

export default useUpdateEventGQL;
