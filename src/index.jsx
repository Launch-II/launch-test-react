// React
import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
// Context
import { Context, LogicContext } from './Context/globalContext';
// Mantine
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  LoadingOverlay,
  ScrollArea,
  MantineProvider,
  Notification,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { X } from 'tabler-icons-react';
import {
  MemoryRouter,
  Route,
  Routes,
  Navigate,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { SwitchTransition, Transition } from 'react-transition-group';
import gsap from 'gsap';

// Components and Screens
import App from './App';
import Authentication from './Screens/Authentication';
import Loading from './Screens/Loading';
import PlayerCreation from './Screens/PlayerCreation';

// Modals
import ErrorModal from './ErrorModal';
import Preloader from './Screens/Preloader';

// A project for another day.

const NetworkingError = () => {
  return <LoadingOverlay visible={true} />;
};
const Render = ({ children }) => {
  const { uiEventHandlers, user, preLoadState, superSessionAlive, player } =
    useContext(Context);

  const [routerState, setRouterState] = useState('preLoading');

  const theme = useMantineTheme();

  // let navigate = useNavigate();
  let location = useLocation();

  // useHotkeys([
  //   [
  //     'mod+J',
  //     () => {
  //       uiEventHandlers.testEvent();
  //     },
  //   ],
  // ]);

  return (
    <MantineProvider
      theme={{ colorScheme: 'dark' }}
      withGlobalStyles
      withNormalizeCSS>
      <main className='mainContainer'>
        <ModalsProvider modals={{ error: ErrorModal }}>
          <SwitchTransition>
            <Transition
              key={location.pathname}
              timeout={500}
              in={true}
              onEnter={(node) => {
                gsap.from(node, {
                  duration: 0.5,
                  // x: '100%',
                  ease: gsap.Power4,
                  opacity: '0%',
                });
                gsap.to(node, {
                  // x: '0%',
                  ease: gsap.Power4,
                  opacity: '100%',
                });
              }}
              onExit={(node) => {
                gsap.to(node, {
                  duration: 0.5,
                  // x: '-100%',
                  ease: gsap.Power4,
                  opacity: '0%',
                });
              }}
              mountOnEnter={true}
              unmountOnExit={true}>
              <Routes>
                <Route exact path='/preload' element={<Preloader />} />
                {/* <Route exact path='/preLoading' element={<Loading />} /> */}
                <Route
                  exact
                  path='/authentication'
                  element={<Authentication />}
                />
                <Route
                  exact
                  path='/playerCreation'
                  element={<PlayerCreation />}
                />
                <Route exact path='/authed/*' element={<App theme={theme} />} />
                {/* <Route exact path='*' element={<Navigate to='preLoading' />} /> */}
              </Routes>
            </Transition>
          </SwitchTransition>
        </ModalsProvider>
      </main>
    </MantineProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <MemoryRouter>
    <LogicContext>
      <Render />
    </LogicContext>
  </MemoryRouter>
);
