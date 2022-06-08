import {
  createContext,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useContext,
} from 'react';

import { Context } from './globalContext';
import openSocket from 'socket.io-client';
import { smokeSignal } from 'smoke-signal-js';
import { helperFunctions } from '../helperFunctions';
import { useListState } from '@mantine/hooks';
import { byCode, byName } from '../commShortcodes';
import handlers from '../functions/handlers';

const Comms = forwardRef(
  ({ callSiblingFunction, tickRate, tempConfig, siblingFunctions }, ref) => {
    const [sendQueue, sendQueueHandler] = useListState([]);
    const {
      authenticated,
      setAuthenticated,
      setUser,
      setPlayer,
      setSuperSessionAlive,
      session,
      setSession,
    } = useContext(Context);

    // []=================[]
    // [] MAIN USE EFFECT []
    // []=================[]
    // NOTE: I want to try to avoid this, as all logic should be initialized externally.

    // []========================[]
    // [] STATE CHANGE LISTENERS []
    // []========================[]
    // NOTE: I may want to avoid these. Not sure.
    // When session is open, start handling incoming packets.

    // useEffect(() => {
    //   if (session) startListener();
    // }, [session]);

    const initializeConnection = async () => {
      let connectionEstablished = await new Promise(async (resolve, reject) => {
        if (session) {
          console.log(
            '🐒 Some monkey is trying to start a new server connection even though it already exists.'
          );
          resolve(false);
          return;
        }
        console.log('Initializing connection...');
        let socket = openSocket(`http://${tempConfig.host}:${tempConfig.port}`);
        socket.on('connect', (res) => {
          setSession(socket);
          console.log('...Connection established');
          resolve(true);
        });
      });
      return connectionEstablished;
    };

    const initializeListener = async () => {
      if (session) {
        session.on('data', async (data) => {
          console.table(data);
          if (handlers[data.name]) {
            handlers[data.name]({ siblingFunctions, data });
          } else {
            console.log(
              `Received data type: ${data.name} for which there is no handler.`
            );
          }
        });
        return 'Listening';
      } else {
        return 'No session';
      }
      // This is where the comms listens for incoming data.
      console.log('Now listening for incoming data...');
    };

    const sendMessage = ({ type, name, data }) => {
      if (!session?.emit) return;
      session.emit(
        'data',
        toSmobject({
          type,
          name,
          data,
        })
      );
    };

    // Command - Has only name and type.
    // Object - Has name, type, and data.
    // Request - Has name, type, may include data, and awaits a response from the server.
    // Other - List may be expanded as more robust data is required for features - like notification, direct message, etc.

    const toSmobject = ({
      data = 'nodata',
      type = 'notype',
      name = 'noid',
    }) => {
      // Not particularly useful now, but will be used to construct data eventually.
      return {
        name,
        type,
        data,
      };
    };

    useImperativeHandle(ref, () => ({
      // This will allow the Game Simulation to call functions within this scope.
      callFunction: async (f, a) => {
        if (a) {
          let result = await eval(`${f}(${JSON.stringify(a)})`);
          return result;
        } else {
          let result = await eval(`${f}()`);
          return result;
        }
      },
    }));

    // Returns nothing. Get over it.
    return null;
  }
);

export default Comms;
