import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { TooltipIcon, TooltipText } from "../components/common/Tooltip";
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

function calculateCraftResult({
  recipe,
  materials,
  priceOverrides,
  outputCount,
  marketPrice,
}: {
  recipe: CraftRecipe;
  materials: any[];
  priceOverrides: Record<string, number>;
  outputCount: number;
  marketPrice: number;
}) {
  // 1. 재료 시세 계산
  const updatedMaterials = materials.map((m: any) => {
    const pricePer100 = priceOverrides[m.name] ?? m.currentMinPrice;
    const unitPrice = pricePer100 / 100;
    const total = unitPrice * m.amount;
    return {
      ...m,
      unitPrice,
      total,
      currentMinPrice: pricePer100,
    };
  });

  // 2. 제작 총 수량과 비용 계산
  const totalProduced = outputCount * recipe.outputCount; // 예: 2회 제작 × 10개 = 20개
  const materialCost = updatedMaterials.reduce((sum, m) => sum + m.total, 0);
  const totalCost = (materialCost + recipe.fee) * outputCount;
  const unitCost = totalCost / totalProduced;

  // 3. 시장 시세 기반 판매 수익
  const expectedRevenue = marketPrice * totalProduced;
  const totalFee = Math.ceil(expectedRevenue * 0.05); // 전체 거래 수수료 (올림)
  const totalNetRevenue = expectedRevenue - totalFee;

  // 4. 최종 수익 계산
  const totalSaleProfit = totalNetRevenue - totalCost;
  const totalUseProfit = expectedRevenue - totalCost;

  const profitPerUnit = totalProduced > 0 ? totalSaleProfit / totalProduced : 0;

  // 5. ROI 계산
  const costROI =
    unitCost > 0 ? Math.round((profitPerUnit / unitCost) * 1000) / 10 : 0;

  const laborROI_percent =
    recipe.laborCost > 0
      ? Math.round((profitPerUnit / recipe.laborCost) * 1000) / 10
      : 0;

  return {
    updatedMaterials,
    totalCost: Math.round(totalCost),
    unitCost: Math.round(unitCost),
    profitPerUnit: Math.round(profitPerUnit),
    costROI,
    laborROI_percent,
    totalSaleProfit: Math.round(totalSaleProfit),
    totalUseProfit: Math.round(totalUseProfit),
    totalGold: Math.round(totalCost),
    marketPrice,
  };
}

const CraftCalc = () => {
  const [prices, setPrices] = useState<MaterialPrice[]>([]);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>(
    {}
  );
  const [outputCounts, setOutputCounts] = useState<Record<string, string>>({});
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

      const profitPerUnit = res.data.profitPerUnit;
      const unitCost = res.data.unitCost;
      const costROI =
        unitCost > 0 ? Math.round((profitPerUnit / unitCost) * 1000) / 10 : 0;
      const laborROI_percent =
        recipe.laborCost > 0
          ? Math.round((profitPerUnit / recipe.laborCost) * 1000) / 10
          : 0;

      setCraftResults((prev) => ({
        ...prev,
        [id]: {
          ...res.data,
          costROI,
          laborROI: Math.round((profitPerUnit / recipe.laborCost) * 10) / 10,
          laborROI_percent,
        },
      }));
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
                    <input
                      type="number"
                      value={outputCounts[recipe.id] ?? "1"}
                      onChange={(e) => {
                        const value = e.target.value;
                        setOutputCounts((prev) => ({
                          ...prev,
                          [recipe.id]: value,
                        }));

                        const parsed = Number(value);
                        if (isNaN(parsed) || parsed < 1) return; // 계산 스킵

                        const calc = calculateCraftResult({
                          recipe,
                          materials: result.materials,
                          priceOverrides,
                          outputCount: parsed,
                          marketPrice: result.marketPrice ?? 0,
                        });

                        setCraftResults((prev) => ({
                          ...prev,
                          [recipe.id]: {
                            ...prev[recipe.id],
                            ...calc,
                          },
                        }));
                      }}
                      style={{
                        width: "60px",
                        padding: "4px 6px",
                        border: "1px solid #444",
                        backgroundColor: "#1a1a1a",
                        color: "#ddd",
                        borderRadius: "4px",
                        marginLeft: "10px",
                      }}
                    />
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
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  const newPrice = isNaN(value) ? 0 : value;

                                  setPriceOverrides((prev) => {
                                    const updated = {
                                      ...prev,
                                      [m.name]: newPrice,
                                    };

                                    const parsedOutputCount =
                                      Number(outputCounts[recipe.id]) || 1;

                                    const calc = calculateCraftResult({
                                      recipe,
                                      materials: result.materials,
                                      priceOverrides: updated,
                                      outputCount: parsedOutputCount,
                                      marketPrice: result.marketPrice ?? 0,
                                    });

                                    setCraftResults((prev) => ({
                                      ...prev,
                                      [recipe.id]: {
                                        ...prev[recipe.id],
                                        materials: calc.updatedMaterials,
                                        totalCost: calc.totalCost,
                                        unitCost: calc.unitCost,
                                        profitPerUnit: calc.profitPerUnit,
                                        costROI: calc.costROI,
                                        laborROI_percent: calc.laborROI_percent,
                                        totalSaleProfit: calc.totalSaleProfit,
                                        totalUseProfit: calc.totalUseProfit,
                                        totalGold: calc.totalGold,
                                      },
                                    }));

                                    return updated;
                                  });
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
                              총 제작 비용:{" "}
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
                        판매 시 이익 (5% 수수료 적용):{" "}
                        <span
                          style={{
                            color:
                              result?.totalSaleProfit != null &&
                              result.totalSaleProfit >= 0
                                ? "lightgreen"
                                : "tomato",
                          }}
                        >
                          {result?.totalSaleProfit != null
                            ? `${result.totalSaleProfit.toLocaleString()} G`
                            : "-"}
                        </span>
                      </div>

                      <div>
                        직접 사용 시 기대가치 (평균 시세 기준):{" "}
                        <span
                          style={{
                            color:
                              result?.totalUseProfit != null &&
                              result.totalUseProfit >= 0
                                ? "lightgreen"
                                : "tomato",
                          }}
                        >
                          {result?.totalUseProfit != null
                            ? `${result.totalUseProfit.toLocaleString()} G`
                            : "-"}
                        </span>
                      </div>

                      <div>
                        원가 이익률:{" "}
                        <span
                          style={{
                            color:
                              result?.costROI >= 0 ? "lightgreen" : "tomato",
                          }}
                        >
                          {result?.costROI != null ? `${result.costROI}%` : "-"}
                        </span>
                        <TooltipIcon>
                          ?
                          <TooltipText>
                            내가 소비한 골드 대비 수익률입니다. <br />
                            예: 100골드로 130골드 벌면 30%
                          </TooltipText>
                        </TooltipIcon>
                      </div>

                      <div>
                        활동력 이익률:{" "}
                        <span
                          style={{
                            color:
                              result?.laborROI_percent >= 0
                                ? "lightgreen"
                                : "tomato",
                          }}
                        >
                          {result?.laborROI_percent != null
                            ? `${result.laborROI_percent}%`
                            : "-"}
                        </span>
                        <TooltipIcon>
                          ?
                          <TooltipText>
                            활동력 대비 수익률입니다. <br />
                            예: 300 활동력으로 900G 벌면 200% 수익
                          </TooltipText>
                        </TooltipIcon>
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
