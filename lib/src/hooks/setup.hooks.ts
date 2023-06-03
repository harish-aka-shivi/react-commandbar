import { useEffect } from 'react';

import { ROOT_VIEW } from '../CommandBar.constants';
import {
  _idCommandsMapVar,
  _idViewsMapVar,
  allViewsVar,
  commandBarSearchValueVar,
  commandBarVisibilityVar,
  selectedViewIdVar,
  sharedDataVar,
} from '../CommandBar.vars';
import { useReactiveVar } from '../utils/reactiveVar';
import { useUpdateEffect } from '../utils/useUpdateEffect';
import { useSelectedView } from './data.hooks';

export const useKeepViewsUpdated = () => {
  const viewsMap = useReactiveVar(_idViewsMapVar);

  useEffect(() => {
    allViewsVar(Object.values(_idViewsMapVar()));
  }, [viewsMap]);
};

export const useKeepDefaultCommandsUpdated = () => {
  const commandsMap = useReactiveVar(_idCommandsMapVar);
  useEffect(() => {
    const currentIdViewsMap = _idViewsMapVar();
    const defaultView = currentIdViewsMap[ROOT_VIEW.id];
    _idViewsMapVar({
      ...currentIdViewsMap,
      [ROOT_VIEW.id]: {
        ...defaultView,
        commands: Object.values(commandsMap),
      },
    });
  }, [commandsMap]);
};

export const useCommandBarSetup = () => {
  const visible = useReactiveVar(commandBarVisibilityVar);

  const selectedView = useSelectedView();

  /*
    Keep the list of views and "Default View" commands updated against the internal map
  */
  useKeepDefaultCommandsUpdated();
  useKeepViewsUpdated();

  /*
    When the visibility changes, rest the state the state
  */
  useUpdateEffect(() => {
    if (!visible) {
      // setVisibleCommands(scopedCommands)
      selectedViewIdVar(ROOT_VIEW.id);

      /*
        reset shared state
      */
      sharedDataVar({
        inputValue: '',
        commandsPath: [],
        viewsPath: [],
      });

      commandBarSearchValueVar('');
    } else {
      const currentDataVar = sharedDataVar();
      sharedDataVar({
        ...currentDataVar,
        viewsPath: [selectedView],
      });
    }
  }, [visible]);
};
