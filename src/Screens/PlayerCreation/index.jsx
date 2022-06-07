import styles from './playerCreation.module.css';
import { Context } from '../../Context/globalContext';
import {
  Progress,
  Group,
  Paper,
  Box,
  Text,
  Button,
  TextInput,
  Stepper,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import MissileImage from '../../Assets/illustrations/missilePreparing.svg';
import { useEffect, useContext, useState } from 'react';

import Personal from './Forms/Personal';
import Profile from './Forms/Profile';
import Final from './Forms/Final';
import Completed from './Completed';

const PlayerCreation = () => {
  const { authenticated, authenticate, authenticating, uiEventHandlers } =
    useContext(Context);

  const [formOne, setFormOne] = useState(null);
  const [formTwo, setFormTwo] = useState(null);
  const [formTwoTemp, setFormTwoTemp] = useState(null);
  const [formThree, setFormThree] = useState(null);
  const [formThreeTemp, setFormThreeTemp] = useState(null);

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <div className={styles.playerCreationMain}>
        <div
          className={styles.playerCreationBoxCont}
          global-data-component='paperContainer'
          breakpoint='xs'
          size='xs'>
          <Stepper
            orientation='horizontal'
            active={active}
            onStepClick={setActive}
            breakpoint='0'>
            <Stepper.Step allowStepSelect={false}>
              <Personal
                step={0}
                currentStep={active}
                setFormState={setFormOne}
                prevStep={prevStep}
                nextStep={nextStep}
                formOneState={formOne}
              />
            </Stepper.Step>
            <Stepper.Step allowStepSelect={false}>
              <Profile
                step={1}
                currentStep={active}
                setFormState={setFormTwo}
                prevStep={prevStep}
                nextStep={nextStep}
                formOneState={formOne}
                formTwoState={formTwo}
                formTemp={formTwoTemp}
                setFormTemp={setFormTwoTemp}
              />
            </Stepper.Step>
            <Stepper.Step allowStepSelect={false}>
              <Final
                step={2}
                currentStep={active}
                setFormState={setFormThree}
                prevStep={prevStep}
                nextStep={nextStep}
                formOneState={formOne}
                formTwoState={formTwo}
                formTemp={formThreeTemp}
                setFormTemp={setFormThreeTemp}
              />
            </Stepper.Step>
            <Stepper.Completed>
              <>
                <Completed
                  finalData={{ ...formOne, ...formTwo, ...formThree }}
                  MissileImage={MissileImage}
                />
              </>
            </Stepper.Completed>
          </Stepper>
        </div>
      </div>
    </>
  );
};

export default PlayerCreation;
