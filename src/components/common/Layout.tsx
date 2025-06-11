import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import "@fontsource/acme";
import SearchBar from "./SearchBar";
import { useLayoutContext } from "./LayoutProvider";

const Header = styled.header`
  background-color: #2d2d2d;
  color: white;
  padding: 16px 24px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const StyledSearchWrapper = styled.div`
  margin-left: 24px;
  width: 200px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    margin-top: 10px;
  }
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
  gap: 10px;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: white;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${(props) => (props.$isActive ? "#444" : "transparent")};
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #555;
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
        <HeaderContent>
          <LogoLink to="/">ArkLator</LogoLink>

          <Nav>
            <NavLink
              to="/GoldCalc"
              $isActive={location.pathname === "/GoldCalc"}
            >
              주간 레이드 계산기
            </NavLink>
            <NavLink
              to="/JewelFriend"
              $isActive={location.pathname === "/JewelFriend"}
            >
              보석 깐부 찾기
            </NavLink>
            <NavLink
              to="/CraftCalc"
              $isActive={location.pathname === "/CraftCalc"}
            >
              제작 계산기(제작중)
            </NavLink>
            <NavLink to="/Package" $isActive={location.pathname === "/Package"}>
              패키지 계산기
            </NavLink>
            <NavLink to="/Auction" $isActive={location.pathname === "/Auction"}>
              경매 계산기
            </NavLink>
            <NavLink
              to="/Bracelet"
              $isActive={location.pathname === "/Bracelet"}
            >
              팔찌 시뮬레이터
            </NavLink>
          </Nav>

          {location.pathname !== "/" && ( // "/" 경로에서는 Header를 숨김
            <StyledSearchWrapper>
              <SearchBar
                ismainpage={false} // 메인 페이지 아님
                search={search}
                setSearch={setSearch}
                handleSearch={handleSearch}
              />
            </StyledSearchWrapper>
          )}
        </HeaderContent>
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
