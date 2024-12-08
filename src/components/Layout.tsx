import React, { useState, createContext, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Header = styled.header`
  background-color: #2d2d2d;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 50px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column; /* 작은 화면에서 레이아웃 변경 */
    gap: 10px;
  }
`;

const HeaderCenter = styled.div`
  display: flex;
  justify-content: center;
  flex: 1; /* 가운데 정렬 */
  position: relative;
`;

const Nav = styled.nav`
  display: flex;
  gap: 40px;
`;

const NavLink = styled(Link)<{ isActive: boolean }>`
  color: ${(props) => (props.isActive ? "white" : "rgba(255, 255, 255, 0.5)")};
  text-decoration: none;
  font-size: 16px;
  font-weight: 700;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const SearchInput = styled.input`
  width: 600px; /* 너비 지정 */
  padding: 0.5rem 2.5rem 0.5rem 0.75rem; /* 아이콘 공간을 위해 오른쪽 패딩 조정 */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-image: url(${process.env
    .PUBLIC_URL}/img/search.png); /* 아이콘 경로 설정 */
  background-repeat: no-repeat;
  background-size: 20px; /* 아이콘 크기 */
  background-position: right 10px center; /* 아이콘 위치 조정 */

  @media (max-width: 768px) {
    width: 200px; /* 작은 화면에서는 너비를 줄임 */
  }
`;

const Footer = styled.footer`
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
          <HeaderCenter>
            <SearchInput
              type="text"
              placeholder="닉네임 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyPress}
            />
          </HeaderCenter>
          <Nav>
            <NavLink to="/" isActive={location.pathname === "/"}>
              주간 레이드 계산기
            </NavLink>
            <NavLink
              to="/accessory-simulator"
              isActive={location.pathname === "/accessory-simulator"}
            >
              장신구 연마 시뮬
            </NavLink>
            <NavLink
              to="/more-tools"
              isActive={location.pathname === "/more-tools"}
            >
              더보기 계산기
            </NavLink>
          </Nav>
        </Header>

        {loading && <p>검색 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <main style={{ flex: 1 }}>{children}</main>

        <Footer>
          <p>© 2024 ArkLator. 모든 권리 보유.</p>
          <p>문의: jsj487@naver.com</p>
        </Footer>
      </div>
    </LayoutContext.Provider>
  );
};

export default Layout;
