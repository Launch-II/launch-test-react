import styles from './authentication.module.css';
import { Context } from '../../Context/globalContext';
import {
  Progress,
  Group,
  Paper,
  Box,
  Text,
  Button,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';

import { useEffect, useContext, useState } from 'react';

const Authentication = () => {
  const { authenticated, authenticate, authenticating, uiEventHandlers } =
    useContext(Context);

  const form = useForm({
    initialValues: {
      id: '',
    },
  });

  useEffect(() => {
    // console.log('Grimp!');
    if (localStorage.getItem('credentials')) {
      uiEventHandlers.authenticate(
        JSON.parse(localStorage.getItem('credentials'))
      );
    }
  }, []);

  return (
    <>
      <div className={styles.authenticationMain}>
        <div
          className={styles.authenticationBoxCont}
          global-data-component='paperContainer'>
          <h3>Authenticate</h3>
          <form
            onSubmit={form.onSubmit((values) =>
              uiEventHandlers.authenticate({ id: values.id })
            )}>
            <TextInput
              required
              label='Identification Number'
              placeholder='32 bit hash'
              {...form.getInputProps('id')}
            />
            <Group position='right' mt='md'>
              <Button type='submit'>Submit</Button>
            </Group>
          </form>
        </div>
        <Text className={styles.authText} size='sm'>
          Pre-Alpha build. App will eventually include full authentication
          service.
        </Text>
      </div>
    </>
  );
};

export default Authentication;
