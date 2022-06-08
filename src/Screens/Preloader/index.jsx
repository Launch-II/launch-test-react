import styles from './preloader.module.css';
import { Context } from '../../Context/globalContext';
import { Progress, Group, Paper, Box } from '@mantine/core';
import { useEffect, useContext, useState } from 'react';

const Preloader = () => {
  const { preLoadMessage, preLoadPercentage, preloadStages } =
    useContext(Context);

  return (
    <>
      <div className={styles.loadingMain}>
        <div
          className={styles.loadingBoxCont}
          global-data-component='paperContainer'>
          <h2>Loading...</h2>
          <Progress value={(preLoadPercentage / preloadStages) * 100} />
          <p>{preLoadMessage}</p>
        </div>
      </div>
    </>
  );
};

export default Preloader;
