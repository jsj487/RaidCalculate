import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
        <Routes>
          {/* MainPage 경로 */}
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
