// import { useReactiveVar } from '@apollo/client'
import Fuse from 'fuse.js';
import { useMemo } from 'react';

import { DEFAULT_COMMAND_GROUP, FUSE_SEARCH_OPTIONS, ROOT_VIEW } from '../CommandBar.constants';
import { getSelectedView, isScopeInScopes } from '../CommandBar.helpers';
import { CommandBarItemType } from '../CommandBar.types';
import { allViewsVar, selectedViewIdVar } from '../CommandBar.vars';
import { useReactiveVar } from '../utils/reactiveVar';
import { useCommandBarState } from './useCommandBarState.hook';

/*
  Returns the appropriate command items to be shown in cmd-bar based on the searched query and grouped according to the group
  //TODO: think about optimizing it, if needed.
*/
export const useCommandsData = () => {
  const selectedView = useSelectedView();
  const disableSearch = selectedView.disableSearch;
  const { sharedData, enabledScopes } = useCommandBarState();

  const searchedTerm = sharedData.inputValue;

  const scopedCommands = useMemo(() => {
    return selectedView.commands.filter((command) => !command.scope || isScopeInScopes(command.scope, enabledScopes));
  }, [selectedView.commands, enabledScopes]);

  const visibleCommands = useMemo(() => {
    //FIXME: Commands should be part of view
    //
    if (selectedView.id === ROOT_VIEW.id) {
      return scopedCommands;
    }

    return selectedView?.commands ?? [];
  }, [selectedView, scopedCommands]);

  /*
    TODO: think about optimizing the search if it causes issues in future?
    We can try indexing by fuse-js
  */
  const searchedCommands = useMemo(() => {
    const fuse = new Fuse(visibleCommands, FUSE_SEARCH_OPTIONS);
    const trimmedSearch = searchedTerm?.trim() ?? '';
    if (trimmedSearch && !disableSearch) {
      const result = fuse.search(trimmedSearch);
      return result.map((item) => item.item);
    }
    return visibleCommands;
  }, [visibleCommands, searchedTerm, disableSearch]);

  const searchGroupedCommands = useMemo(() => {
    return searchedCommands.reduce((acc, command) => {
      const group = command.group ?? DEFAULT_COMMAND_GROUP;
      const groupLowerCase = group.trim().toLowerCase();
      acc[groupLowerCase] = acc[groupLowerCase] ? [...acc[groupLowerCase], command] : [command];
      return acc;
    }, {} as Record<string, CommandBarItemType[]>);
  }, [searchedCommands]);

  return useMemo(
    () => ({
      visibleCommands: Object.values(searchGroupedCommands).reduce(
        (acc, commands) => [...acc, ...commands],
        [] as CommandBarItemType[],
      ),
      visibleCommandsGrouped: searchGroupedCommands,
    }),
    [searchGroupedCommands],
  );
};

export const getCurrentSelectedView = () => {
  const allViews = allViewsVar();
  const selectedViewId = selectedViewIdVar();
  return getSelectedView(allViews, selectedViewId);
};

export const useSelectedView = () => {
  const allViews = useReactiveVar(allViewsVar);
  const selectedViewId = useReactiveVar(selectedViewIdVar);
  return useMemo(() => {
    return getSelectedView(allViews, selectedViewId);
  }, [selectedViewId, allViews]);
};
