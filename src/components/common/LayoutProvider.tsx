import React, { useState, createContext, useContext, useEffect } from "react";
import { useGoldCalcContext } from "../goldcalcpage/GoldCalcContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

// Styled Components for Loading
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

type LayoutContextType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  servers: string[];
  setServers: React.Dispatch<React.SetStateAction<string[]>>; // 추가
  characters: any[];
  selectedServer: string | null;
  setCharacters: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedServer: React.Dispatch<React.SetStateAction<string | null>>;
  handleSearch: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a Layout");
  }
  return context;
};

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  type CharacterType = {
    ServerName: string;
    CharacterName: string;
    CharacterLevel: number;
    ItemAvgLevel: string;
    CharacterImage?: string;
  };
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 가져오기

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://raidcalculate.onrender.com/api"
      : "http://localhost:5000/api";

  // Local State
  const [search, setSearch] = useState(() => {
    return localStorage.getItem("search") || ""; // Local Storage에서 검색 기록 복원
  });
  const [servers, setServers] = useState<string[]>(() => {
    const storedServers = localStorage.getItem("servers");
    return storedServers ? JSON.parse(storedServers) : [];
  });
  const [characters, setCharacters] = useState<any[]>([]);

  const [selectedServer, setSelectedServer] = useState<string | null>(() => {
    return localStorage.getItem("selectedServer");
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleSearchComplete } = useGoldCalcContext();

  // 검색 핸들러
  const handleSearch = async (searchQuery?: string) => {
    const effectiveSearch = searchQuery || search.trim();
    if (!effectiveSearch) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/characters/siblings`, {
        params: { name: effectiveSearch },
      });

      const data = response.data;

      if (!data || data.length === 0) {
        setError("검색 결과가 없습니다. 닉네임을 다시 확인하세요.");
        return;
      }

      // Update GoldCalcContext with search results
      handleSearchComplete(data, effectiveSearch);

      // Navigate to the tab
      navigate(`/GoldCalc`);
    } catch (error) {
      console.error("검색 실패:", error);
      setError("검색 중 오류가 발생했습니다. 다시 시도하세요.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 시 Local Storage 데이터 복구
  useEffect(() => {
    const savedSearch = localStorage.getItem("search");
    const savedServers = localStorage.getItem("servers");
    const savedCharacters = localStorage.getItem("characters");
    const savedSelectedServer = localStorage.getItem("selectedServer");

    if (savedSearch) setSearch(savedSearch);
    if (savedServers) setServers(JSON.parse(savedServers));
    if (savedCharacters) setCharacters(JSON.parse(savedCharacters));
    if (savedSelectedServer) setSelectedServer(savedSelectedServer);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        search,
        setSearch,
        servers,
        setServers, // 추가된 부분
        characters,
        setCharacters,
        selectedServer,
        setSelectedServer,
        handleSearch,
        loading,
        error,
      }}
    >
      {children}
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner src={`${process.env.PUBLIC_URL}/img/loading.gif`} />
        </LoadingOverlay>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </LayoutContext.Provider>
  );
};
