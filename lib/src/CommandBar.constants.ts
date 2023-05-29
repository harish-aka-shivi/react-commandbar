import { nanoid } from 'nanoid';

import { ViewType } from './CommandBar.types';

// export const COMMAND_BAR_MODAL_WIDTH = '560px';

export const COMMAND_BAR_SHORTCUTS_SCOPE = 'CMD_BAR';

export const KEYWORDS_KEY_NAME = 'keywords';

export const TITLE_KEY_NAME = 'title';

export const FUSE_SEARCH_OPTIONS = {
  shouldSort: false,
  minMatchCharLength: 1,
  threshold: 0.1,
  ignoreLocation: true,
  keys: [TITLE_KEY_NAME, KEYWORDS_KEY_NAME],
};

export const DEFAULT_COMMAND_GROUP = 'general';

export const DEFAULT_VIEW_ID = nanoid();
export const DEFAULT_VIEW_NAME = 'Root';
export const DEFAULT_VIEW: ViewType = {
  id: DEFAULT_VIEW_ID,
  //FIXME: should we enable the group and scope in the commands of view?
  commands: [],
  // placeholder: 'Search',
  name: DEFAULT_VIEW_NAME,
};
