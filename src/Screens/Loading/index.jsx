import styles from './loading.module.css';
import { Context } from '../../Context/globalContext';
import { Progress, Group, Paper, Box } from '@mantine/core';
import { useEffect, useContext, useState } from 'react';

const Loading = () => {
  const {
    preLoadMessage,
    preLoadPercentage,
    setPreLoadState,
    setPreLoadMessage,
    setPreLoadPercentage,
    setCachedConfig,
    setCachedCredentials,
  } = useContext(Context);

  const preLoad = () => {
    let noSt = 5;
    let fauxLoad = true;
    const spl = (n, d, p) => {
      setPreLoadState(n);
      setPreLoadMessage(d);
      setPreLoadPercentage(p);
    };
    spl('Initializing', 'Initializing services..', 0);
    // Do preloading, I guess
    setTimeout(
      () => {
        spl('Config', 'Fetching local config...', (100 / noSt) * 1);
        setCachedConfig(localStorage.getItem('config'));
        setTimeout(
          () => {
            spl(
              'Credentials',
              'Fetching local credentials...',
              (100 / noSt) * 2
            );
            setCachedCredentials(localStorage.getItem('credentials'));
            setTimeout(
              () => {
                spl(
                  'DeviceChecks',
                  'Running device checks...',
                  (100 / noSt) * 3
                );
                setTimeout(
                  () => {
                    spl('Finishing', 'Finishing up...', (100 / noSt) * 4);
                    setTimeout(
                      () => {
                        spl('Complete', 'Complete', 100);
                      },
                      fauxLoad
                        ? Math.floor(Math.random() * (1000 - 60 + 1) + 60)
                        : 0
                    );
                  },
                  fauxLoad
                    ? Math.floor(Math.random() * (1000 - 60 + 1) + 60)
                    : 0
                );
              },
              fauxLoad ? Math.floor(Math.random() * (1000 - 60 + 1) + 60) : 0
            );
          },
          fauxLoad ? Math.floor(Math.random() * (1000 - 60 + 1) + 60) : 0
        );
      },
      fauxLoad ? Math.floor(Math.random() * (1000 - 60 + 1) + 60) : 0
    );
  };

  useEffect(() => {
    preLoad();
  }, []);

  return (
    <>
      <div className={styles.loadingMain}>
        <div
          className={styles.loadingBoxCont}
          global-data-component='paperContainer'>
          <h2>Loading...</h2>
          <Progress value={preLoadPercentage} />
          <p>{preLoadMessage}</p>
        </div>
      </div>
    </>
  );
};

export default Loading;
