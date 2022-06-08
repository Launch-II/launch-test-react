import {
  createContext,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import openSocket from 'socket.io-client';
import { smokeSignal } from 'smoke-signal-js';
import { helperFunctions } from '../helperFunctions';
import { byCode, byName } from '../commShortcodes';
import ByteBuffer from 'ByteBuffer';
import { useListState } from '@mantine/hooks';
import GameSimulation from './gameSimulation';
import Comms from './comms';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import preload, { preloadFunctions } from '../functions/preload';
const tickRate = 1000;

const tempConfig = {
  host: '127.0.0.1',
  port: '30069',
};

const authenticated = true;

export const LogicContext = ({ children }) => {
  // Router hooks

  let navigate = useNavigate();
  let location = useLocation();

  // []==============[]
  // [] GLOBAL STATE []
  // []==============[]
  const [preLoadState, setPreLoadState] = useState('');
  const [preLoadMessage, setPreLoadMessage] = useState('');
  const [preLoadPercentage, setPreLoadPercentage] = useState(0);

  const [preLoadComplete, setPreLoadComplete] = useState(false);

  const [cachedConfig, setCachedConfig] = useState(null);
  const [cachedCredentials, setCachedCredentials] = useState(null);
  const [tempCredentials, setTempCredentials] = useState(null);

  // oAuth Authentication States
  const [authenticated, setAuthenticated] = useState(null);
  const [config, setConfig] = useState(null);
  const [user, setUser] = useState(null);

  // Player Creation States
  const [player, setPlayer] = useState(null);

  // []=============[]
  // [] COMMS STATE []
  // []=============[]

  // The server session state.
  const [session, setSession] = useState(null);

  // []============[]
  // [] GAME STATE []
  // []============[]
  // All of the entities in the game. I may dynamically generate these in the future.
  const [alliances, alliancesHandler] = useListState([]);
  const [treaties, treatiesHandler] = useListState([]);
  const [players, playersHandler] = useListState([]);
  const [missiles, missilesHandler] = useListState([]);
  const [interceptors, interceptorsHandler] = useListState([]);
  const [missileSites, missileSitesHandler] = useListState([]);
  const [SAMSites, SAMSitesHandler] = useListState([]);
  const [sentryGuns, sentryGunsHandler] = useListState([]);
  const [oreMines, oreMinesHandler] = useListState([]);
  const [loots, lootsHandler] = useListState([]);
  const [radiations, radiationsHandler] = useListState([]);

  // This allows the game and the client session to communicate laterally.
  // This is a fundamental violation of React data flow, but I do not know how to do it otherwise.
  const gameRef = useRef();
  const commsRef = useRef();

  const callCommsFunction = async (functionName, parameters) => {
    if (parameters) {
      console.log(`Calling comms function ${functionName} with parameters:`);
      console.table({ parameters });
    } else {
      console.log(`Calling comms function ${functionName}.`);
    }

    let result = await commsRef.current.callFunction(functionName, parameters);
    return result;
  };

  const callGameFunction = (functionName, parameters) => {
    gameRef.current.callFunction(functionName, parameters);
  };

  // This is a collection of functions to retrieve stuff from local storage.
  // This is organized such that I don't have to pass a million functions.
  // I would put this in its own file, but it is easier to do it here so they may access global state.

  const storageFunctions = {
    credentials: {
      get: async () => {
        return localStorage.getItem('credentials');
      },
      clear: async () => {
        localStorage.clear('credentials');
        return;
      },
      set: async (data) => {
        localStorage.setItem('credentials', data);
        return;
      },
    },
    config: {
      get: async () => {},
      clear: async () => {},
      set: async (data) => {},
      checksum: async () => {},
    },
  };

  // This is a collection of functions which will be activated on ui events.
  // This is organized such that I don't have to pass a million functions.
  // I would put this in its own file, but it is easier to do it here so they may access global state.

  const uiEventHandlers = {
    testEvent() {
      callCommsFunction('testingOne');
    },
    authenticate(credentials) {
      console.log(credentials);
      setTempCredentials(credentials);
      callCommsFunction('sendMessage', {
        type: 'authentication',
        name: 'UserCredentials',
        data: {
          uid: credentials.id,
        },
      });
    },
  };

  // const startGameServices = () => {
  //   callCommsFunction(`enableConnectionAttempt`);
  //   let serviceLoop = setInterval(() => {
  //     callCommsFunction(`tick`);
  //     callGameFunction(`tick`);
  //   }, tickRate);
  // };

  // useEffect(() => {
  //   // If the temporary credentials are valid, cache them.
  //   if (tempCredentials) {
  //     localStorage.setItem('credentials', JSON.stringify(tempCredentials));
  //   }
  //   // We need to check and see if the user has an associated player. If not, they'll need to make one.
  //   if (user) console.log(user);
  // }, [user]);

  // []=================[]
  // [] MAIN USE EFFECT []
  // []=================[]

  useEffect(() => {
    // Pre-loads everything.
    // The router should stay stuck in /preload until preload is finalized.

    preload({
      setPreLoadState,
      setPreLoadMessage,
      setPreLoadPercentage,
      callCommsFunction,
    });
  }, []);

  // []========================[]
  // [] STATE CHANGE LISTENERS []
  // []========================[]
  // NOTE: I am going to try to avoid these in the global context.
  // At all costs. ONLY USE FOR DEBUGGING!

  useEffect(() => {
    if (session) console.log(session);
  }, [session]);

  // []=============[]
  // [] MAIN RENDER []
  // []=============[]

  // These will eventually need to be ordered, organized, and pruned for like... any readability.
  return (
    <Context.Provider
      value={{
        authenticated,
        setAuthenticated,
        config,
        user,
        uiEventHandlers,
        preLoadMessage,
        preLoadPercentage,
        preLoadState,
        cachedConfig,
        cachedCredentials,
        setUser,
        player,
        setPlayer,
        setCachedConfig,
        setCachedCredentials,
        setPreLoadState,
        setPreLoadMessage,
        setPreLoadPercentage,
        session,
        setSession,
        storageFunctions,
        preloadStages: preloadFunctions.functions.length + 2,
      }}>
      <>
        <GameSimulation
          tickRate={tickRate}
          siblingFunctions={{
            callCommsFunction,
            callGameFunction,
          }}
          callSiblingFunction={callCommsFunction}
          ref={gameRef}
        />
        <Comms
          tickRate={tickRate}
          callSiblingFunction={callGameFunction}
          ref={commsRef}
          tempConfig={tempConfig}
          siblingFunctions={{
            callCommsFunction,
            callGameFunction,
          }}
        />
        {/* Naughty routers get sent to the /preload */}
        {!preLoadComplete && location.pathname !== '/preload' ? (
          <Navigate to='/preload' />
        ) : null}
        {children}
      </>
    </Context.Provider>
  );
};

export const Context = createContext({});
