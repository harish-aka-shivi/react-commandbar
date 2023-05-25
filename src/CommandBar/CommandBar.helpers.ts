import { DEFAULT_VIEW } from './CommandBar.constants';
import { ViewType } from './CommandBar.types';

/*
  TODO: add trim and case insensitivity?
*/
export const isScopeInScopes = (scope: string, scopes: string[]) => {
  return scopes.includes(scope);
};

export const getSelectedView = (allViews: ViewType[], selectedViewId: string) => {
  return allViews.find((_view) => _view.id === selectedViewId) ?? DEFAULT_VIEW;
};
