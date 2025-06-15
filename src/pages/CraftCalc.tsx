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

  // 2. 제작 수량 및 비용 계산
  const totalProduced = outputCount * recipe.outputCount;
  const materialCost = updatedMaterials.reduce((sum, m) => sum + m.total, 0);
  const totalCost = (materialCost + recipe.fee) * outputCount;
  const unitCost = totalCost / totalProduced;

  // 3. 판매 수익 계산
  const expectedRevenue = marketPrice * totalProduced;

  // ✅ 원가 이익률용 수수료 계산 (전체에 대한 5%)
  const totalFee_forCostROI = Math.ceil(expectedRevenue * 0.05);
  const netRevenue_forCostROI = expectedRevenue - totalFee_forCostROI;

  // ✅ 활동력 이익률용 수수료 계산 (단위별 수수료 누적)
  const feePerUnit = Math.ceil(marketPrice * 0.05);
  const totalFee_forLaborROI = feePerUnit * totalProduced;
  const netRevenue_forLaborROI = expectedRevenue - totalFee_forLaborROI;

  // 4. 최종 수익
  const totalSaleProfit = netRevenue_forCostROI - totalCost;
  const totalUseProfit = expectedRevenue - totalCost;
  const profitPerUnit = totalProduced > 0 ? totalSaleProfit / totalProduced : 0;

  // 5. ROI 계산
  const costROI =
    unitCost > 0 ? Math.round((profitPerUnit / unitCost) * 1000) / 10 : 0;

  const totalLabor = recipe.laborCost * outputCount;
  const laborROI_percent =
    totalLabor > 0
      ? Math.round(((netRevenue_forLaborROI - totalCost) / totalLabor) * 1000) /
        10
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
    totalLabor,
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

  useEffect(() => {
    const initial: Record<string, string> = {};
    CraftRecipes.forEach((r) => {
      initial[r.name] = "1"; // 1회 제작을 기본값으로
    });
    setOutputCounts(initial);
  }, []);

  const handleToggle = async (recipe: CraftRecipe) => {
    const id = recipe.id;

    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);

    // 이미 결과가 있으면 재요청 생략
    if (craftResults[id]) return;

    setLoadingIds((prev) => new Set(prev).add(id));

    try {
      // API 요청: 재료의 시세 정보를 받아옴
      const res = await axios.post("/api/craft-calc", {
        materials: recipe.materials,
        fee: recipe.fee,
        outputCount: recipe.outputCount,
      });

      const marketPrice = res.data.marketPrice ?? 0;

      // 시세 정보 포함한 재료 목록 구성
      const refreshedMaterials = recipe.materials.map((m) => {
        const serverMaterial = res.data.materials?.find(
          (sm: any) => sm.name === m.name
        );
        const currentMinPrice = serverMaterial?.currentMinPrice ?? 0;
        return {
          ...m,
          currentMinPrice,
        };
      });

      const calc = calculateCraftResult({
        recipe,
        materials: res.data.materials, // 이게 가공되지 않은 원본일 가능성 있음
        priceOverrides: {},
        outputCount: 1,
        marketPrice: res.data.marketPrice ?? 0,
      });

      setCraftResults((prev) => ({
        ...prev,
        [id]: {
          ...calc, // 여기서 updatedMaterials 포함됨
          materials: calc.updatedMaterials, // 꼭 명시!
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

        if (isExpanded && result && result.totalSaleProfit == null) {
          const parsed = Math.max(1, Number(outputCounts[recipe.id] ?? "1"));
          const refreshedMaterials = result.materials.map(
            (m: { name: string | number; currentMinPrice: any }) => ({
              ...m,
              currentMinPrice: priceOverrides[m.name] ?? m.currentMinPrice,
            })
          );

          const calc = calculateCraftResult({
            recipe,
            materials: refreshedMaterials,
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
        }

        return (
          <CraftRow
            key={recipe.id}
            expanded={isExpanded}
            onClick={() => handleToggle(recipe)}
          >
            <CraftHeader>{`${recipe.name} x${recipe.outputCount}`}</CraftHeader>

            {isExpanded && (
              <CraftDetails onClick={(e) => e.stopPropagation()}>
                {loadingIds.has(recipe.id) ? (
                  <div>불러오는 중...</div>
                ) : (
                  <>
                    <div
                      style={{
                        marginBottom: "10px",
                        color: "#ccc",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >
                      제작단위
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
                          if (isNaN(parsed) || parsed < 1) return;

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
                      = {recipe.name}{" "}
                      {(Number(outputCounts[recipe.id]) || 1) *
                        recipe.outputCount}
                      개
                    </div>
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
                                        ...calc,
                                      },
                                    }));

                                    return updated;
                                  });
                                }}
                              />
                            </td>
                            <td style={cellCenter}>
                              {m.unitPrice != null
                                ? m.unitPrice.toLocaleString()
                                : "-"}{" "}
                              G
                            </td>
                            <td style={cellCenter}>
                              {m.total != null ? m.total.toLocaleString() : "-"}{" "}
                              G
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
