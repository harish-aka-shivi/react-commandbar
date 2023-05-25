// import { useCallback, useMemo, useState } from 'react';

import { isScopeInScopes } from '../CommandBar.helpers';
import { SharedDataKeys } from '../CommandBar.types';
import {
  // allViewsVar,
  // commandBarVisibilityVar,
  enabledScopesVar,
  // selectedViewIdVar,
  sharedDataVar,
} from '../CommandBar.vars';
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

// const useCommandBarVisibility = (): [boolean, SetVisibleType] => {
//   const visible = useReactiveVar(commandBarVisibilityVar);
//   const [, forceRender] = useState(1);
//   const setVisible: SetVisibleType = useCallback(
//     (_visible: boolean | ((currentVisibilityArg: boolean) => boolean), viewId?: string) => {
//       let nextState = false;

//       if (typeof _visible === 'function') {
//         nextState = _visible(visible);
//       } else {
//         nextState = _visible;
//       }

//       // open the command bar with a given viewId
//       if (viewId && nextState) {
//         const view = allViewsVar().find((_view) => _view.id == viewId);
//         if (view) {
//           selectedViewIdVar(view.id);
//         }
//       }

//       commandBarVisibilityVar(nextState);

//       /*
//         Looks like a reactive variable bug because updating the reactiveVar
//         in the above line is not rerendering the hook.
//         This bug happens sometimes on hot reload, so adding this as a precaution
//       */
//       forceRender((count) => count + 1);
//     },
//     [visible],
//   );

//   return useMemo(() => [visible, setVisible], [visible, setVisible]);
// };

/*
  Can be used like useContext hook across the app
  returns the properties need for configuring the cmd-bar
*/
export const useCommandBarState = () => {
  const sharedData = useReactiveVar(sharedDataVar);
  // const [visible, setVisible] = useCommandBarVisibility();
  const enabledScopes = useReactiveVar(enabledScopesVar);

  return {
    sharedData,
    // visible,
    enabledScopes,
    addToSharedData,
    enableScope,
    disableScope,
    // setVisible,
  };
};
