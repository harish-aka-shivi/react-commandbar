import { useEffect } from 'react';

// import { useHotkeysContext } from 'react-hotkeys-hook'
// import { useUpdateEffect } from 'react-use'
import { ROOT_VIEW } from '../CommandBar.constants';
// import { useCmdKHotkey, useEscapeHotkey } from '../CommandBar.hotkeys';
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
// import { useCommandBarState } from './useCommandBarState.hook';

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
  // const { visible } = useCommandBar();
  const visible = useReactiveVar(commandBarVisibilityVar);

  const selectedViewId = useReactiveVar(selectedViewIdVar);
  const selectedView = useSelectedView();

  // const { enableScope, disableScope } = useHotkeysContext();

  // const setInputValueRef = useRef(setInputValue);
  // setInputValueRef.current = setInputValue;

  // const handleCommandBarVisibility = (event: KeyboardEvent) => {
  //   event.preventDefault();
  //   setVisible((vis) => {
  //     return !vis;
  //   });
  // };

  // const handleEscape = (event: KeyboardEvent) => {
  //   event.preventDefault();
  //   setVisible(false);
  // };

  /*
    Keep the list of views and "Default View" commands updated against the internal map
  */
  useKeepDefaultCommandsUpdated();
  useKeepViewsUpdated();
  // useCmdKHotkey(handleCommandBarVisibility, [visible]);
  // useEscapeHotkey(handleEscape, [visible]);

  // /*  when view changes set the search value to null */
  // useEffect(() => {
  //   // const currentSelectedView = getCurrentSelectedView();
  //   // if (!currentSelectedView.inputValue) {
  //   //   // setInputValueRef.current('');
  //   // }
  //   commandBarSearchValueVar('')
  // }, [selectedViewId]);

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

      // setInputValueRef.current('');
      commandBarSearchValueVar('');
    } else {
      const currentDataVar = sharedDataVar();
      sharedDataVar({
        ...currentDataVar,
        viewsPath: [selectedView],
      });
    }
  }, [visible]);

  // useEffect(() => {
  //   if (visible) {
  //     enableScope(COMMAND_BAR_SHORTCUTS_SCOPE);
  //   } else {
  //     disableScope(COMMAND_BAR_SHORTCUTS_SCOPE);
  //   }
  // }, [visible, enableScope, disableScope]);
};
