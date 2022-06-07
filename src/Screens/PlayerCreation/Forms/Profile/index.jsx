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
  LoadingOverlay,
  Avatar,
  Indicator,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import styles from './profile.module.css';
import { useEffect, useContext, useState, useRef } from 'react';
import { useModals } from '@mantine/modals';
import { helperFunctions } from '../../../../helperFunctions';

const Profile = ({
  prevStep,
  nextStep,
  submitSubForm,
  setFormState,
  step,
  currentStep,
  formOneState,
  formTwoState,
  setFormTemp,
}) => {
  const modals = useModals();

  const hiddenFileInput = useRef();

  const [userAvatar, setUserAvatar] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [bioLength, setBioLength] = useState(0);

  const form = useForm({
    initialValues: {
      username: '',
      userAvatar: '',
      bio: '',
    },

    validate: (values) => {
      console.log(values);
      return {
        username: values.username.length < 4 ? 'Username too short' : null,
        userAvatar: values.userAvatar.length < 2 ? 'File upload error' : null,
        bio: values.bio.length > 200 ? 'Nobody needs to know that much.' : null,
      };
    },
  });

  useEffect(() => {
    if (formTwoState) {
      console.log(formTwoState);
      form.setValues(formTwoState);
      setUserAvatar(formTwoState.userAvatar);
    }
  }, []);

  const handleFileChange = async (e) => {
    let fileUploaded = e.target.files[0];
    if (!fileUploaded) return;
    setUploadingImage(true);
    setTimeout(() => {
      // IF image isn't done processing in ten seconds, abort with error.
    }, 10000);
    let base64 = await helperFunctions.convertBase64(fileUploaded);
    setUserAvatar(base64);
    form.setFieldValue('userAvatar', base64);
    setUploadingImage(false);
  };

  return (
    <>
      <LoadingOverlay visible={uploadingImage} />
      <div className={styles.mainFormContainer}>
        <h3>Set up your profile</h3>
        <form
          onSubmit={form.onSubmit((values) => {
            setFormState(values);
            nextStep();
          })}>
          <div className={styles.notButtonContainer}>
            <input
              type='file'
              ref={hiddenFileInput}
              accept='.png, .jpg, .jpeg, .gif'
              onChange={(e) => {
                handleFileChange(e);
              }}
              style={{ display: 'none' }}
            />
            <Group position='center'>
              <Avatar
                className={styles.userUpload}
                data-avatar-filled={userAvatar ? 'true' : 'false'}
                color='red'
                radius='100%'
                src={userAvatar ? `${userAvatar}` : null}
                onClick={() => {
                  hiddenFileInput.current.click();
                }}
                size={120}>
                {!userAvatar
                  ? `${formOneState.firstName.slice(
                      0,
                      1
                    )}${formOneState.lastName.slice(0, 1)}`
                  : null}
              </Avatar>
            </Group>
            <TextInput
              label='Username'
              placeholder={`${formOneState.firstName} ${formOneState.lastName}`}
              {...form.getInputProps('username')}
            />
            <Indicator
              color={200 - bioLength > 0 ? 'blue' : 'red'}
              label={200 - bioLength < 30 ? 200 - bioLength : ''}
              size={200 - bioLength < 30 ? 'sm' : 0}
              position='bottom-end'>
              <Textarea
                className={styles.hearAboutUs}
                label='Bio'
                placeholder='Tell us about yourself. Max 200 characters.'
                autosize
                error={form.errors.bio || false}
                minRows={6}
                //   value={form.values.bio}
                onChange={(event) => {
                  form.setFieldValue('bio', event.currentTarget.value);
                  setBioLength(event.currentTarget.value.length);
                }}
                maxRows={6}
                //   {...form.getInputProps('bio')}
              />
            </Indicator>
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
              <Button type='submit'>Next step</Button>
            </Group>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
