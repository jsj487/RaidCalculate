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

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.img`
  width: 800px;
  height: 800px;
`;

type TabModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSearchComplete: (data: any[], search: string) => void;
};

const TabModal: React.FC<TabModalProps> = ({
  isOpen,
  onClose,
  onSearchComplete,
}) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearchAndClose = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/characters/siblings", {
        params: { name: search },
      });

      const data = response.data;

      if (!data || data.length === 0) {
        alert("검색 결과가 없습니다. 닉네임을 다시 확인하세요.");
        return; // Exit the function without closing the modal or calling onSearchComplete
      }

      onSearchComplete(data, search); // Pass data and search to the handler
      onClose(); // Close the modal
    } catch (error) {
      console.error("Search failed:", error);
      alert("검색 중 오류가 발생했습니다. 다시 시도하세요.");
    } finally {
      setLoading(false); // Stop loading
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
          {loading && (
            <LoadingOverlay>
              <LoadingSpinner
                src={`${process.env.PUBLIC_URL}/img/loading.gif`}
              />
            </LoadingOverlay>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TabModal;
