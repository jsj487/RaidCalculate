import React from "react";
import styled from "styled-components";
import SearchBar from "../components/SearchBar";
import { useLayoutContext } from "../components/LayoutProvider";
import { Helmet } from "react-helmet";
import "@fontsource/acme";

const MainImage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 위쪽 정렬 */
  align-items: center;
  height: 100vh; /* 화면 전체 높이 */
  background-image: url(${process.env
    .PUBLIC_URL}/img/Main_Background.jpg); /* 배경 이미지 경로 */
  background-size: cover; /* 화면에 꽉 차게 */
  background-position: center; /* 중앙 정렬 */
  background-repeat: no-repeat; /* 반복하지 않음 */
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 위쪽 정렬 */
  align-items: center;
  margin-top: 20vh;
`;

const Title = styled.p`
  font-family: "acme";
  font-size: 80px;
  color: white;
  text-align: center;
`;

function Main() {
  const { search, setSearch, handleSearch } = useLayoutContext();

  return (
    <MainImage>
      <Helmet>
        <title>로스트아크 계산기 - ArkLator</title>
        <meta name="description" content="로스트아크 계산기" />
      </Helmet>
      <MainContainer>
        <Title>ArkLator</Title>
        <SearchBar
          ismainpage={true} // 메인 페이지
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />{" "}
      </MainContainer>
    </MainImage>
  );
}

export default Main;
