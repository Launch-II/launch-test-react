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

const tickRate = 1000;

const tempConfig = {
  host: '127.0.0.1',
  port: '30069',
};

const authenticated = true;

export const LogicContext = ({ children }) => {
  // []==============[]
  // [] GLOBAL STATE []
  // []==============[]
  const [preLoadState, setPreLoadState] = useState('Initializing');
  const [preLoadMessage, setPreLoadMessage] = useState(
    'Initializing services...'
  );
  const [preLoadPercentage, setPreLoadPercentage] = useState(0);

  const [cachedConfig, setCachedConfig] = useState(null);
  const [cachedCredentials, setCachedCredentials] = useState(null);
  const [tempCredentials, setTempCredentials] = useState(null);

  // oAuth Authentication States
  const [authenticated, setAuthenticated] = useState(null);
  const [authenticating, setAuthenticating] = useState(false);
  const [config, setConfig] = useState(null);
  const [user, setUser] = useState(null);

  // Player Creation States
  const [player, setPlayer] = useState(null);
  const [playerCreationState, setPlayerCreationState] =
    useState('Warming up...');

  const [superSessionAlive, setSuperSessionAlive] = useState(false);
  // []============[]
  // [] GAME STATE []
  // []============[]
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

  const gameRef = useRef();
  const commsRef = useRef();

  const callCommsFunction = (functionName, parameters) => {
    if (parameters) {
      console.log(`Calling comms function ${functionName} with parameters:`);
      console.table(parameters);
    } else {
      console.log(`Calling comms function ${functionName}.`);
    }
    commsRef.current.callFunction(functionName, parameters);
  };
  const callGameFunction = (functionName, parameters) => {
    gameRef.current.callFunction(functionName, parameters);
  };

  const startGameServices = () => {
    callCommsFunction(`enableConnectionAttempt`);
    let serviceLoop = setInterval(() => {
      callCommsFunction(`tick`);
      callGameFunction(`tick`);
    }, tickRate);
  };

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
    playerCreation(data) {
      setPlayerCreationState('Sending to server...');
      // Don't worry about it. It's fine.
      setPlayerCreationState('Awaiting response...');
      callCommsFunction('sendMessage', {
        type: 'entity',
        name: 'CreatePlayer',
        data,
      });
    },
  };

  // useEffect(() => {
  //   preLoad();
  // }, []);

  // Types = config, authentication, command, object, request, message, notification
  const toSmobject = ({ data = 'nodata', type = 'notype', name = 'noid' }) => {
    // Not particularly useful now, but will be used to construct data eventually.
    return {
      name,
      type,
      data,
    };
  };

  // I should be banned from the internet for coding such a thing.

  useEffect(() => {
    if (preLoadState == 'Complete') {
      startGameServices();
      // console.log(JSON.parse(localStorage.getItem('credentials')).id);
    }
  }, [preLoadState]);

  useEffect(() => {
    console.log({ superSessionAlive });
  }, [superSessionAlive]);

  useEffect(() => {
    console.log({ player });
  }, [player]);

  useEffect(() => {
    // If the temporary credentials are valid, cache them.
    if (tempCredentials) {
      localStorage.setItem('credentials', JSON.stringify(tempCredentials));
    }
    // We need to check and see if the user has an associated player. If not, they'll need to make one.
    if (user) console.log(user);
  }, [user]);

  return (
    <Context.Provider
      value={{
        authenticated,
        setAuthenticated,
        config,
        user,
        uiEventHandlers,
        toSmobject,
        preLoadMessage,
        preLoadPercentage,
        preLoadState,
        cachedConfig,
        superSessionAlive,
        setSuperSessionAlive,
        cachedCredentials,
        setUser,
        player,
        setPlayer,
        setCachedConfig,
        setCachedCredentials,
        setPreLoadState,
        setPreLoadMessage,
        setPreLoadPercentage,
        playerCreationState,
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
        {children}
      </>
    </Context.Provider>
  );
};

export const Context = createContext({});
