import React, { SyntheticEvent, useEffect, useState } from 'react';
import {
  AddOwnerReqDto,
  DeleteEventReqDto,
  DeleteEventResDto,
  DeletePetReqDto,
  EventResDto,
  PetResDto,
  RemoveOwnerReqDto,
  RemoveOwnerResDto,
} from '../types';
import { ApolloCache } from '@apollo/client/core';
import { useMutation } from '@apollo/client/react/hooks/useMutation';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoaderStore } from '../providers/store/loader/LoaderStoreProvider';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PetInfoCard from '../components/PetInfoCard';
import PetEventsCard from '../components/PetEventsCard';
import { useTranslation } from 'react-i18next';
import useTheme from '@mui/material/styles/useTheme';
import { FormikConfig, useFormik } from 'formik';
import * as Yup from 'yup';
import i18next from 'i18next';
import { EmailFormDialog } from '../components/form/EmailFormDialog';
import OwnersFormDialog from '../components/form/OwnersFormDialog';
import AlertDialog from '../components/form/AlertDialog';
import CenteredNoDataMessage from '../components/CenteredNoDataMessage';
import { useUser } from 'reactfire';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getEventLabel } from '../utils/factory.utils';
import {
  ADD_OWNER_SCHEMA,
  DELETE_EVENT_SCHEMA,
  DELETE_PET_SCHEMA,
  PET_PROFILE_GQL,
  PET_SCHEMA,
  REMOVE_OWNER_SCHEMA,
} from '../hooks/api/schemas';
import { useActiveProfileTabStore } from '../providers/store/active-pet-profile-tab/ActivePetProfileTabProvider';

interface PetProfileGQLRes {
  getPet: PetResDto;
  getEventsByPet: EventResDto[];
}

interface EmailFormDialogValues {
  email: string;
}

interface RadioFormDialog {
  ownerId: string;
}

const getInitialRadioValues = (): RadioFormDialog => {
  return { ownerId: '' };
};

const getInitialEmailValues = (): EmailFormDialogValues => {
  return {
    email: '',
  };
};

const a11yTabProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const radioValidationSchema = Yup.object({
  ownerId: Yup.string().required(
    i18next.t('fieldRequiredValidator', { fieldName: i18next.t('owner') }),
  ),
});

