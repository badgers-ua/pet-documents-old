import { FormikHelpers, useFormik } from 'formik';
import useGetBreedsBySpeciesGQL from '../../hooks/api/useGetBreedsBySpeciesGQL';
import useCachedBreedsBySpeciesGQL from '../../hooks/cache/useCachedBreedsBySpeciesGQL';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import { DropDownOption, GENDER, SPECIES } from '../../types';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LocalTextField from '../../components/LocalTextField';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {
  getSortedGenderOptions,
  getSortedSpeciesOptions,
} from '../../utils/factory.utils';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getUserDateFormat } from '../../utils/date.utils';
import { DateTime } from 'luxon';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import i18next from 'i18next';

export interface CRUPetFormValues {
  name: string;
  species: DropDownOption<SPECIES> | null;
  breed: DropDownOption<string> | null;
  gender: DropDownOption<GENDER> | null;
  dateOfBirth: DateTime | null;
  weight: string;
  color: string;
  description: string;
}

interface CreateUpdatePetFormProps {
  submitButtonText: string;
  disabled: boolean;
  initialValues: CRUPetFormValues;
  onSubmit: (
    values: CRUPetFormValues,
    formikHelpers: FormikHelpers<CRUPetFormValues>,
  ) => void | Promise<any>;
}

const maxNameFieldLength = 20;
const maxColorFieldLength = 20;
const maxWeightFieldCount = 100;
const maxDescriptionFieldLength = 140;

const validationSchema = Yup.object({
  name: Yup.string()
    .max(
      maxNameFieldLength,
      `${i18next.t('fieldMaxLengthValidator', {
        fieldName: i18next.t('name'),
        count: maxNameFieldLength,
      })}`,
    )
    .required(
      `${i18next.t('fieldRequiredValidator', {
        fieldName: i18next.t('name'),
      })}`,
    ),
  species: Yup.object()
    .nullable()
    .required(
      `${i18next.t('fieldRequiredValidator', {
        fieldName: i18next.t('species'),
      })}`,
    ),
  breed: Yup.object().nullable(),
  gender: Yup.object().nullable(),
  weight: Yup.number().max(
    maxWeightFieldCount,
    `${i18next.t('fieldMaxWeightValidator', {
      count: maxWeightFieldCount,
    })}`,
  ),
  color: Yup.string().max(
    maxColorFieldLength,
    `${i18next.t('fieldMaxLengthValidator', {
      fieldName: i18next.t('weight'),
      count: maxColorFieldLength,
    })}`,
  ),
  description: Yup.string().max(
    maxDescriptionFieldLength,
    `${i18next.t('fieldMaxLengthValidator', {
      fieldName: i18next.t('description'),
      count: maxDescriptionFieldLength,
    })}`,
  ),
  dateOfBirth: Yup.date()
    .nullable()
    .typeError(
      i18next.t('fieldDateFormatValidator', {
        format: getUserDateFormat().toUpperCase(),
      }),
    )
    .max(
      DateTime.now()
        .set({ hour: 23, minute: 59, second: 59, millisecond: 59 })
        .toJSDate(),
      i18next.t('fieldDateOfBirthFutureDateValidator'),
    ),
});

