import React, { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Header = styled.header`
  width: 100%;
  background-color: #2d2d2d;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  gap: 15px;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const SearchInput = styled.input`
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Footer = styled.footer`
  width: 100%;
  background-color: #2d2d2d;
  color: white;
  text-align: center;
  padding: 10px 20px;
  margin-top: auto;
  font-size: 14px;
`;

type LayoutContextType = {
  search: string;
  servers: string[];
  characters: any[];
  selectedServer: string | null;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
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

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

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
  const [characters, setCharacters] = useState<any[]>(() => {
    const storedCharacters = localStorage.getItem("characters");
    return storedCharacters ? JSON.parse(storedCharacters) : [];
  });
  const [selectedServer, setSelectedServer] = useState<string | null>(() => {
    return localStorage.getItem("selectedServer");
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 검색 핸들러
  const handleSearch = async () => {
    if (!search.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/characters/siblings`, {
        params: { name: search },
      });

      // 캐릭터 데이터 타입 명시
      type CharacterData = {
        ServerName: string;
        CharacterName: string;
        CharacterClassName: string;
        CharacterLevel: number;
        ItemAvgLevel: string;
        CharacterImage?: string;
      };

      // 서버 목록 추출 및 타입 변환
      const serverList = Array.from(
        new Set(
          (response.data as CharacterData[]).map((char) => char.ServerName)
        )
      );

      setServers(serverList); // 문제 해결: serverList의 타입은 명확히 string[]입니다.
      setCharacters(response.data as CharacterData[]);
      setSelectedServer(null);

      // Local Storage에 저장
      localStorage.setItem("search", search);
      localStorage.setItem("servers", JSON.stringify(serverList));
      localStorage.setItem("characters", JSON.stringify(response.data));

      navigate(`/`); // MainPage로 이동
    } catch {
      setError("캐릭터 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
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
        servers,
        characters,
        selectedServer,
        setSearch,
        setSelectedServer,
        handleSearch,
        loading,
        error,
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header>
          <h1>ArkLator</h1>
          <SearchInput
            type="text"
            placeholder="닉네임 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyPress}
          />
          <Nav>
            <NavLink href="#weekly-raid-calculator">주간 레이드 계산기</NavLink>
            <NavLink href="#accessory-simulator">장신구 연마 시뮬</NavLink>
            <NavLink href="#more-tools">더보기 계산기</NavLink>
          </Nav>
        </Header>
        {loading && <p>검색 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <main style={{ flex: 1 }}>{children}</main>

        <Footer>
          <p>© 2024 ArkLator. 모든 권리 보유.</p>
          <p>문의: support@arklator.com</p>
        </Footer>
      </div>
    </LayoutContext.Provider>
  );
};

export default Layout;