const PetProfile = () => {
  const { id: petId } = useParams<{ id: string }>();
  const { data: user } = useUser();

  const { data, loading } = useQuery<PetProfileGQLRes>(PET_PROFILE_GQL, {
    variables: { petId },
  });

  const [addOwner, { loading: isAddOwnerLoading }] = useMutation(
    ADD_OWNER_SCHEMA,
    {
      refetchQueries: [{ query: PET_SCHEMA, variables: { id: petId } }],
    },
  );

  const petRemovedCacheUpdate = (cache: ApolloCache<any>) => {
    const petProfileCacheId = cache.identify({
      id: data?.getPet?._id,
      __typename: data?.getPet?.__typename,
    });
    // TODO: migrate Formik to https://react-hook-form.com/ (useFormik causes re-rendering issues)
    setTimeout(() => {
      cache.evict({ id: petProfileCacheId });
      // TODO: Dynamic id
      cache.evict({ id: `PetPreviewResDto:${petId}` });
      cache.gc();
    });
  };

  const [removeOwner, { loading: isRemoveOwnerLoading }] = useMutation(
    REMOVE_OWNER_SCHEMA,
    {
      update: petRemovedCacheUpdate,
      onCompleted: ({ removeOwner }: { removeOwner: RemoveOwnerResDto }) => {
        if (removeOwner?._id === user?.uid) {
          navigate('/home');
        }
      },
    },
  );

  const [deletePet, { loading: isDeletePetLoading }] = useMutation(
    DELETE_PET_SCHEMA,
    {
      update: petRemovedCacheUpdate,
      onCompleted: () => {
        navigate('/home');
      },
    },
  );

  const [deleteEvent, { loading: isDeleteEventLoading }] = useMutation(
    DELETE_EVENT_SCHEMA,
    {
      update: (
        cache: ApolloCache<any>,
        {
          data,
        }: { data?: { deleteEvent: DeleteEventResDto } | null | undefined },
      ) => {
        // TODO: migrate Formik to https://react-hook-form.com/ (useFormik causes re-rendering issues)
        setTimeout(() => {
          // TODO: Dynamic id
          cache.evict({ id: `EventResDto:${data?.deleteEvent?._id}` });
          cache.gc();
        });
      },
    },
  );

  const theme: any = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setIsLoading } = useLoaderStore();
  const { activeTab, setActiveTab } = useActiveProfileTabStore();
  const [addOwnerPetDialogOpen, setAddOwnerPetDialogOpen] =
    useState<boolean>(false);
  const [removeOwnerPetDialogOpen, setRemoveOwnerPetDialogOpen] =
    useState<boolean>(false);
  const [deletePetDialogOpen, setDeletePetDialogOpen] =
    useState<boolean>(false);
  const [deleteEventDialogState, setDeleteEventDialogState] = useState<{
    event: EventResDto | null;
    isOpen: boolean;
  }>({ event: null, isOpen: false });

  const emailValidationSchema = Yup.object({
    email: Yup.string()
      .email(t('invalidEmail'))
      .required(
        i18next.t('fieldRequiredValidator', { fieldName: i18next.t('email') }),
      )
      .test('email', '', function (ownerEmail = '') {
        const ownerExists: boolean = !!data?.getPet?.owners?.some(
          ({ email = '' }) =>
            email.trim().toLowerCase() === ownerEmail.trim().toLowerCase(),
        );
        const { path, createError } = this;
        return ownerExists
          ? createError({
              path,
              message: t('petOwnerExists', {
                ownerName: ownerEmail,
                petName: data?.getPet?.name || '',
              }),
            })
          : true;
      }),
  });

  const formikEmailOptions: FormikConfig<EmailFormDialogValues> = {
    initialValues: getInitialEmailValues(),
    validationSchema: emailValidationSchema,
    enableReinitialize: true,
    onSubmit: async ({ email }) => {
      togglePetAddOwnerFormDialog();
      const addOwnerReqDto: AddOwnerReqDto = {
        ownerEmail: email,
        petId: petId ?? '',
      };
      addOwner({ variables: { addOwnerReqDto } });
    },
  };

  const formikRadioOptions: FormikConfig<RadioFormDialog> = {
    initialValues: getInitialRadioValues(),
    validationSchema: radioValidationSchema,
    enableReinitialize: true,
    onSubmit: async ({ ownerId }) => {
      togglePetRemoveOwnerFormDialog();
      const removeOwnerReqDto: RemoveOwnerReqDto = {
        ownerId,
        petId: petId ?? '',
      };
      removeOwner({ variables: { removeOwnerReqDto } });
    },
  };

  useEffect(() => {
    setIsLoading(
      loading ||
        isAddOwnerLoading ||
        isRemoveOwnerLoading ||
        isDeletePetLoading ||
        isDeleteEventLoading,
    );
  }, [
    loading,
    setIsLoading,
    isAddOwnerLoading,
    isRemoveOwnerLoading,
    isDeletePetLoading,
    isDeleteEventLoading,
  ]);

  const formikEmailValues = useFormik(formikEmailOptions);
  const formikRadioValues = useFormik(formikRadioOptions);

  if (!data) {
    return <CenteredNoDataMessage />;
  }

  const { getPet: pet, getEventsByPet: events }: PetProfileGQLRes = data!;

  const togglePetAddOwnerFormDialog = () => {
    setAddOwnerPetDialogOpen(!addOwnerPetDialogOpen);
    formikEmailValues.resetForm();
  };

  const togglePetRemoveOwnerFormDialog = () => {
    setRemoveOwnerPetDialogOpen(!removeOwnerPetDialogOpen);
    formikRadioValues.resetForm();
  };

  const togglePetDeleteConfirmationDialog = () => {
    setDeletePetDialogOpen(!deletePetDialogOpen);
  };

  const toggleDeleteEventConfirmationDialog = (
    eventResDto: EventResDto | null,
  ) => {
    setDeleteEventDialogState({
      event: eventResDto,
      isOpen: !deleteEventDialogState.isOpen,
    });
  };

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handlePetDelete = () => {
    togglePetDeleteConfirmationDialog();
    const deletePetReqDto: DeletePetReqDto = {
      _id: petId ?? '',
    };
    deletePet({ variables: { deletePetReqDto } });
  };

  const handleEventDelete = () => {
    const deleteEventReqDto: DeleteEventReqDto = {
      _id: deleteEventDialogState.event!._id,
    };
    toggleDeleteEventConfirmationDialog(null);
    deleteEvent({ variables: { deleteEventReqDto } });
  };

  const renderPetInfoCard = () => {
    return (
      <PetInfoCard
        pet={pet}
        petActions={{
          updatePetLink: `/update-pet/${petId}`,
          onAddOwnerClick: togglePetAddOwnerFormDialog,
          onRemoveOwnerClick: togglePetRemoveOwnerFormDialog,
          onDeletePetClick: togglePetDeleteConfirmationDialog,
        }}
      />
    );
  };

  const renderPetEventsCard = () => {
    return (
      <PetEventsCard
        events={events}
        petId={petId ?? ''}
        onEventDeleteClick={toggleDeleteEventConfirmationDialog}
      />
    );
  };

  const renderMobileView = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="tabs"
            centered
          >
            <Tab label={t('profile')} {...a11yTabProps(0)} />
            <Tab label={t('events')} {...a11yTabProps(1)} />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {activeTab === 0 && renderPetInfoCard()}
          {activeTab === 1 && renderPetEventsCard()}
        </Grid>
      </Grid>
    );
  };

  const renderDesktopView = () => {
    return (
      <Grid container spacing={2} pt={2}>
        <Grid item xs={12} md={6}>
          {renderPetInfoCard()}
        </Grid>
        <Grid item xs={12} md={6} pb={2}>
          {renderPetEventsCard()}
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <EmailFormDialog
        open={addOwnerPetDialogOpen}
        dialogTitle={t('addOwner')}
        formikValues={formikEmailValues}
        dialogDescription={
          <>{t('addOwnerDialogDescription', { petName: pet?.name })}</>
        }
        onClose={togglePetAddOwnerFormDialog}
      />
      <OwnersFormDialog
        open={removeOwnerPetDialogOpen}
        dialogTitle={t('removeOwner')}
        formikValues={formikRadioValues}
        owners={pet.owners}
        dialogDescription={
          <>{t('removeOwnerDialogDescription', { petName: pet.name })}</>
        }
        onClose={togglePetRemoveOwnerFormDialog}
      />
      <AlertDialog
        dialogTitle={t('deletePet')}
        dialogDescription={t('deletePetDialogDescription', {
          petName: pet?.name,
        })}
        open={deletePetDialogOpen}
        onSubmit={handlePetDelete}
        onClose={togglePetDeleteConfirmationDialog}
      />
      <AlertDialog
        dialogTitle={t('deleteEvent')}
        dialogDescription={t('deleteEventDialogDescription', {
          eventName: deleteEventDialogState.event
            ? getEventLabel(deleteEventDialogState.event!.type)
            : null,
        })}
        open={deleteEventDialogState.isOpen}
        onSubmit={handleEventDelete}
        onClose={() => toggleDeleteEventConfirmationDialog(null)}
      />
      {!isMdUp && renderMobileView()}
      {isMdUp && renderDesktopView()}
    </>
  );
};

export default PetProfile;