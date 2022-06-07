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

// A project for another day.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.children = props.children;
    this.errors = [];
  }
  logErrorToMyService(e, i) {
    this.errors.push({ error: e, info: i });
  }
  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    this.logErrorToMyService(error, info);

    // console.log({ error });
  }

  render() {
    return (
      <>
        {this.errors.length > 0 ? (
          <div className='notifScreen'>
            {this.errors.map((error, idx) => {
              return (
                <Notification
                  key={`ntf-${idx}`}
                  icon={<X size={18} />}
                  color='red'>
                  {error.message}
                </Notification>
              );
            })}
          </div>
        ) : null}
        {this.children}
      </>
    );
  }
}
const NetworkingError = () => {
  return <LoadingOverlay visible={true} />;
};
const Render = ({ children }) => {
  const { uiEventHandlers, user, preLoadState, superSessionAlive, player } =
    useContext(Context);

  const [routerState, setRouterState] = useState('preLoading');

  const theme = useMantineTheme();

  let navigate = useNavigate();
  let location = useLocation();
  var authed = false;
  useHotkeys([
    [
      'mod+J',
      () => {
        uiEventHandlers.testEvent();
      },
    ],
  ]);

  useEffect(() => {
    const calcRouterState = () => {
      if (!preLoadState == 'Complete') {
        return 'preLoading';
      }
      if (preLoadState == 'Complete' && superSessionAlive && !user && !player) {
        return 'authentication';
      }
      if (preLoadState == 'Complete' && superSessionAlive && user && !player) {
        return 'playerCreation';
      }
      if (preLoadState == 'Complete' && superSessionAlive && user && player) {
        authed = true;
        return 'authed';
      }
      return '';
    };
    if (!authed) {
      let temp = calcRouterState();
      if (temp !== routerState) {
        setRouterState(temp);
      }
    }
  }, [user, player, superSessionAlive, preLoadState]);

  useEffect(() => {
    if (routerState) {
      navigate(`/${routerState}`);
    }
    console.log({ location });
  }, [routerState]);
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
                <Route exact path='/preLoading' element={<Loading />} />
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
  <LogicContext>
    <MemoryRouter>
      <Render />
    </MemoryRouter>
  </LogicContext>
);
