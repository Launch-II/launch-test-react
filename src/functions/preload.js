import { helperFunctions } from '../helperFunctions';

const fauxLoad = (limit = 1000) => {
  if (true) return Math.floor(Math.random() * (limit - 60 + 1) + 60);
  return 0;
};

const preLoadColor = 'yellow';
const throwError = {
  critical: {},
  nonCritical: {},
};

export const preloadFunctions = {
  preliminary: {
    name: 'preliminary',
    description: 'Initializing preloader',
    execute: async () => {
      await helperFunctions.waitFor(fauxLoad());
      return true;
    },
  },
  functions: [
    {
      name: 'network',
      description: 'Opening a connection to the server',
      execute: async ({ callCommsFunction }) => {
        let result = await callCommsFunction('initializeConnection');
        return result;
      },
    },
    {
      name: 'listener',
      description: 'Initializing listener for incoming packets',
      execute: async ({ callCommsFunction }) => {
        let result = await callCommsFunction('initializeListener');
        return result;
      },
    },
    {
      name: 'config',
      description: 'Checking for local configuration file',
      execute: async () => {
        await helperFunctions.waitFor(fauxLoad());
        return 'Test2!';
      },
    },
    {
      name: 'credentials',
      description: 'Checking for local credentials',
      execute: async () => {
        await helperFunctions.waitFor(fauxLoad());
        return 'Test';
      },
    },
    {
      name: 'player',
      description: 'Checking for player account',
      execute: async () => {
        await helperFunctions.waitFor(fauxLoad());
        return 'Test';
      },
    },
    {
      name: 'test',
      description: 'Testing final preload',
      execute: async () => {
        await helperFunctions.waitFor(fauxLoad());
        return 'Test';
      },
    },
  ],
  finalize: {
    name: 'final',
    description: 'Populating application state',
    execute: async () => {
      await helperFunctions.waitFor(fauxLoad());
      return;
    },
  },
};

export default async ({
  setPreLoadState,
  setPreLoadMessage,
  setPreLoadPercentage,
  callCommsFunction,
}) => {
  return new Promise(async (resolve, reject) => {
    let functionsToProcess = [
      preloadFunctions.preliminary,
      ...preloadFunctions.functions,
      preloadFunctions.finalize,
    ];

    let final = {};
    let finalTime = 0;
    for (let i = 0; i < functionsToProcess.length; i++) {
      console.log(
        `%c [Beginning ${functionsToProcess[i].name}>`,
        `color: ${preLoadColor}`
      );

      let current = functionsToProcess[i];
      let startTime = performance.now();

      setPreLoadState(current.name);
      setPreLoadMessage(current.description);
      setPreLoadPercentage(i + 1);
      let result = await current.execute({
        callCommsFunction,
      });

      let endTime = performance.now();

      final[functionsToProcess[i].name] = {
        ExecutionTime: `${parseInt(endTime - startTime)}ms`,
        Result: result,
      };

      finalTime += parseInt(endTime - startTime);

      console.log(`result: ${result}`);
      console.log(
        `%c <Finished ${functionsToProcess[i].name}]`,
        `color: ${preLoadColor}`
      );
    }
    console.log(`%c [Finished preload in ${finalTime}ms]`, `color: pink`);
    console.table(final);
  });
};
