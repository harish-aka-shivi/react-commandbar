import { useCallback } from 'react';

import { CommandBarItemType } from '../CommandBar.types';
import {
  allViewsVar,
  commandBarSearchValueVar,
  selectedViewIdVar,
  setCommandBarVisibilityVar,
  sharedDataVar,
} from '../CommandBar.vars';
import { useReactiveVar } from '../utils/reactiveVar';

export const useOnItemClick = () => {
  const allViews = useReactiveVar(allViewsVar);
  const selectedViewId = useReactiveVar(selectedViewIdVar);

  const handleItemClick = useCallback(
    (item: CommandBarItemType) => {
      const onClick = item.onClick;
      //TODO: pass the meta data of active block or active board
      const result = onClick(item);

      if (typeof result === 'string') {
        const resultViewId = result;
        const resultView = allViews.find((_view) => _view.id === resultViewId);

        if (resultView && selectedViewId !== resultView.id) {
          selectedViewIdVar(resultViewId);
          commandBarSearchValueVar('');
          const currentData = sharedDataVar();
          sharedDataVar({
            ...currentData,
            commandsPath: [...currentData.commandsPath, item],
            viewsPath: [...currentData.viewsPath, resultView],
          });
        }
        return;
      }

      if (typeof result === 'boolean' && !result) {
        return;
      }
      const setVisible = setCommandBarVisibilityVar();
      setVisible && setVisible(false);

      commandBarSearchValueVar();
    },
    [allViews, selectedViewId],
  );

  return handleItemClick;
};
