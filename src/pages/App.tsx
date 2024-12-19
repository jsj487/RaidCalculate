import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "../components/Layout";
import { LayoutProvider } from "../components/LayoutProvider";
import Main from "./Main";
import GoldCalc from "./GoldCalc";
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
  const [tabs, setTabs] = useState([{ id: 1 }]);

  return (
    <>
      <GlobalStyle /> {/* 전역 스타일 추가 */}
      <Router basename={basename}>
        <LayoutProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route
                path="/GoldCalc"
                element={<Navigate to="/GoldCalc/1" replace />}
              />{" "}
              {/* 기본 탭으로 리다이렉트 */}
              {tabs.map((tab) => (
                <Route
                  key={tab.id}
                  path={`/GoldCalc/${tab.id}`}
                  element={<GoldCalc tabId={tab.id} />}
                />
              ))}
            </Routes>
          </Layout>
        </LayoutProvider>
      </Router>
    </>
  );
}

export default App;
