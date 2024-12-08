import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import MainPage from "./MainPage";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #383838; /* 추천 배경색 */
    font-family: Arial, sans-serif; /* 선택적 */
  }
`;

function App() {
  const basename = process.env.PUBLIC_URL || ""; // 동적으로 basename 설정

  return (
    <>
      <GlobalStyle /> {/* 전역 스타일 추가 */}
      <Router basename={basename}>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            {/* 다른 라우트도 여기에 추가 */}
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
