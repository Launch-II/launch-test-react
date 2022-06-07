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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import styles from './personal.module.css';
import { useEffect, useContext, useState } from 'react';
import { useModals } from '@mantine/modals';

const Personal = ({
  prevStep,
  nextStep,
  submitSubForm,
  setFormState,
  step,
  currentStep,
  formOneState,
}) => {
  const modals = useModals();

  const form = useForm({
    initialValues: {
      age: 0,
      firstName: '',
      lastName: '',
      termsOfService: false,
    },

    validate: (values) => {
      console.log(values);
      return {
        firstName: values.firstName.length < 2 ? 'First name too short' : null,
        lastName: values.lastName.length < 2 ? 'Last name too short' : null,
        age:
          values.age === undefined
            ? 'Age is required'
            : values.age < 14
            ? 'You must be at least 14'
            : values.age > 100
            ? 'Geezer, put in your real age.'
            : null,
        termsOfService:
          values.termsOfService === true ? null : 'Must accept terms',
      };
    },
  });

  useEffect(() => {
    if (formOneState) {
      form.setValues(formOneState);
    }
  }, []);
  const openTosModal = () =>
    modals.openModal({
      title: 'Terms of Service',
      children: (
        <Text size='sm'>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum eum
          rerum officia fugiat cumque impedit illo voluptate repellat ipsa. Quam
          velit laboriosam eveniet, cumque soluta expedita deleniti quod dolore
          quaerat modi nesciunt nisi eum minus culpa perferendis reiciendis
          commodi voluptas facilis quidem non quas at. Laboriosam, excepturi
          voluptatibus accusamus nihil ab adipisci magnam atque officiis
          molestias, nemo animi. Corrupti beatae officiis voluptatibus. Eligendi
          in reprehenderit ducimus veritatis? Maxime, obcaecati minima suscipit
          facilis odit hic consectetur expedita quidem illum eveniet itaque,
          aperiam repellat sit laudantium eos ea, assumenda labore accusantium!{' '}
          <br />
          <br />A dolorum quia unde doloremque vero accusamus tempora quasi
          eaque quae perferendis architecto quam ut est voluptatem quod earum,
          fugit voluptatibus aperiam libero et animi! Numquam est repellendus
          repellat rerum consectetur. Ea, recusandae iste iure blanditiis omnis
          fuga aliquid natus ipsam ipsa reprehenderit obcaecati labore, harum
          qui magnam voluptatum tenetur possimus nemo quos? Deserunt molestiae
          repellat mollitia ut dolore impedit esse consequuntur minima?
          <br />
          <br />
          Quae, numquam. Architecto dicta corrupti ab ad delectus.
          Necessitatibus aspernatur modi tenetur ea pariatur, veniam beatae aut
          optio illum commodi, quis enim est quos recusandae perspiciatis id
          ullam non vitae laborum! Earum veniam repellendus soluta vero. Harum
          nobis illum adipisci nemo rerum, ab delectus, voluptate, quo earum
          dolorem ex. Commodi et voluptatem nesciunt aperiam? Voluptatum
          architecto ut ullam, error possimus dolorem iste! Consectetur autem,
          at officia voluptas veritatis molestiae non! Itaque, sunt iste,
          maiores ex, beatae nesciunt accusantium quia sequi officiis deserunt
          excepturi?
          <br />
          <br />
          Accusantium error aspernatur, odio quibusdam voluptas nemo similique
          cumque culpa corrupti facilis adipisci at nostrum neque et, laborum
          officiis dolorum. Sed, voluptatum consectetur. Libero magnam ipsam, id
          repellendus iusto doloremque dolor exercitationem alias eum expedita
          at odio quis maxime fugit cupiditate, vitae accusantium repellat
          facere? Blanditiis soluta perferendis quas! Quo dignissimos molestiae
          distinctio quod, vitae eum accusamus, voluptatum doloribus voluptates
          nobis minus commodi fugiat nihil.
        </Text>
      ),
    });

  return (
    <>
      <div className={styles.mainFormContainer}>
        <h3>Tell us a bit about yourself</h3>
        <form
          onSubmit={form.onSubmit((values) => {
            setFormState(values);
            nextStep();
          })}>
          <div className={styles.notButtonContainer}>
            <Group grow>
              <TextInput
                label='First Name'
                placeholder='Your first name'
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label='Last Name'
                placeholder='Your last name'
                {...form.getInputProps('lastName')}
              />
            </Group>
            <NumberInput
              //   defaultValue={0}
              placeholder='Your age'
              label='Your age'
              hideControls
              {...form.getInputProps('age')}
            />
            <Checkbox
              mt='md'
              onClick={(e) => {
                e.stopPropagation();
              }}
              label={
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                  }}>
                  You agree to our{' '}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      openTosModal();
                    }}
                    className={styles.tosBtn}>
                    Terms of Service
                  </span>
                </p>
              }
              {...form.getInputProps('termsOfService', { type: 'checkbox' })}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Group position='right' mt='xl'>
              <Button type='submit'>Next step</Button>
            </Group>
          </div>
        </form>
      </div>
    </>
  );
};

export default Personal;
