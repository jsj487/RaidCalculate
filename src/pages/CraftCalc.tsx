import axios from "axios";
import React, { useEffect, useState } from "react";

const headerStyle = {
  textAlign: "center" as const,
  borderBottom: "1px solid #444",
  padding: "10px",
};

const cellStyle = {
  padding: "10px",
  borderBottom: "1px solid #333",
  textAlign: "left" as const,
};

const cellRight = {
  ...cellStyle,
  textAlign: "right" as const,
};

interface MaterialPrice {
  name: string;
  currentMinPrice: number | null;
  recentPrice: number | null;
  ydayAvgPrice?: number | null;
  error?: boolean;
  message?: string;
}

const CraftCalc = () => {
  const lifeTypes = ["식물채집", "고고학", "벌목", "채광", "낚시", "수렵"];

  const [feeReduction, setFeeReduction] = useState<number>(0); // 0 ~ 1
  const [laborReduction, setLaborReduction] = useState<number>(0); // 0 ~ 1
  const [selectedType, setSelectedType] = useState<string>("식물채집");
  const [craftResult, setCraftResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prices, setPrices] = useState<MaterialPrice[]>([]);
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
    <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        {lifeTypes.map((type) => (
          <button
            key={type}
            onClick={() => {
              setSelectedType(type);
              fetchCraftCalcResult(type);
            }}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              backgroundColor: selectedType === type ? "#3a72e8" : "#444",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {craftResult && (
        <div style={{ marginTop: "40px" }}>
          <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
            <label style={{ color: "#ccc" }}>
              제작 수수료 감소율 (%)
              <input
                type="number"
                min={0}
                max={100}
                value={feeReduction * 100}
                onChange={(e) => setFeeReduction(Number(e.target.value) / 100)}
                style={{
                  marginLeft: "6px",
                  padding: "6px",
                  width: "60px",
                  borderRadius: "6px",
                }}
              />
            </label>

            <label style={{ color: "#ccc" }}>
              활동력 소비 감소율 (%)
              <input
                type="number"
                min={0}
                max={100}
                value={laborReduction * 100}
                onChange={(e) =>
                  setLaborReduction(Number(e.target.value) / 100)
                }
                style={{
                  marginLeft: "6px",
                  padding: "6px",
                  width: "60px",
                  borderRadius: "6px",
                }}
              />
            </label>

            <button
              onClick={() => fetchCraftCalcResult(selectedType)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                backgroundColor: "#3a72e8",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                height: "40px",
                marginTop: "22px",
              }}
            >
              계산
            </button>
          </div>

          <h2 style={{ fontSize: "20px", margin: "20px 0", color: "#fff" }}>
            제작 아이템:{" "}
            <span style={{ color: "#ffcc00" }}>{selectedItem.name}</span>
          </h2>

          <h4>아비도스 융화 재료 시세</h4>
          <ul>
            <li>최저가: {craftResult.marketPrice.toLocaleString()} G</li>
            <li>최근 거래가: {craftResult.recentPrice.toLocaleString()} G</li>
            <li>전일 평균가: {craftResult.ydayAvgPrice.toLocaleString()} G</li>
          </ul>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#2a2a2a",
              color: "white",
            }}
          >
            <thead>
              <tr>
                <th style={headerStyle}>재료명</th>
                <th style={headerStyle}>수량</th>
                <th style={headerStyle}>단가</th>
                <th style={headerStyle}>총합</th>
              </tr>
            </thead>
            <tbody>
              {craftResult.materials?.map((m: any, i: number) => (
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
                      src={m.icon || "/img/default.png"}
                      alt={m.name}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "4px",
                      }}
                    />
                    {m.name}
                  </td>
                  <td style={cellRight}>{m.amount}</td>
                  <td style={cellRight}>{m.unitPrice.toLocaleString()} G</td>
                  <td style={cellRight}>{m.total.toLocaleString()} G</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 결과 요약 */}
          <div
            style={{
              marginTop: "24px",
              backgroundColor: "#1e1e1e",
              padding: "20px",
              borderRadius: "12px",
              color: "#fff",
              lineHeight: "1.6",
            }}
          >
            <div>
              💰 <strong>총 제작 비용:</strong>{" "}
              {craftResult.totalCost.toLocaleString()} G
            </div>

            <div>
              🧪 <strong>개당 제작 단가:</strong>{" "}
              {craftResult.unitCost.toLocaleString()} G
            </div>

            <div>
              📈 <strong>거래소 시세:</strong>{" "}
              {craftResult.marketPrice.toLocaleString()} G{" "}
              <span
                style={{
                  color:
                    craftResult.marketPrice > craftResult.unitCost
                      ? "lightgreen"
                      : "salmon",
                }}
              >
                {craftResult.marketPrice > craftResult.unitCost
                  ? "▲ 이득"
                  : "▼ 손해"}
              </span>
            </div>

            <div>
              📊 <strong>단위당 이익:</strong>{" "}
              <span
                style={{
                  color: craftResult.profitPerUnit >= 0 ? "skyblue" : "tomato",
                }}
              >
                {craftResult.profitPerUnit.toLocaleString()} G
              </span>
            </div>

            <div>
              📐 <strong>ROI:</strong>{" "}
              <span
                style={{
                  color: craftResult.roi >= 0 ? "lightgreen" : "tomato",
                  fontWeight: "bold",
                }}
              >
                {craftResult.roi}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CraftCalc;