const CreateUpdatePetForm = (props: CreateUpdatePetFormProps) => {
  const { submitButtonText, onSubmit, disabled, initialValues } = props;

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    validateField,
    setFieldTouched,
    values,
    touched,
    errors,
  } = useFormik<CRUPetFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });
  const { loadBreedsBySpecies, isLoadingBreeds } = useGetBreedsBySpeciesGQL();
  const { loadCachedBreedsBySpecies } = useCachedBreedsBySpeciesGQL();

  const { t } = useTranslation();

  useEffect(
    function handleSelectedSpeciesChanged() {
      const selectedSpeciesDropDownValue: DropDownOption<SPECIES> | null =
        values.species;
      if (!selectedSpeciesDropDownValue) {
        return;
      }
      const species: SPECIES = +(selectedSpeciesDropDownValue as any).value!;
      loadBreedsBySpecies(species);
    },
    [values.species, loadBreedsBySpecies, setFieldValue],
  );

  return (
    <Container maxWidth="sm">
      <Grid container pb={2}>
        <Grid item xs={12}>
          <form autoComplete="off" onSubmit={handleSubmit} noValidate>
            <Stack mt={2} spacing={2}>
              <LocalTextField
                fullWidth
                variant="outlined"
                label={t('name')}
                inputProps={{
                  maxLength: maxNameFieldLength,
                }}
                required
                name="name"
                error={!!touched.name && !!errors.name}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                helperText={touched.name && errors.name}
              />
              <Autocomplete
                fullWidth
                noOptionsText={t('noOptions')}
                isOptionEqualToValue={(option, value) => {
                  return option?.value === value?.value;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('species')}
                    variant="outlined"
                    required
                    error={!!touched.species && !!errors.species}
                    helperText={touched.species && errors.species}
                  />
                )}
                disabled={isLoadingBreeds}
                value={values.species}
                options={getSortedSpeciesOptions}
                getOptionLabel={({ label }) => label}
                onChange={async (_, val) => {
                  await setFieldValue('breed', null, true);
                  await setFieldValue('species', val, true);
                }}
                onBlur={() => {
                  setFieldTouched('species', true, true);
                }}
              />
              <Autocomplete
                fullWidth
                noOptionsText={t('noOptions')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('breed')}
                    variant="outlined"
                    helperText={!values.species && t('selectSpeciesFirst')}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {params.InputProps.endAdornment}
                          {isLoadingBreeds && (
                            <InputAdornment position="end">
                              <CircularProgress />
                            </InputAdornment>
                          )}
                        </>
                      ),
                    }}
                  />
                )}
                disabled={isLoadingBreeds || !values.species}
                value={values.breed}
                options={loadCachedBreedsBySpecies(+values?.species?.value!)}
                getOptionLabel={({ label }) => label}
                isOptionEqualToValue={(option, value) => {
                  return option?.value === value?.value;
                }}
                onChange={async (_, val) => {
                  await setFieldValue('breed', val);
                  validateField('breed');
                }}
                onBlur={async () => {
                  await setFieldTouched('breed');
                  validateField('breed');
                }}
              />
              <Autocomplete
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('gender')}
                    error={!!touched.gender && !!errors.gender}
                    helperText={touched.gender && errors.gender}
                  />
                )}
                value={values.gender}
                options={getSortedGenderOptions}
                getOptionLabel={({ label }) => label}
                isOptionEqualToValue={(option, value) => {
                  return option?.value === value?.value;
                }}
                onChange={async (_, val) => {
                  await setFieldValue('gender', val);
                  validateField('gender');
                }}
                onBlur={async () => {
                  await setFieldTouched('gender');
                  validateField('gender');
                }}
              />
              <FormControl
                error={!!touched.dateOfBirth && !!errors.dateOfBirth}
              >
                {/* // TODO: Translate date picker */}
                <DatePicker
                  label={t('birthday')}
                  inputFormat={getUserDateFormat()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!touched.dateOfBirth && !!errors.dateOfBirth}
                      onBlur={() => {
                        setFieldTouched('dateOfBirth', true, true);
                      }}
                    />
                  )}
                  disableFuture
                  onError={() => {
                    validateField('dateOfBirth');
                  }}
                  value={values.dateOfBirth}
                  onChange={async (val: DateTime | null) => {
                    await setFieldValue('dateOfBirth', val, true);
                    if (!(touched.dateOfBirth && errors.dateOfBirth)) {
                      return;
                    }
                    validateField('dateOfBirth');
                  }}
                />
                <FormHelperText>
                  {touched.dateOfBirth && errors.dateOfBirth}
                </FormHelperText>
              </FormControl>
              <LocalTextField
                fullWidth
                type="number"
                variant="outlined"
                label={t('weight')}
                name="weight"
                error={!!touched.weight && !!errors.weight}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.weight}
                helperText={touched.weight && errors.weight}
              />
              <LocalTextField
                fullWidth
                variant="outlined"
                label={t('color')}
                inputProps={{
                  maxLength: 20,
                }}
                name="color"
                error={!!touched.color && !!errors.color}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.color}
                helperText={touched.color && errors.color}
              />
              <LocalTextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                label={t('description')}
                inputProps={{
                  maxLength: 140,
                }}
                name="description"
                error={!!touched.description && !!errors.description}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                helperText={touched.description && errors.description}
              />
              <Button type="submit" variant="contained" disabled={disabled}>
                {submitButtonText}
              </Button>
            </Stack>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateUpdatePetForm;
