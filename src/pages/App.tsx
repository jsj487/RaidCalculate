import { useState } from "react";
import { GoldCalcProvider } from "../components/goldcalcpage/GoldCalcContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "../components/common/Layout";
import { LayoutProvider } from "../components/common/LayoutProvider";

import Main from "./Main";
import GoldCalc from "./GoldCalc";
// import Schedule from "./Schedule";
import Package from "./Package";
import Auction from "./Auction";
import Bracelet from "./Bracelet";
import JewelFriend from "./JewelFriend";
import CraftCalc from "./CraftCalc";

import { ThemeProvider } from "styled-components";
import { theme } from "../styles/theme";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #262626; /* 추천 배경색 */
    font-family: Arial, sans-serif; /* 선택적 */
  }
`;

function App() {
  const basename = process.env.PUBLIC_URL || ""; // 동적으로 basename 설정

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle /> {/* 전역 스타일 추가 */}
      <Router basename={basename}>
        <GoldCalcProvider>
          <LayoutProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/GoldCalc" element={<GoldCalc tabId={0} />} />
                <Route path="/JewelFriend" element={<JewelFriend />} />
                <Route path="/Package" element={<Package />} />
                <Route path="/Auction" element={<Auction />} />
                <Route path="/Bracelet" element={<Bracelet />} />
                <Route path="/CraftCalc" element={<CraftCalc />} />
              </Routes>
            </Layout>
          </LayoutProvider>
        </GoldCalcProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
