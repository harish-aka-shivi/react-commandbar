// //TODO: consider this file extension
// //TODO: Does it make sense to organize shortcut like this?

// import { DependencyList } from 'react';
// import { useHotkeys } from 'react-hotkeys-hook';
// import { HotkeyCallback } from 'react-hotkeys-hook/dist/types';
// import { Key } from 'ts-key-enum';

// import { COMMAND_BAR_SHORTCUTS_SCOPE } from './CommandBar.constants';

// export const useDownHotkey = (handleScrollDown: HotkeyCallback, dependency: DependencyList) => {
//   useHotkeys(
//     Key.ArrowDown,
//     handleScrollDown,
//     { enableOnFormTags: ['INPUT'], scopes: COMMAND_BAR_SHORTCUTS_SCOPE },
//     dependency,
//   );
// };

// export const useUpHotkey = (handleScrollUp: HotkeyCallback, dependency: DependencyList) => {
//   useHotkeys(
//     Key.ArrowUp,
//     handleScrollUp,
//     { enableOnFormTags: ['INPUT'], scopes: COMMAND_BAR_SHORTCUTS_SCOPE },
//     dependency,
//   );
// };

// export const useEnterHotkey = (handleEnter: HotkeyCallback, dependency: DependencyList) => {
//   useHotkeys(Key.Enter, handleEnter, { enableOnFormTags: ['INPUT'], scopes: COMMAND_BAR_SHORTCUTS_SCOPE }, dependency);
// };

// // export const useCmdKHotkey = (handleCmdK: HotkeyCallback, dependency: DependencyList) => {
// //   useHotkeys(`${Key.Meta}+k`, handleCmdK, { enableOnFormTags: ['INPUT'] }, dependency);
// // };

// // export const useEscapeHotkey = (handleEscape: HotkeyCallback, dependency: DependencyList) => {
// //   useHotkeys(
// //     Key.Escape,
// //     handleEscape,
// //     { enableOnFormTags: ['INPUT'], scopes: COMMAND_BAR_SHORTCUTS_SCOPE },
// //     dependency,
// //   );
// // };
