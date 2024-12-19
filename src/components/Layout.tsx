import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import "@fontsource/acme";
import SearchBar from "../components/SearchBar";
import { useLayoutContext } from "./LayoutProvider";

const Header = styled.header`
  background-color: #2d2d2d;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 50px;
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

const LogoLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 35px;
  font-weight: bold;
  font-family: "acme";

  transition: color 0.2s;
  &:hover {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 40px;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${(props) => (props.$isActive ? "white" : "rgba(255, 255, 255, 0.5)")};
  text-decoration: none;
  font-size: 16px;
  font-weight: 700;
  transition: color 0.2s;

  &:hover {
    color: white;
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

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { search, setSearch, handleSearch } = useLayoutContext();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header>
        <LogoLink to="/">ArkLator</LogoLink>
        <HeaderCenter>
          {location.pathname !== "/" && ( // "/" 경로에서는 Header를 숨김
            <SearchBar
              ismainpage={false} // 메인 페이지 아님
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
            />
          )}
        </HeaderCenter>
        <Nav>
          <NavLink to="/GoldCalc" $isActive={location.pathname === "/GoldCalc"}>
            주간 레이드 계산기
          </NavLink>
          <NavLink
            to="/accessory-simulator"
            $isActive={location.pathname === "/accessory-simulator"}
          >
            장신구 연마 시뮬
          </NavLink>
          <NavLink
            to="/more-tools"
            $isActive={location.pathname === "/more-tools"}
          >
            더보기 계산기
          </NavLink>
        </Nav>
      </Header>

      <main style={{ flex: 1 }}>{children}</main>

      <Footer>
        <p>© 2024 ArkLator. 모든 권리 보유.</p>
        <p>문의: jsj487@naver.com</p>
      </Footer>
    </div>
  );
};

export default Layout;
