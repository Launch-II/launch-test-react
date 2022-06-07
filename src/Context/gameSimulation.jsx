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

const GameSimulation = forwardRef(
  ({ callSiblingFunction, tickRate, siblingFunctions }, ref) => {
    // All game state is inherited from Global Context
    const {
      alliances,
      alliancesHandler,
      treaties,
      treatiesHandler,
      players,
      playersHandler,
      missiles,
      missilesHandler,
      interceptors,
      interceptorsHandler,
      missileSites,
      missileSitesHandler,
      SAMSites,
      SAMSitesHandler,
      sentryGuns,
      sentryGunsHandler,
      oreMines,
      oreMinesHandler,
      loots,
      lootsHandler,
      radiations,
      radiationsHandler,
    } = useContext(Context);

    const tick = () => {
      // console.log('Game tick running...');
      // players.forEach((player, idx) => {
      //   if (!player.awol) {
      //     player.Tick(tickRate);
      //   }
      // });
      // missiles.forEach((missile, idx) => {
      //   missile.Tick();
      //   if (missile.flying) {
      //     let missileType = config.getMissileType(missile.getType());
      //     // let geoTarget = GetMissileTarget(missile);
      //     // if(missile.GetPosition().MoveToward(geoTarget, config.))
      //   }
      // });
      //   interceptors.forEach((interceptor, idx) => {});
      //   missileSites.forEach((missileSite, idx) => {});
      //   SAMsites.forEach((SAMsite, idx) => {});
      //   sentryGuns.forEach((sentryGun, idx) => {});
      //   oreMines.forEach((oreMine, idx) => {});
      //   loots.forEach((loot, idx) => {});
      //   radiations.forEach((radiation, idx) => {});
      //   alliances.forEach((alliance, idx) => {});
      //   treaties.forEach((treaty, idx) => {});
    };

    useImperativeHandle(ref, () => ({
      // This will allow the Game Simulation to call functions within this scope.

      callFunction(f, a) {
        a ? eval(`${f}(${JSON.stringify(a)})`) : eval(`${f}()`);
      },
    }));

    return null;
  }
);

export default GameSimulation;
