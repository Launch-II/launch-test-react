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
    const [sessionAlive, setSessionAlive] = useState(false);
    const {
      toSmobject,
      authenticated,
      setAuthenticated,
      setUser,
      setPlayer,
      setSuperSessionAlive,
    } = useContext(Context);

    const [session, setSession] = useState(null);

    var socket;
    var keepaliveCount = 0;

    useEffect(() => {
      if (sessionAlive == true) {
        // console.log('sessionAlive:', sessionAlive);
        startListener();
      }
    }, [sessionAlive]);
    const startListener = () => {
      // This is where the comms listen for incoming data.
      session.on('data', async (data) => {
        console.log('{}====DATA===={}');
        console.table(data);
        if (handlers[data.name]) {
          handlers[data.name]({ siblingFunctions, data });
        } else {
          console.log(
            `Received data type: ${data.name} for which there is no handler.`
          );
        }
      });
    };

    const testingOne = () => {
      console.log('Sending test data', session);
      session.emit(
        'data',
        toSmobject({
          type: 'command',
          name: 'TestCommand',
          data: {
            keyOne: 'Bolshevik',
          },
        })
      );
    };

    const sendMessage = ({ type, name, data }) => {
      if (!session?.emit) {
        console.log('boob', { type, name, data });
      } else {
        session.emit(
          'data',
          toSmobject({
            type,
            name,
            data,
          })
        );
      }
    };

    const commsTick = () => {
      // This sends messages from the message queue every second. Simple as.
      if (sendQueue.length) {
        // This runs every second once the connection is open. It will iterate over messagesSendList and send as many messages as it can before the tick is over with.
        var messagesSent = 0;
        var timeElapsed = 0;

        while (timeElapsed < 999 && sendQueue.length) {
          let startTime = performance.now();

          try {
            // Will likely need to dispatch these asynchronously in the future.
            session.emit('data', sendQueue[0]);
            messagesSent++;
          } catch (e) {
            console.log(e);
          }
          sendQueueHandler.shift();
          let endTime = performance.now();
          timeElapsed = timeElapsed + (endTime - startTime);
        }
        if (!messagesSent) {
          if (keepaliveCount == 30) {
            // Send keepalive;
            console.log('Sending keepAlive');
            smokeSignal.sendCommand({ lCommand: byName('KeepAlive').code });
            keepaliveCount = 0;
            return;
          }
          keepaliveCount++;
          return;
        }
        if (messagesSent) {
          console.log(`Finished with ${messagesSent} transmission(s).`);
          return;
        }
      }
    };

    const enableConnectionAttempt = () => {
      if (sessionAlive == true) {
        console.log(
          '🐒 Some monkey is trying to start a new server connection even though it already exists.'
        );
        return;
      }
      console.log('Initializing connection...');
      socket = openSocket(`http://${tempConfig.host}:${tempConfig.port}`);
      socket.on('connect', (res) => {
        setSession(socket);
        setSessionAlive(true);
        setSuperSessionAlive(true);
        console.log('...Connection established');
      });
    };

    const tick = () => {
      //   console.log('Comms tick running...');
      commsTick();
    };

    useImperativeHandle(ref, () => ({
      // This will allow the Game Simulation to call functions within this scope.
      callFunction(f, a) {
        // console.log('called');
        if (!f == 'tick') {
          console.log({ f, a });
        }
        a ? eval(`${f}(${JSON.stringify(a)})`) : eval(`${f}()`);
      },
    }));

    return null;
  }
);

export default Comms;
