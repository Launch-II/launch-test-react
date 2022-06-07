import styles from './styles/app.module.css';

import {
  MemoryRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Context } from './Context/globalContext';

import { useHotkeys } from '@mantine/hooks';
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
  MantineProvider,
  Notification,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import Map from './Screens/Map';
import './styles/global.css';
// []=======================================================[]
// [] This is the main rendering logic and internal router. []
// []=======================================================[]

const DefaultRender = () => {
  return (
    <>
      <Navigate to='/authed/map' />
      <h4>
        Howdy! If you're seeing this screen, that means the internal router is
        massively boned.
      </h4>
    </>
  );
};

const App = ({ theme }) => {
  const [opened, setOpened] = useState(false);
  let location = useLocation();
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          paddingTop: `var(--mantine-header-height)!important`,
          paddingBottom: `0px!important`,
          paddingLeft: `0px!important`,
          paddingRight: `0px!important`,
          overflow: `hidden`,
        },
      }}
      navbarOffsetBreakpoint='sm'
      asideOffsetBreakpoint='sm'
      fixed
      navbar={
        <Navbar
          p='md'
          hiddenBreakpoint='sm'
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}>
          {/* <Text></Text> */}
        </Navbar>
      }
      header={
        <Header height={70} p='md'>
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size='sm'
                color={theme.colors.gray[6]}
                mr='xl'
              />
            </MediaQuery>

            <Text>Counterforce Mobile Client</Text>
          </div>
        </Header>
      }>
      <Routes>
        <Route path='/' element={<DefaultRender />} />
        <Route exact path='/map' element={<Map />} />
      </Routes>
    </AppShell>
  );
};

export default App;
