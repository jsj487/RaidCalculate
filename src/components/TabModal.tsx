import React, { useState } from "react";
import styled from "styled-components";
import { useLayoutContext } from "../components/LayoutProvider";
import SearchBar from "./SearchBar";
import axios from "axios";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const ModalHeader = styled.h2`
  margin-top: 0;
  color: #333;
`;

const ModalBody = styled.div`
  margin-top: 20px;
`;

const LoadingMessage = styled.div`
  margin-top: 10px;
  color: #007bff;
  font-weight: bold;
`;

type TabModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSearchComplete: (tabId: number, data: any, search: string) => void;
  tabId: number;
};

const TabModal: React.FC<TabModalProps> = ({
  isOpen,
  onClose,
  onSearchComplete,
  tabId,
}) => {
  const { setCharacters, setServers, setSelectedServer } = useLayoutContext();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearchAndClose = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/characters/siblings", {
        params: { name: search },
      });

      const data = response.data;

      // 검색 완료 시 상위 컴포넌트에 검색 결과 전달
      onSearchComplete(tabId, data, search);
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalHeader>새 계정 검색</ModalHeader>
        <ModalBody>
          <SearchBar
            ismainpage={true}
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearchAndClose}
          />
          {loading && <LoadingMessage>검색 중입니다...</LoadingMessage>}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TabModal;
