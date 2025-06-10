import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const CraftContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 40px auto;
  padding: 16px;
`;

const headerStyle = {
  textAlign: "center" as const,
  borderBottom: "1px solid #444",
  padding: "10px",
  fontSize: "14px",
  color: "#ccc",
  backgroundColor: "#1f1f1f",
};

const cellStyle = {
  padding: "10px",
  borderBottom: "1px solid #333",
  textAlign: "left" as const,
  fontSize: "13px",
  color: "#ddd",
};

const cellCenter = {
  ...cellStyle,
  textAlign: "center" as const,
};

const CraftRow = styled.div<{ expanded: boolean }>`
  background-color: #2a2a2a;
  margin-bottom: 12px;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);

  &:hover {
    background-color: #3a3a3a;
  }

  ${(props) =>
    props.expanded &&
    `
    border: 2px solid #3a72e8;
  `}
`;

const CraftHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

const CraftDetails = styled.div`
  margin-top: 16px;
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
  color: #ddd;
`;

interface MaterialPrice {
  name: string;
  currentMinPrice: number | null;
  recentPrice: number | null;
  ydayAvgPrice?: number | null;
  error?: boolean;
  message?: string;
}

const craftTypes = ["식물채집", "고고학", "낚시", "수렵", "벌목", "채광"];

const CraftCalc = () => {
  const lifeTypes = ["식물채집", "고고학", "벌목", "채광", "낚시", "수렵"];

  const [feeReduction, setFeeReduction] = useState<number>(0); // 0 ~ 1
  const [laborReduction, setLaborReduction] = useState<number>(0); // 0 ~ 1
  const [selectedType, setSelectedType] = useState<string>("식물채집");
  const [craftResult, setCraftResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prices, setPrices] = useState<MaterialPrice[]>([]);

  const [craftResults, setCraftResults] = useState<Record<string, any>>({});
  const [loadingTypes, setLoadingTypes] = useState<Set<string>>(new Set());
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const handleToggle = async (type: string) => {
    if (expandedType === type) {
      setExpandedType(null);
      return;
    }

    setExpandedType(type);

    if (craftResults[type]) return;

    setLoadingTypes((prev) => new Set(prev).add(type));

    try {
      const res = await axios.get("/api/craft-calc", {
        params: { type },
      });
      setCraftResults((prev) => ({ ...prev, [type]: res.data }));
    } catch (err) {
      console.error(`Error fetching result for ${type}:`, err);
    } finally {
      setLoadingTypes((prev) => {
        const updated = new Set(prev);
        updated.delete(type);
        return updated;
      });
    }
  };

  const selectedItem = {
    name: "아비도스 융화 재료",
    categoryCode: 50010,
  };

  const fetchCraftCalcResult = async (type: string) => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/craft-calc", {
        params: {
          type,
          feeReduction,
          laborReduction,
        },
      });
      setCraftResult(res.data);
    } catch (err) {
      console.error("제작 계산 API 호출 실패:", err);
      setCraftResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCraftCalcResult(selectedType);
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/craft-prices");
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error("가격 정보를 불러오지 못했습니다.", err);
      }
    };
    fetchPrices();
  }, []);

  return (
    <CraftContainer>
      {craftTypes.map((type) => {
        const isExpanded = expandedType === type;

        return (
          <CraftRow
            key={type}
            expanded={isExpanded}
            onClick={() => handleToggle(type)}
          >
            <CraftHeader>아비도스 융화 재료 ({type})</CraftHeader>

            {isExpanded && (
              <CraftDetails onClick={(e) => e.stopPropagation()}>
                {loadingTypes.has(type) ? (
                  <div>불러오는 중...</div>
                ) : (
                  <>
                    <table
                      style={{
                        width: "100%",
                        marginTop: "8px",
                        borderCollapse: "collapse",
                        backgroundColor: "#222",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={headerStyle}>재료명</th>
                          <th style={headerStyle}>수량</th>
                          <th style={headerStyle}>시세</th>
                          <th style={headerStyle}>단가</th>
                          <th style={headerStyle}>총합</th>
                        </tr>
                      </thead>
                      <tbody>
                        {craftResults[type]?.materials?.map(
                          (m: any, i: number) => (
                            <tr key={i}>
                              <td
                                style={{
                                  ...cellStyle,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <img
                                  src={m.icon}
                                  alt={m.name}
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "4px",
                                  }}
                                />
                                {m.name}
                              </td>
                              <td style={cellCenter}>{Math.round(m.amount)}</td>
                              <td style={cellCenter}>
                                <input
                                  type="number"
                                  defaultValue={m.currentMinPrice}
                                  step="0.01"
                                  style={{
                                    width: "70px",
                                    padding: "4px 6px",
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #444",
                                    color: "#ddd",
                                    borderRadius: "4px",
                                    textAlign: "right",
                                  }}
                                  onChange={(e) => {
                                    // 선택적으로 상태에 반영하거나 console.log
                                    console.log(
                                      `${m.name} 입력 시세:`,
                                      e.target.value
                                    );
                                  }}
                                />
                              </td>
                              <td style={cellCenter}>
                                {m.unitPrice.toLocaleString()} G
                              </td>
                              <td style={cellCenter}>
                                {m.total.toLocaleString()} G
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>

                    <div
                      style={{
                        marginTop: "20px",
                        color: "#ddd",
                        lineHeight: 1.6,
                        fontSize: "15px",
                      }}
                    >
                      <div>
                        총 제작 비용:{" "}
                        {craftResults[type].totalCost.toLocaleString()} G
                      </div>
                      <div>
                        개당 제작 단가:{" "}
                        {craftResults[type].unitCost.toLocaleString()} G
                      </div>
                      <div>
                        거래소 시세:{" "}
                        {craftResults[type].marketPrice.toLocaleString()} G
                      </div>
                      <div>
                        순이익:{" "}
                        <span
                          style={{
                            color:
                              craftResults[type].profitPerUnit >= 0
                                ? "lightgreen"
                                : "tomato",
                          }}
                        >
                          {craftResults[type].profitPerUnit.toLocaleString()} G
                        </span>
                      </div>
                      <div>
                        ROI:{" "}
                        <span
                          style={{
                            color:
                              craftResults[type].roi >= 0
                                ? "lightgreen"
                                : "tomato",
                            fontWeight: "bold",
                          }}
                        >
                          {craftResults[type].roi}%
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CraftDetails>
            )}
          </CraftRow>
        );
      })}
    </CraftContainer>
  );

  // return (
  //   <div style={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
  //     <h2 style={{ color: "#fff", marginBottom: "12px", fontSize: "24px" }}>
  //       📦 아비도스 융화 재료 제작 계산기
  //     </h2>

  //     <div
  //       style={{
  //         display: "grid",
  //         gridTemplateColumns: "1fr 1fr",
  //         gap: "16px",
  //         marginTop: "20px",
  //       }}
  //     >
  //       {lifeTypes.map((type) => (
  //         <div
  //           key={type}
  //           onClick={() => {
  //             setSelectedType(type);
  //             fetchCraftCalcResult(type);
  //           }}
  //           style={{
  //             padding: "20px",
  //             borderRadius: "10px",
  //             backgroundColor: "#2e2e2e",
  //             cursor: "pointer",
  //             border:
  //               selectedType === type ? "2px solid #3a72e8" : "2px solid #444",
  //             transition: "border 0.3s",
  //           }}
  //         >
  //           <div
  //             style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}
  //           >
  //             아비도스 융화 재료 ({type})
  //           </div>
  //           <div style={{ color: "#aaa", fontSize: "14px", marginTop: "8px" }}>
  //             필요한 재료와 수익 계산 보기
  //           </div>
  //         </div>
  //       ))}
  //     </div>

  //     {isLoading && (
  //       <div style={{ marginTop: "30px", color: "#ccc" }}>불러오는 중...</div>
  //     )}

  //     {craftResult && !isLoading && (
  //       <div style={{ marginTop: "40px" }}>
  //         <h3 style={{ color: "#fff", marginBottom: "12px" }}>
  //           📊 제작 결과 – {selectedType}
  //         </h3>

  //         <table
  //           style={{
  //             width: "100%",
  //             borderCollapse: "collapse",
  //             backgroundColor: "#2a2a2a",
  //             color: "white",
  //           }}
  //         >
  //           <thead>
  //             <tr>
  //               <th style={headerStyle}>재료명</th>
  //               <th style={headerStyle}>수량</th>
  //               <th style={headerStyle}>단가</th>
  //               <th style={headerStyle}>총합</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {craftResult.materials?.map((m: any, i: number) => (
  //               <tr key={i}>
  //                 <td
  //                   style={{
  //                     ...cellStyle,
  //                     display: "flex",
  //                     alignItems: "center",
  //                     gap: "8px",
  //                   }}
  //                 >
  //                   <img
  //                     src={m.icon || "/img/default.png"}
  //                     alt={m.name}
  //                     style={{
  //                       width: "24px",
  //                       height: "24px",
  //                       borderRadius: "4px",
  //                     }}
  //                   />
  //                   {m.name}
  //                 </td>
  //                 <td style={cellRight}>{m.amount.toFixed(2)}</td>
  //                 <td style={cellRight}>{m.unitPrice.toLocaleString()} G</td>
  //                 <td style={cellRight}>{m.total.toLocaleString()} G</td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>

  //         {/* 하단 요약 정보 */}
  //         <div
  //           style={{
  //             marginTop: "24px",
  //             backgroundColor: "#1e1e1e",
  //             padding: "20px",
  //             borderRadius: "12px",
  //             color: "#fff",
  //             lineHeight: "1.6",
  //           }}
  //         >
  //           <div>
  //             💰 <strong>총 제작 비용:</strong>{" "}
  //             {craftResult.totalCost.toLocaleString()} G
  //           </div>
  //           <div>
  //             🧪 <strong>개당 제작 단가:</strong>{" "}
  //             {craftResult.unitCost.toLocaleString()} G
  //           </div>
  //           <div>
  //             📈 <strong>거래소 시세:</strong>{" "}
  //             {craftResult.marketPrice.toLocaleString()} G{" "}
  //             <span
  //               style={{
  //                 color:
  //                   craftResult.marketPrice > craftResult.unitCost
  //                     ? "lightgreen"
  //                     : "salmon",
  //               }}
  //             >
  //               {craftResult.marketPrice > craftResult.unitCost
  //                 ? "▲ 이득"
  //                 : "▼ 손해"}
  //             </span>
  //           </div>
  //           <div>
  //             📊 <strong>단위당 이익:</strong>{" "}
  //             <span
  //               style={{
  //                 color: craftResult.profitPerUnit >= 0 ? "skyblue" : "tomato",
  //               }}
  //             >
  //               {craftResult.profitPerUnit.toLocaleString()} G
  //             </span>
  //           </div>
  //           <div>
  //             📐 <strong>ROI:</strong>{" "}
  //             <span
  //               style={{
  //                 color: craftResult.roi >= 0 ? "lightgreen" : "tomato",
  //                 fontWeight: "bold",
  //               }}
  //             >
  //               {craftResult.roi}%
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default CraftCalc;
