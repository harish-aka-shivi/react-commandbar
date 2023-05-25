// import * as RadixDialog from '@radix-ui/react-dialog';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

// import { Col, Description1, Modal, Row, Spacer } from '@/components'
import { DEFAULT_VIEW_ID } from './CommandBar.constants';
import { CommandBarItemType, UseCommandBarType, ViewConfigurationType } from './CommandBar.types';
// import { CommandBarRoot } from './CommandBar.styles'
import {
  // commandBarNavigationStateVar,
  commandBarSearchValueVar,
  commandBarVisibilityVar,
  setCommandBarVisibilityVar,
  // commandBarVisibleVar,
  // sharedDataVar,
} from './CommandBar.vars';
// import CommandBarItem from './CommandBarItem';
import { useCommandsData, useSelectedView } from './hooks/data.hooks';
import useCommandBarKeyboardNavigation from './hooks/keyboardNavigation.hooks';
import { useCommandBarSetup } from './hooks/setup.hooks';
// import { useCommandBar } from './hooks/useCommandBar.hook';
// import SearchBar from './SearchBar';
import { useReactiveVar } from './utils/reactiveVar';
// import { useControllableState } from './utils/useControllableState';

// type DialogProps = RadixDialog.DialogProps;

/**
 * Renders the command menu in a Radix Dialog.
 */
// const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, forwardedRef) => {
//   const { open, onOpenChange, overlayClassName, contentClassName, container, ...etc } = props
//   return (
//     <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
//       <RadixDialog.Portal container={container}>
//         <RadixDialog.Overlay cmdk-overlay="" className={overlayClassName} />
//         <RadixDialog.Content aria-label={props.label} cmdk-dialog="" className={contentClassName}>
//           <Command ref={forwardedRef} {...etc} />
//         </RadixDialog.Content>
//       </RadixDialog.Portal>
//     </RadixDialog.Root>
//   )
// })

// type CommandBarProps = {
//   preventDefaultCmdK?: boolean;
//   visible?: boolean;
//   onVisibleChanged?: boolean;
// };

// const CommandBar = () => {
//   const { visible, setVisible } = useCommandBar();

//   const selectedView = useSelectedView();

//   const { visibleCommandsGrouped } = useCommandsData();

//   const [inputValueInternal, setInternalInputValue] = useControllableState({
//     prop: selectedView.inputValue,
//     onChange: selectedView.onInputValueChange,
//   });

//   /*
//     Setup the command bar, initialize data, scopes and hotkeys
//   */
//   useCommandBarSetup(setInternalInputValue);

//   /*
//     Registration functions of refs for keyboard navigation
//   */
//   const { focussedItem, registerCommandItemRef, registerRootDivRef, registerSearchBarRef } =
//     useCommandBarKeyboardNavigation();

//   /*
//     If the inputValue changes, update the sharedData variable
//   */
//   useEffect(() => {
//     if (sharedDataVar().inputValue !== inputValueInternal) {
//       const currentData = sharedDataVar();
//       sharedDataVar({
//         ...currentData,
//         inputValue: inputValueInternal ?? '',
//       });
//     }
//   }, [inputValueInternal]);

//   const rootRef = useRef<HTMLDivElement | null>(null);
//   registerRootDivRef(rootRef);
//   return null;

//   // return (
//   //   <Modal>

//   //   </Modal>
//   //   // <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
//   //   //   <RadixDialog.Portal container={container}>
//   //   //     <RadixDialog.Overlay cmdk-overlay="" className={overlayClassName} />
//   //   //     <RadixDialog.Content cmdk-dialog="" className={contentClassName}>

//   //   //     </RadixDialog.Content></RadixDialog.Portal></RadixDialog.Root>
//   // )

//   // return (
//   //   <Modal
//   //     open={visible}
//   //     onInteractOutside={() => setVisible(false)}
//   //     header={
//   //       <SearchBar
//   //         value={inputValueInternal}
//   //         onChange={setInternalInputValue}
//   //         placeholder={selectedView.placeholder}
//   //         registerRef={registerSearchBarRef}
//   //       />
//   //     }
//   //     width={COMMAND_BAR_MODAL_WIDTH}
//   //     content={
//   //       <CommandBarRoot ref={rootRef} gap="large">
//   //         {Object.entries(visibleCommandsGrouped).map(([group, commands]) => {
//   //           return (
//   //             <Col key={group}>
//   //               <Row gap="none">
//   //                 <Spacer axis="horizontal" size="medium" />
//   //                 <Description1 $uppercase={true} color="secondary">
//   //                   {group}
//   //                 </Description1>
//   //               </Row>
//   //               <Col>
//   //                 {commands.map((command) => {
//   //                   return (
//   //                     <CommandBarItem
//   //                       icon={command.icon}
//   //                       title={command.title}
//   //                       id={command.id}
//   //                       key={command.id}
//   //                       focussed={focussedItem?.id === command.id}
//   //                       registerRef={registerCommandItemRef}
//   //                     />
//   //                   )
//   //                 })}
//   //               </Col>
//   //             </Col>
//   //           )
//   //         })}
//   //       </CommandBarRoot>
//   //     }
//   //   />
//   // )
// };

// export default CommandBar;

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

  // const [inputValueInternal, setInternalInputValue] = useControllableState({
  //   prop: selectedView.id === DEFAULT_VIEW_ID ? inputValue : selectedView.inputValue,
  //   onChange: selectedView.onInputValueChange,
  // });

  /*
  Setup the command bar, initialize data, scopes and hotkeys
  */
  useCommandBarSetup();

  const visibilityRef = useRef(false);
  const searchBarRef = useRef<HTMLInputElement>(null);
  // const itemRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // add listener to search bar ref to keep track of the input value

  useEffect(() => {
    if (visibilityRef.current) {
      //
    }
  });

  // const selectedSearchBar =  useMemo(() => {selectedView.id === DEFAULT_VIEW_ID ? searchBar : selectedView.searchBar };

  const selected: ViewConfigurationType = useMemo(() => {
    const isDefaultViewSelected = selectedView.id === DEFAULT_VIEW_ID;

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
