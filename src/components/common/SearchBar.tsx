import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { useLayoutContext } from "./LayoutProvider";

const SearchContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "ismainpage",
})<{ ismainpage: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== "ismainpage",
})<{ ismainpage: boolean; width?: string }>`
  width: ${(props) => props.width || "600px"};
  padding: 10px 16px 10px 36px;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 10px;
  font-size: 16px;
  color: #ddd;

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    border-color: #555;
  }

  @media (max-width: 768px) {
    width: 200px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 8px 14px 8px 32px;
  }
`;

const SearchButton = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "ismainpage",
})<{ ismainpage: boolean }>`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  svg {
    font-size: 16px;
    color: #aaa;
  }
`;

interface SearchBarProps {
  ismainpage: boolean;
  search: string;
  setSearch: (value: string) => void;
  handleSearch: () => void;
  placeholder?: string;
  width?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  ismainpage,
  search,
  setSearch,
  handleSearch,
  placeholder,
  width,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <SearchContainer ismainpage={ismainpage}>
      <SearchInput
        ismainpage={ismainpage}
        type="text"
        width={width}
        placeholder={placeholder || "캐릭터명을 입력하세요"}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <SearchButton ismainpage={ismainpage} onClick={handleSearch}>
        <FaSearch />
      </SearchButton>
    </SearchContainer>
  );
};

export default SearchBar;
