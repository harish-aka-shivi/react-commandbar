import { isScopeInScopes } from '../CommandBar.helpers';
import { SharedDataKeys } from '../CommandBar.types';
import { enabledScopesVar, sharedDataVar } from '../CommandBar.vars';
import { useReactiveVar } from '../utils/reactiveVar';

/*
  TODO: think about case insensitivity
*/
const enableScope = (scope: string[] | string) => {
  const currentEnabledScopes = enabledScopesVar();
  const scopes = Array.isArray(scope) ? scope : [scope];
  const newEnabledScopes = scopes.reduce((acc, _scope) => {
    if (!isScopeInScopes(_scope, currentEnabledScopes)) {
      acc = [...acc, _scope];
    }
    return acc;
  }, currentEnabledScopes);
  enabledScopesVar(newEnabledScopes);
};

const disableScope = (scope: string[] | string) => {
  const currentEnabledScopes = enabledScopesVar();
  const scopes = Array.isArray(scope) ? scope : [scope];
  const newEnabledScopes = currentEnabledScopes.filter((_scope) => !isScopeInScopes(_scope, scopes));
  enabledScopesVar(newEnabledScopes);
};

const addToSharedData = (key: SharedDataKeys, value: any) => {
  const currentData = sharedDataVar();
  sharedDataVar({
    ...currentData,
    [key]: value,
  });
};

/*
  Can be used like useContext hook across the app
  returns the properties need for configuring the cmd-bar
*/
export const useCommandBarState = () => {
  const sharedData = useReactiveVar(sharedDataVar);
  const enabledScopes = useReactiveVar(enabledScopesVar);

  return {
    sharedData,
    enabledScopes,
    addToSharedData,
    enableScope,
    disableScope,
  };
};
