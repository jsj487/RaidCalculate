import React, { useEffect, useState } from "react";

type MaterialPrice = {
  name: string;
  currentMinPrice: number | null;
  recentPrice: number | null;
  error?: boolean;
};

const CraftCalc = () => {
  const [prices, setPrices] = useState<MaterialPrice[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      const res = await fetch("/api/craft-prices");
      const data = await res.json();
      setPrices(data);
    };
    fetchPrices();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>영지 제작 재료 시세</h2>
      <table>
        <thead>
          <tr>
            <th>재료명</th>
            <th>현재 최저가</th>
            <th>최근 거래가</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.currentMinPrice ?? "N/A"}</td>
              <td>{item.recentPrice ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CraftCalc;
