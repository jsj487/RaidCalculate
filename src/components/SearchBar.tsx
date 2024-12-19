import React from "react";
import styled from "styled-components";
import { useLayoutContext } from "../components/LayoutProvider";

const SearchContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "ismainpage",
})<{ ismainpage: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== "ismainpage",
})<{ ismainpage: boolean }>`
  width: 600px;
  padding: ${(props) =>
    props.ismainpage ? "20px 30px" : "0.5rem 2.5rem 0.5rem 0.75rem"};
  border: 1px solid #ccc;
  border-radius: ${(props) => (props.ismainpage ? "20px" : "4px")};
  font-size: ${(props) => (props.ismainpage ? "20px" : "16px")};
  font-weight: 700;
  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SearchButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "ismainpage",
})<{ ismainpage: boolean }>`
  position: absolute;
  right: ${(props) => (props.ismainpage ? "30px" : "10px")};
  background: none;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  background-image: url(${process.env.PUBLIC_URL}/img/search.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  &:hover {
    filter: brightness(1.2);
  }
`;

interface SearchBarProps {
  ismainpage: boolean; // 메인 페이지 여부
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  ismainpage,
  search,
  setSearch,
  handleSearch,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <SearchContainer ismainpage={ismainpage}>
      <SearchInput
        ismainpage={ismainpage}
        type="text"
        placeholder="캐릭터 닉네임을 입력해주세요..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <SearchButton
        ismainpage={ismainpage}
        onClick={handleSearch}
      ></SearchButton>
    </SearchContainer>
  );
};

export default SearchBar;
