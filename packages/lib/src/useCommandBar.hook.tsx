import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { ROOT_VIEW } from './CommandBar.constants';
import { CommandBarItemType, UseCommandBarType, ViewConfigurationType } from './CommandBar.types';
import { commandBarSearchValueVar, commandBarVisibilityVar, setCommandBarVisibilityVar } from './CommandBar.vars';
import { useCommandsData, useSelectedView } from './hooks/data.hooks';
import useCommandBarKeyboardNavigation from './hooks/keyboardNavigation.hooks';
import { useCommandBarSetup } from './hooks/setup.hooks';
import { useReactiveVar } from './utils/reactiveVar';

/* 
    Usage

    useCommandBar(
        {
            searchBar: REact.ReactNode,
            (focussed, item) => React.ReactNode
            onCmdKPressed: (newValue: boolean) => void
        }
    )

*/

const useCommandBar = ({ visible, setVisible, searchBar, item, group }: UseCommandBarType) => {
  commandBarVisibilityVar(visible);
  setCommandBarVisibilityVar(setVisible);

  /*
    Registration functions of refs for keyboard navigation
  */
  const { focussedItem, registerRootDivRef, registerSearchBarRef } = useCommandBarKeyboardNavigation();

  const selectedView = useSelectedView();

  const { visibleCommandsGrouped } = useCommandsData();

  /*
  Setup the command bar, initialize data, scopes and hotkeys
  */
  useCommandBarSetup();

  const visibilityRef = useRef(false);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // add listener to search bar ref to keep track of the input value

  useEffect(() => {
    if (visibilityRef.current) {
      //TODO: remove
      console.log('remove');
    }
  });

  // const selectedSearchBar =  useMemo(() => {selectedView.id === DEFAULT_VIEW_ID ? searchBar : selectedView.searchBar };

  const selected: ViewConfigurationType = useMemo(() => {
    const isDefaultViewSelected = selectedView.id === ROOT_VIEW.id;

    let selectedSearchBar = searchBar;
    let selectedItem = item;
    let selectedGroup = group;
    if (!isDefaultViewSelected) {
      if (selectedView.searchBar) {
        selectedSearchBar = selectedView.searchBar;
      }
      if (selectedView.item) {
        selectedItem = selectedView.item;
      }
      if (selectedView.group) {
        selectedGroup = selectedView.group;
      }
    }

    return {
      searchBar: selectedSearchBar,
      item: selectedItem,
      group: selectedGroup,
    };
  }, [searchBar, item, selectedView, group]);

  const searchValue = useReactiveVar(commandBarSearchValueVar);

  const handleSearchBarValueChange = useCallback((value: string) => {
    commandBarSearchValueVar(value);
  }, []);

  const renderSearchBar = useCallback(() => {
    selected.searchBar({
      value: searchValue,
      setValue: handleSearchBarValueChange,
      ref: searchBarRef,
    });
  }, [selected, searchValue, handleSearchBarValueChange]);

  registerSearchBarRef(searchBarRef);
  registerRootDivRef(listRef);

  const renderItems = useCallback(() => {
    return (
      <div ref={listRef}>
        {Object.entries(visibleCommandsGrouped).map(([group, commands]) => {
          return (
            <>
              {selected.group({ group })}
              {/* {commands.map((command) => selected.item({ item: command, focussed: focussedItem?.id === command.id }))} */}
              {commands.map((command) => (
                <Item
                  key={command.id}
                  command={command}
                  renderChild={() => selected.item({ item: command, focussed: focussedItem?.id === command.id })}
                />
              ))}
            </>
          );
        })}
      </div>
    );
  }, [selected, visibleCommandsGrouped, focussedItem]);

  return useMemo(
    () => ({
      renderSearchBar,
      renderItems,
    }),
    [renderSearchBar, renderItems],
  );
};

const Item = ({ command, renderChild }: { command: CommandBarItemType; renderChild: () => React.ReactNode }) => {
  const { registerCommandItemRef } = useCommandBarKeyboardNavigation();

  const ref = useRef<HTMLDivElement | null>(null);

  registerCommandItemRef(command.id, ref);

  return <div ref={ref}>{renderChild()}</div>;
};

export default useCommandBar;
