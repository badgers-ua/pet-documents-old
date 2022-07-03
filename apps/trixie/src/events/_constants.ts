export enum EVENT {
  VACCINATION,
  DEWORMING,
  TICK_TREATMENT,
  VACCINATION_AGAINST_RABIES,
  VETERINARIAN_EXAMINATION,
  SHOW,
  REWARD,
  PHOTO_SESSION,
  TRAINING,
  START_OF_TREATMENT,
  END_OF_TREATMENT,
  OPERATION,
  CHILDBIRTH,
  STERILIZATION,
  PAIRING,
  ESTRUS,
  MOLT,
}

export const EVENT_CRUD_ERROR =
  'Event not found, or you have not the permissions to complete this action.';

export const EVENT_PAST_DATE_ERROR = `Can't create notification for past date.`;

// TODO: [CLEANUP] Subscription feature
export const EVENT_LIMIT_REACHED = `You can't have more then 50 events, we know it's not ideal.`;
