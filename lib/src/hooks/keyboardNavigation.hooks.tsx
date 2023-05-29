import { MutableRefObject, useEffect, useMemo, useRef } from 'react';

// import { useDownHotkey, useEnterHotkey, useUpHotkey } from '../CommandBar.hotkeys';
import { CommandBarItemType } from '../CommandBar.types';
import {
  commandBarNavigationStateVar,
  commandBarVisibilityVar,
  focussedCommandBarItemVar,
  selectedViewIdVar,
} from '../CommandBar.vars';
import { stopPropagation } from '../utils/keyboard';
import { useReactiveVar } from '../utils/reactiveVar';
import { useUpdateEffect } from '../utils/useUpdateEffect';
import { useCommandsData } from './data.hooks';
import { useCommandBarState } from './useCommandBarState.hook';
import { useOnItemClick } from './useOnItemClick.hook';

/*
  Provides all the keyboard and mouse navigation for the command bar.
  It should be used at the root level only.

  Returns focussed command bar item and
  function to register refs for search bar, root div and individual command bar items
*/
const useCommandBarKeyboardNavigation = () => {
  const onItemClicked = useOnItemClick();
  const { visibleCommands } = useCommandsData();
  const selectedViewId = useReactiveVar(selectedViewIdVar);
  const focussedItem = useReactiveVar(focussedCommandBarItemVar);

  const itemClickedRef = useRef(onItemClicked);
  itemClickedRef.current = onItemClicked;

  useKeepSelectedCommandBarUpdated();

  useAdjustOutOfViewScrollPosition();

  useKeepSearchBarFocussed();

  useAssignEventHandlersToCommandBars(itemClickedRef.current);

  const visible = useReactiveVar(commandBarVisibilityVar);
  const { sharedData } = useCommandBarState();
  const search = sharedData.inputValue;

  // set the zeroth item focussed in case of the first mount of cmd bar
  useUpdateEffect(() => {
    setFirstCommandBarItemActive();
  }, [visible]);

  // whenever view type changes move the focus to zeroth item
  useUpdateEffect(() => {
    setFirstCommandBarItemActive();
  }, [selectedViewId]);

  // Whenever search bar text changes, change the focussed item
  useUpdateEffect(() => {
    setFirstCommandBarItemActive();
  }, [search]);

  // // scroll up and scrollDown and handled twice once with when focus on
  // // search bar and once with focus on everywhere else, because useHotkeys
  // // don't catch event when focus on input element
  // const handleScrollUp = (event: KeyboardEvent) => {
  //   const currentNavState = commandBarNavigationStateVar();
  //   const cmdBarItemFocussed = currentNavState.activeIndex;

  //   /*
  //     Move the focus on previous command bar item
  //   */
  //   if (cmdBarItemFocussed > 0) {
  //     stopPropagation(event);
  //     decrementCommandBarActiveIndex();
  //   } else {
  //     /*
  //       Scroll the root view
  //     */
  //     const rootElement = currentNavState.rootRef?.current;
  //     if (rootElement) {
  //       rootElement.scrollBy({ top: -100, behavior: 'smooth' });
  //     }
  //   }
  // };

  // const handleScrollDown = (event: KeyboardEvent) => {
  //   const currentNavState = commandBarNavigationStateVar();
  //   const cmdBarItemFocussed = currentNavState.activeIndex;

  //   /*
  //     Move the focus on next command bar item
  //   */
  //   if (cmdBarItemFocussed < visibleCommands.length - 1) {
  //     stopPropagation(event);
  //     incrementCommandBarActiveIndex();
  //   } else {
  //     /* scroll the root view */
  //     const rootElement = currentNavState.rootRef?.current;
  //     if (rootElement) {
  //       rootElement.scrollBy({ top: 100, behavior: 'smooth' });
  //     }
  //   }
  // };

  // Listen to shortcuts in case search bar is not focussed and cmd bar is open
  // Implements the same shortcuts as when search bar is focussed
  // useDownHotkey(handleScrollDown, [visibleCommands, selectedViewId, visible]);

  // useUpHotkey(handleScrollUp, [visibleCommands, selectedViewId]);

  // useEnterHotkey(handleEnter, [visibleCommands, selectedViewId]);

  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      const selectedIndex = commandBarNavigationStateVar().activeIndex;

      const selectedCommandBarItem = visibleCommands[selectedIndex];

      if (selectedCommandBarItem) {
        stopPropagation(event);
        itemClickedRef.current(selectedCommandBarItem);
      }
    };

    // scroll up and scrollDown and handled twice once with when focus on
    // search bar and once with focus on everywhere else, because useHotkeys
    // don't catch event when focus on input element
    const handleScrollUp = (event: KeyboardEvent) => {
      const currentNavState = commandBarNavigationStateVar();
      const cmdBarItemFocussed = currentNavState.activeIndex;

      /*
      Move the focus on previous command bar item
    */
      if (cmdBarItemFocussed > 0) {
        stopPropagation(event);
        decrementCommandBarActiveIndex();
      } else {
        /*
        Scroll the root view
      */
        const rootElement = currentNavState.rootRef?.current;
        if (rootElement) {
          rootElement.scrollBy({ top: -100, behavior: 'smooth' });
        }
      }
    };

    const handleScrollDown = (event: KeyboardEvent) => {
      const currentNavState = commandBarNavigationStateVar();
      const cmdBarItemFocussed = currentNavState.activeIndex;

      /*
      Move the focus on next command bar item
    */
      if (cmdBarItemFocussed < visibleCommands.length - 1) {
        stopPropagation(event);
        incrementCommandBarActiveIndex();
      } else {
        /* scroll the root view */
        const rootElement = currentNavState.rootRef?.current;
        if (rootElement) {
          rootElement.scrollBy({ top: 100, behavior: 'smooth' });
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (commandBarVisibilityVar()) {
        return;
      }
      stopPropagation(event);

      if (event.key === 'Enter') {
        handleEnter(event);
      } else if (event.key === 'ArrowUp') {
        handleScrollUp(event);
      } else if (event.key === 'ArrowDown') {
        handleScrollDown(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visibleCommands]);

  return useMemo(
    () => ({
      focussedItem,
      registerCommandItemRef,
      registerRootDivRef,
      registerSearchBarRef,
    }),
    [focussedItem],
  );
};

const registerRootDivRef = (ref: MutableRefObject<HTMLDivElement | null>) => {
  const currentState = commandBarNavigationStateVar();
  const savedRootRef = currentState.rootRef;

  if (ref === savedRootRef) return;

  commandBarNavigationStateVar({
    ...currentState,
    rootRef: ref,
  });
};

const registerSearchBarRef = (ref: MutableRefObject<HTMLInputElement | null>) => {
  const currentState = commandBarNavigationStateVar();
  const savedSearchBarRef = currentState.searchBarRef;

  if (ref === savedSearchBarRef) return;

  commandBarNavigationStateVar({
    ...currentState,
    searchBarRef: ref,
  });
};

/*
  Register the command refs for all the command bar items
  It save the command item ref to the map reactive var
*/
const registerCommandItemRef = (commandId: string, ref: MutableRefObject<HTMLDivElement | null>) => {
  const currentState = commandBarNavigationStateVar();
  if (ref && commandId) {
    const savedRef = currentState.refsMap[commandId];

    if (savedRef === ref) return;

    commandBarNavigationStateVar({
      ...currentState,
      refsMap: {
        ...currentState.refsMap,
        [commandId]: ref,
      },
    });
  }
};

/*
  assign the click/hover listener to the command items
*/
const useAssignEventHandlersToCommandBars = (onItemClicked: (item: CommandBarItemType) => void) => {
  const onItemClickedRef = useRef(onItemClicked);
  onItemClickedRef.current = onItemClicked;

  const { visibleCommands } = useCommandsData();
  const visibleCommandsRef = useRef(visibleCommands);
  visibleCommandsRef.current = visibleCommands;

  const commandBarState = useReactiveVar(commandBarNavigationStateVar);
  const commandItemRefMap = commandBarState.refsMap;
  /*
    Whenever command items map changes, assign the click and hover handlers to all the command items
  */
  useEffect(() => {
    const mouseOverListenerMap = {} as Record<string, () => void>;
    const clickListenerMap = {} as Record<string, () => void>;

    for (const [commandId, commandItemRef] of Object.entries(commandItemRefMap)) {
      const commandBarItemDiv = commandItemRef.current;
      if (commandBarItemDiv) {
        const handleMouseOver = () => {
          const hoveredCommandIndex = visibleCommandsRef.current.findIndex((command) => command.id === commandId);
          const currentState = commandBarNavigationStateVar();
          if (hoveredCommandIndex > -1 && hoveredCommandIndex !== currentState.activeIndex) {
            commandBarNavigationStateVar({
              ...currentState,
              activeIndex: hoveredCommandIndex,
            });
          }
        };
        mouseOverListenerMap[commandId] = handleMouseOver;
        commandBarItemDiv.addEventListener('mousemove', handleMouseOver);

        const handleClick = () => {
          const hoveredCommand = visibleCommandsRef.current.find((command) => command.id === commandId);
          if (hoveredCommand) {
            onItemClickedRef.current(hoveredCommand);
          }
        };
        clickListenerMap[commandId] = handleClick;
        commandBarItemDiv.addEventListener('click', handleClick);
      }
    }

    return () => {
      for (const [commandId, commandItemRef] of Object.entries(commandItemRefMap)) {
        const commandBarItemDiv = commandItemRef.current;
        if (commandBarItemDiv) {
          const mouseOverListener = mouseOverListenerMap[commandId];
          if (mouseOverListener) {
            commandBarItemDiv.addEventListener('mousemove', mouseOverListener);
          }

          const clickListener = clickListenerMap[commandId];
          if (clickListener) {
            commandBarItemDiv.addEventListener('click', clickListener);
          }
        }
      }
    };
  }, [commandItemRefMap]);
};

const setFirstCommandBarItemActive = () => {
  const currentState = commandBarNavigationStateVar();
  commandBarNavigationStateVar({
    ...currentState,
    activeIndex: 0,
  });
};

const incrementCommandBarActiveIndex = (size?: number) => {
  const currentState = commandBarNavigationStateVar();
  const currentIndex = currentState.activeIndex;

  if (size !== undefined && currentIndex >= size - 1) {
    return;
  }

  commandBarNavigationStateVar({
    ...currentState,
    activeIndex: currentState.activeIndex + 1,
  });
};

const decrementCommandBarActiveIndex = () => {
  const currentState = commandBarNavigationStateVar();
  const currentIndex = currentState.activeIndex;
  if (currentIndex > 0) {
    commandBarNavigationStateVar({
      ...currentState,
      activeIndex: currentIndex - 1,
    });
  }
};

const useKeepSearchBarFocussed = () => {
  const visible = useReactiveVar(commandBarVisibilityVar);

  const selectedViewId = useReactiveVar(selectedViewIdVar);

  // It put the focus back on search bar, if the view changes and same search bar is rendered
  useEffect(() => {
    const currentState = commandBarNavigationStateVar();
    const searchBarRef = currentState.searchBarRef;
    const searchBar = searchBarRef?.current;
    if (searchBar) {
      setTimeout(() => {
        searchBar.focus();
      }, 0);
    }
  }, [visible, selectedViewId]);

  useEffect(() => {
    const currentState = commandBarNavigationStateVar();
    const searchBarRef = currentState.searchBarRef;
    const searchBar = searchBarRef?.current;
    if (searchBar) {
      const reFocusOnBlur = () => {
        searchBar?.focus();
      };
      searchBar.addEventListener('blur', reFocusOnBlur);
      return () => {
        searchBar?.removeEventListener('blur', reFocusOnBlur);
      };
    }
  }, []);
};

const useKeepSelectedCommandBarUpdated = () => {
  const navState = useReactiveVar(commandBarNavigationStateVar);

  const { visibleCommands } = useCommandsData();
  const selectedIndex = navState.activeIndex;

  useEffect(() => {
    focussedCommandBarItemVar(visibleCommands[selectedIndex]);
  }, [visibleCommands, selectedIndex]);
};

const useAdjustOutOfViewScrollPosition = () => {
  const focussedItem = useReactiveVar(focussedCommandBarItemVar);
  useEffect(() => {
    const currentNavState = commandBarNavigationStateVar();
    const refsMap = currentNavState.refsMap;
    if (focussedItem) {
      const focussedCommandBarItem = refsMap[focussedItem.id]?.current;
      const rootElement = currentNavState.rootRef?.current;
      if (focussedCommandBarItem && rootElement) {
        const focussedCommandBarItemRefRect = focussedCommandBarItem.getBoundingClientRect();
        const rootListRect = rootElement.getBoundingClientRect();
        if (focussedCommandBarItemRefRect.bottom > rootListRect.bottom) {
          focussedCommandBarItem.scrollIntoView(false);
        }
        if (focussedCommandBarItemRefRect.top < rootListRect.top) {
          focussedCommandBarItem.scrollIntoView(true);
        }
      }
    }
  }, [focussedItem]);
};

export default useCommandBarKeyboardNavigation;
