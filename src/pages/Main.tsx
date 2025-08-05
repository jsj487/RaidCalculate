import React, { useState } from "react";
import styled from "styled-components";
import SearchBar from "../components/common/SearchBar";
import { useLayoutContext } from "../components/common/LayoutProvider";
import { releaseNotes, ReleaseNote } from "../utils/ReleaseNotes";

import { Helmet } from "react-helmet";
import "@fontsource/acme";
import { FaSearch } from "react-icons/fa";

const MainImage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100dvh; /* 화면 전체 높이 */
  background-image: url(${process.env
    .PUBLIC_URL}/img/Main_Background.jpg); /* 배경 이미지 경로 */
  background-size: cover; /* 화면에 꽉 차게 */
  background-position: center; /* 중앙 정렬 */
  background-repeat: no-repeat; /* 반복하지 않음 */
`;

const MainSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainSearchWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  max-width: 640px;
`;

const MainSearchInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 18px 20px 18px 48px;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid #555;
  border-radius: 50px;
  font-size: 20px;
  font-weight: bold;
  color: #ddd;

  &::placeholder {
    color: #aaa;
    font-weight: 500;
  }

  &:focus {
    outline: none;
    border-color: #888;
  }

  @media ${({ theme }) => theme.device.mobile} {
    font-size: 16px;
    padding: 14px 16px 14px 44px;
  }
`;

const MainSearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 18px;
  transform: translateY(-50%);
  pointer-events: none;

  svg {
    font-size: 18px;
    color: #aaa;
  }
`;

const ReleaseNoteContainer = styled.div`
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 640px;
  margin-top: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

  @media ${({ theme }) => theme.device.mobile} {
    padding: 16px;
  }
`;

const NoteItem = styled.div`
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  background-color: #3a3a3a;
  color: #ddd;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #444;
  }
  &:last-child {
    margin-bottom: 0; // ✅ 마지막 요소는 간격 제거
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background-color: #2a2a2a;
  padding: 24px 32px;
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  color: #ddd;
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  @media ${({ theme }) => theme.device.mobile} {
    padding: 16px 20px;
  }
`;

const ModalTitle = styled.h1`
  font-size: 20px;
  margin-bottom: 8px;
`;

const ModalDate = styled.div`
  font-size: 13px;
  color: #888;
`;

const ModalContent = styled.div`
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-line;
`;

const ScrollableBox = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #222;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #666;
    border-radius: 4px;
    border: 2px solid #222;
  }

  scrollbar-width: thin;
  scrollbar-color: #666 #222;
`;

function Main() {
  const { search, setSearch, handleSearch } = useLayoutContext();
  const [selectedNote, setSelectedNote] = useState<ReleaseNote | null>(null);

  return (
    <MainImage>
      <Helmet>
        <title>로스트아크 계산기 - ArkLator</title>
        <meta name="description" content="로스트아크 계산기" />
      </Helmet>
      <MainSearchContainer>
        <MainSearchWrapper>
          <MainSearchInput
            type="text"
            placeholder="캐릭터명을 입력하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <MainSearchIcon>
            <FaSearch />
          </MainSearchIcon>
        </MainSearchWrapper>

        <ReleaseNoteContainer>
          {releaseNotes.map((note) => (
            <NoteItem key={note.id} onClick={() => setSelectedNote(note)}>
              <strong>{note.title}</strong> - {note.summary}
            </NoteItem>
          ))}
        </ReleaseNoteContainer>
      </MainSearchContainer>

      {selectedNote && (
        <ModalOverlay onClick={() => setSelectedNote(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{selectedNote.title}</ModalTitle>
            <ModalDate>{selectedNote.date}</ModalDate>
            <ScrollableBox>
              <ModalContent>{selectedNote.details}</ModalContent>
            </ScrollableBox>
          </ModalBox>
        </ModalOverlay>
      )}
    </MainImage>
  );
}

export default Main;
