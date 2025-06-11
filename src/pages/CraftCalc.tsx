import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { CraftRecipes, CraftRecipe } from "../utils/CraftRecipes";

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

const CraftCalc = () => {
  const [prices, setPrices] = useState<MaterialPrice[]>([]);
  const [craftResult, setCraftResult] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [craftResults, setCraftResults] = useState<Record<string, any>>({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const handleToggle = async (recipe: CraftRecipe) => {
    const id = recipe.id;
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);

    if (craftResults[id]) return;

    setLoadingIds((prev) => new Set(prev).add(id));

    try {
      const res = await axios.post("/api/craft-calc", {
        materials: recipe.materials,
        fee: recipe.fee,
        outputCount: recipe.outputCount,
      });

      console.log("전송할 recipe:", {
        materials: recipe.materials,
        fee: recipe.fee,
        outputCount: recipe.outputCount,
      });

      setCraftResults((prev) => ({ ...prev, [id]: res.data }));
    } catch (err) {
      console.error("계산 실패:", err);
    } finally {
      setLoadingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  };

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
      {CraftRecipes.map((recipe) => {
        const isExpanded = expandedId === recipe.id;
        const result = craftResults[recipe.id];

        return (
          <CraftRow
            key={recipe.id}
            expanded={isExpanded}
            onClick={() => handleToggle(recipe)}
          >
            <CraftHeader>{recipe.name}</CraftHeader>

            {isExpanded && (
              <CraftDetails onClick={(e) => e.stopPropagation()}>
                {loadingIds.has(recipe.id) ? (
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
                          <th style={headerStyle}>개당가격</th>
                          <th style={headerStyle}>총합</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result?.materials?.map((m: any, i: number) => (
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
                              />
                            </td>
                            <td style={cellCenter}>
                              {m.unitPrice.toLocaleString()} G
                            </td>
                            <td style={cellCenter}>
                              {m.total.toLocaleString()} G
                            </td>
                          </tr>
                        ))}
                        {/* ✅ 수수료 요약 행 추가 */}
                        <tr>
                          {/* 아이콘 + 텍스트 */}
                          <td
                            style={{
                              ...cellStyle,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontWeight: "bold",
                              color: "#ffcc00",
                            }}
                          >
                            <img
                              src="/img/gold.png"
                              alt="gold"
                              style={{ width: "24px", height: "24px" }}
                            />
                            제작 수수료
                          </td>

                          {/* 수량, 시세, 개당가격 자리 맞춤용 빈 칸 */}
                          <td style={cellCenter}></td>
                          <td style={cellCenter}></td>
                          <td style={cellCenter}></td>

                          {/* 수수료 금액 */}
                          <td
                            style={{
                              ...cellCenter,
                              fontWeight: "bold",
                              color: "#ffcc00",
                            }}
                          >
                            {recipe.fee.toLocaleString()} G
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={5} style={{ padding: 0 }}>
                            <div
                              style={{
                                borderTop: "2px solid #888",
                                marginTop: "12px",
                                marginBottom: "8px",
                              }}
                            />
                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "16px",
                                color: "#fff",
                                marginBottom: "8px",
                              }}
                            >
                              총 제작 비용 -{" "}
                              {result?.totalCost?.toLocaleString() ?? "-"} G
                            </div>
                          </td>
                        </tr>
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
                        개당 제작 단가:{" "}
                        {result?.unitCost?.toLocaleString() ?? "-"} G
                      </div>
                      <div>
                        거래소 시세:{" "}
                        {result?.marketPrice?.toLocaleString() ?? "-"} G
                      </div>
                      <div>
                        순이익:{" "}
                        <span
                          style={{
                            color:
                              result?.profitPerUnit != null &&
                              result.profitPerUnit >= 0
                                ? "lightgreen"
                                : "tomato",
                          }}
                        >
                          {result?.profitPerUnit != null
                            ? `${result.profitPerUnit.toLocaleString()} G`
                            : "-"}
                        </span>
                      </div>
                      <div>
                        ROI:{" "}
                        <span
                          style={{
                            color:
                              result?.roi != null && result.roi >= 0
                                ? "lightgreen"
                                : "tomato",
                            fontWeight: "bold",
                          }}
                        >
                          {result?.roi != null ? `${result.roi}%` : "-"}
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
};

export default CraftCalc;
