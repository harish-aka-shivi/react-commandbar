import { MutableRefObject } from 'react';

import { DEFAULT_VIEW, DEFAULT_VIEW_ID } from './CommandBar.constants';
import { CommandBarItemType, SharedDataType, ViewType } from './CommandBar.types';
import { makeVar } from './utils/reactiveVar';

//TODO: reconsider reactive variables, it seems buggy for rerenders
// https://github.com/apollographql/apollo-client/issues/10065
// https://github.com/apollographql/apollo-client/issues/8681
// https://github.com/apollographql/apollo-client/issues?q=useReactiveVar&filterScopeGroup=true
export const enabledScopesVar = makeVar([] as string[]);

export const commandBarVisibilityVar = makeVar(false);
export const setCommandBarVisibilityVar = makeVar<((nextVisible: boolean) => void) | null>(null);

/*
 to-be used internally
  useCommand uses this map to keep track of registered commands.
  This represents the commands mapped to commandId for the Root view
*/
export const _idCommandsMapVar = makeVar({} as Record<string, CommandBarItemType>);
/*
  to-be used internally
  Map of views versus viewId used to track views registered using useView and command.subViews
*/
export const _idViewsMapVar = makeVar({ [DEFAULT_VIEW_ID]: DEFAULT_VIEW } as Record<string, ViewType>);

export const selectedViewIdVar = makeVar(DEFAULT_VIEW_ID);

/*
  All the views represented as an array
*/
export const allViewsVar = makeVar([] as ViewType[]);

//TODO: better name, should we keep it in reactive variable?
export const sharedDataVar = makeVar({
  /*
    Value typed in the search/input bar
  */
  inputValue: '',
  /*
    Array of commands selected in case we are on sublevels in view hierarchy
  */
  commandsPath: [],
  /*
    List of all the views selected as past of the view hierarchy
    For example: if we are on rename block view, possible view path can be
    Rename block selected (Root view) => blocks view (specific block selected) => rename block view
  */
  viewsPath: [],
} as SharedDataType);

export const focussedCommandBarItemVar = makeVar<CommandBarItemType | null>(null);

/*
  Reactive variable used internally to implement keyboard and mouse navigation inside command bar
*/
export const commandBarNavigationStateVar = makeVar<{
  refsMap: Record<string, MutableRefObject<HTMLDivElement | null>>;
  activeIndex: number;
  rootRef: React.MutableRefObject<HTMLDivElement | null> | null;
  searchBarRef: React.MutableRefObject<HTMLDivElement | null> | null;
}>({
  refsMap: {},
  activeIndex: 0,
  rootRef: null,
  searchBarRef: null,
});

export const commandBarSearchValueVar = makeVar<string>('');

// export const commandBarVisibleVar = makeVar<boolean>(false);
