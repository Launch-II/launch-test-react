import {
  Progress,
  Group,
  Paper,
  Box,
  Text,
  Button,
  TextInput,
  Stepper,
  Checkbox,
  NumberInput,
  Autocomplete,
  SegmentedControl,
  CheckboxGroup,
  Overlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import styles from './final.module.css';
import { useEffect, useContext, useState } from 'react';
import { useModals } from '@mantine/modals';

const Final = ({
  prevStep,
  nextStep,
  submitSubForm,
  setFormState,
  step,
  currentStep,
  formOneState,
  setFormTemp,
}) => {
  const modals = useModals();

  const form = useForm({
    initialValues: {
      discordTag: '',
      hearAboutUs: '',
      veterancy: false,
      timePlayed: '',
      serversPlayed: '',
    },

    validate: (values) => {
      console.log(values);
      return {
        discordTag: values.discordTag.match(/^.{3,32}#[0-9]{4}$/)
          ? null
          : 'Invalid Discord username',
      };
    },
  });

  // useEffect(() => {
  //   if (formOneState) {
  //     form.setValues(formOneState);
  //   }
  // }, []);

  return (
    <>
      <div className={styles.mainFormContainer}>
        <h3>Finalizing</h3>
        <form
          onSubmit={form.onSubmit((values) => {
            setFormState(values);
            nextStep();
          })}>
          <div className={styles.notButtonContainer}>
            <TextInput
              label='Discord Tag (if applicable)'
              placeholder='@username#0000'
              {...form.getInputProps('discordTag')}
            />
            <Autocomplete
              label='How did you hear about us?'
              placeholder='Begin typing for suggestions'
              limit={3}
              data={[
                'Discord',
                'Play Store',
                'Google',
                'Advertisement',
                'A friend',
              ]}
              onChange={(event) => {
                form.setFieldValue('hearAboutUs', event);
              }}
            />

            <SegmentedControl
              className={styles.veterancyStatus}
              label='Have you played Launch before?'
              size='sm'
              data={[
                { label: 'I am new to Counterforce', value: 'false' },
                { label: 'I am Launch veteran', value: 'true' },
              ]}
              value={form.values.veterancy}
              onChange={(event) => {
                console.log(event);
                form.setFieldValue('veterancy', event == 'true' ? true : false);
              }}
              fullWidth
            />
            <div
              data-veterancy-status={
                form.values.veterancy == true ? 'true' : 'false'
              }
              className={styles.veteranContainer}>
              <NumberInput
                //   defaultValue={0}
                className={styles.timePlayed}
                placeholder='How many years have you played?'
                label='Years played'
                hideControls
                {...form.getInputProps('timePlayed')}
              />
              <CheckboxGroup
                className={styles.serversPlayed}
                orientation='vertical'
                label='Select servers you played on'
                spacing='md'
                onChange={(value) => {
                  form.setFieldValue('serversPlayed', value);
                }}>
                <Checkbox value='Launch!' label='Launch!' />
                <Checkbox
                  value='Launch: Experimental'
                  label='Launch: Experimental'
                />
                <Checkbox
                  value='Launch II: Toadania'
                  label='Launch II: Toadania'
                />
                <Checkbox value='Counterforce' label='Counterforce' />
              </CheckboxGroup>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <Group position='right' mt='xl'>
              <Button
                variant='default'
                onClick={() => {
                  setFormTemp(form.values);
                  prevStep();
                }}>
                Back
              </Button>
              <Button type='submit'>Complete</Button>
            </Group>
          </div>
        </form>
      </div>
    </>
  );
};

export default Final;
