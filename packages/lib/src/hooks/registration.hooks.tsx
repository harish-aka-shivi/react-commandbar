import { DependencyList, MutableRefObject, useEffect, useRef } from 'react';

import { ROOT_VIEW } from '../CommandBar.constants';
import { CommandBarItemType, ViewType } from '../CommandBar.types';
import { _idCommandsMapVar, _idViewsMapVar } from '../CommandBar.vars';

export const useView = (view: ViewType[] | ViewType, dependencies?: DependencyList) => {
  const viewArr = Array.isArray(view) ? view : [view];
  const viewRef = useRef(viewArr);
  viewRef.current = viewArr;

  useEffect(() => {
    const viewCurrent = viewRef.current;

    /*
      Getting value from reactive var, won't rerender
    */
    viewCurrent.forEach((view) => {
      if (view.id !== ROOT_VIEW.id) {
        const idViewsCurrentMap = _idViewsMapVar();
        _idViewsMapVar({
          ...idViewsCurrentMap,
          [view.id]: view,
        });
      } else {
        console.warn('Unable to register view because the view id is equals to root view id', 'color: yellow;');
      }
    });

    return () => {
      const currentIdViewsMapOnReturn = _idViewsMapVar();

      const argViewsIds = viewCurrent.map((_view) => _view.id);

      _idViewsMapVar(
        Object.entries(currentIdViewsMapOnReturn).reduce((acc, [key, value]) => {
          if (argViewsIds.includes(key)) {
            return acc;
          }
          acc[key] = value;
          return acc;
        }, {} as Record<string, ViewType>),
      );
    };
    /*
      Don't need ref dependencies and id here because we can be assured they won't cause rerender
      So we can ignore the eslint
    */
  }, dependencies ?? []);
};

export const useCommand = (command: CommandBarItemType, dependencies?: DependencyList) => {
  const commandRef: MutableRefObject<CommandBarItemType> = useRef(command);
  commandRef.current = command;

  useView(command.subViews ?? [], dependencies);

  useEffect(() => {
    const currentCommand = commandRef.current;
    const currentCommandId = currentCommand.id;
    /*
      Getting value from reactive var, won't rerender
    */
    const idCommandsCurrentMap = _idCommandsMapVar();

    _idCommandsMapVar({ ...idCommandsCurrentMap, [currentCommandId]: currentCommand });

    return () => {
      /*
        Delete this command on removing this command
        Get the latest values stored in the reactive var,
      */
      const currentIdCommandsMapOnReturn = _idCommandsMapVar();

      _idCommandsMapVar(
        // delete the entries
        Object.entries(currentIdCommandsMapOnReturn).reduce((acc, [key, value]) => {
          if (key === currentCommandId) {
            return acc;
          }
          acc[key] = value;
          return acc;
        }, {} as Record<string, CommandBarItemType>),
      );
    };
    /*
      Don't need ref dependencies and id here because we can be assured they won't cause rerender
      So we can ignore the eslint
    */
  }, dependencies ?? []);
};
