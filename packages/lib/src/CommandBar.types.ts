import { KEYWORDS_KEY_NAME, TITLE_KEY_NAME } from './CommandBar.constants';

export type SetVisibleType = (nextValue: boolean | ((prevValue: boolean) => boolean), viewId?: string) => void;

export type SearchInputType = {
  inputValue?: string;
  placeholder?: string;
  onInputValueChange?: (newValue: string) => void;
};

export type ViewConfigurationType = {
  searchBar: ({
    value,
    setValue,
    ref,
  }: {
    value: string | undefined;
    setValue: (newVal: string) => void;
    ref: React.MutableRefObject<HTMLElement | null>;
  }) => React.ReactNode;
  item: ({ item, focussed }: { item: CommandBarItemType; focussed: boolean }) => React.ReactNode;
  group: ({ group }: { group: string }) => React.ReactNode;
};

export type UseCommandBarType = {
  visible: boolean;
  setVisible: (nextVisible: boolean) => void;
} & ViewConfigurationType;

export type ViewType = {
  name?: string;
  id: string;
  commands: CommandBarItemType[];
  // TODO: rename this
  disableSearch?: boolean;
} & Partial<ViewConfigurationType>;

export type CommandBarItemType = {
  id: string;

  [TITLE_KEY_NAME]: string;

  /*
    List of key-words you want this shortcut to be searched by
  */
  [KEYWORDS_KEY_NAME]?: string[];

  //TODO: name this different
  subViews?: ViewType[];

  //TODO: move this/scope/group out in the hook?
  onClick: (item: CommandBarItemType) => string | boolean | undefined | void;

  // icon?: ICONS;

  // case insensitive list of scopes this command item belongs to
  // TODO: also enable it for arrays?
  scope?: string;

  // group to which this command item belongs
  // This is case insensitive
  // Default scope = GENERAL
  group?: string;
};

export type SharedDataType = Record<string, any> & {
  inputValue: string;
  commandsPath: CommandBarItemType[];
  viewsPath: ViewType[];
};

export type SharedDataKeys = Exclude<string, '' | 'inputValue' | 'commandsPath' | 'viewPath'>;
