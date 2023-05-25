/* import React, { useRef } from 'react';

import { ICONS } from '@/components';

import { CommandBarSearchBar } from './CommandBar.styles';

const SearchBar = ({
  value,
  placeholder,
  scope,
  onChange,
  registerRef,
}: {
  value?: string;
  placeholder?: string;
  scope?: string;
  onChange?: (nextValue: string) => void;
  registerRef: (ref: React.MutableRefObject<HTMLInputElement | null>) => void;
}) => {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  registerRef(searchRef);

 
  return (
    <CommandBarSearchBar
      autoFocus
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      prefix={{
        icon: ICONS.Search,
      }}
      transparent
      grow
      height={40}
      ref={searchRef}
    />
  );
};

export default SearchBar;
 */
