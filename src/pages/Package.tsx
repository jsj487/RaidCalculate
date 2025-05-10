import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";

const Table = styled.table`
  width: 80%;
  color: white;
  border-collapse: collapse;
  border: 1px solid #444;
`;

const Th = styled.th<{ isLast?: boolean }>`
  border-bottom: 1px solid #444;
  border-right: ${(props) => (props.isLast ? "none" : "1px solid #444")};
  padding: 12px;
  text-align: center;
`;

const Td = styled.td<{ center?: boolean; noRight?: boolean }>`
  padding: 8px;
  border-right: ${(props) => (props.noRight ? "none" : "1px solid #444")};
  text-align: ${(props) => (props.center ? "center" : "left")};
  vertical-align: middle;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #444;
`;

const AddButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #444;
  color: white;
  font-size: 24px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const ActionButton = styled.button`
  background-color: #444; // 기존 #3a72e8 → 어두운 회색
  color: white;
  padding: 12px 32px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 10px;
`;

const Modal = styled.div`
  background-color: #222;
  padding: 20px;
  border-radius: 10px;
  color: white;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  width: 200px;
`;

const Result = styled.div`
  margin-top: 30px;
  font-size: 20px;
  font-weight: bold;
  white-space: pre-line;
  color: white;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #1e1e1e;
  min-height: 100vh;
  color: white;
`;

interface MarketItem {
  BundleCount: number;
  Id: number;
  Name: string;
  Icon: string;
  RecentPrice: number;
  CurrentMinPrice: number;
  YDayAvgPrice: number;
}

function Package() {
  const [goldRate, setGoldRate] = useState(0);
  const [packagePrice, setPackagePrice] = useState<number>(0);
  const [priceType, setPriceType] = useState<"cash" | "crystal">("cash");
  const [crystalRate, setCrystalRate] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [materials, setMaterials] = useState<
    {
      name: string;
      quantity: number;
      price: number;
      icon: string;
      recent: number;
      min: number;
      avg: number;
      bundle: number; // <- 추가
    }[]
  >([]);
  const [result, setResult] = useState<{
    text: string;
    diff: number;
    color: string;
  } | null>(null);

  const presetMaterials = [
    { name: "운명의 파괴석", categoryCode: 50000 },
    { name: "운명의 돌파석", categoryCode: 50000 },
    { name: "운명의 수호석", categoryCode: 50000 },
    { name: "아비도스 융화 재료", categoryCode: 50000 },
  ];

  const addMaterialByName = async (name: string, categoryCode: number) => {
    try {
      let match: MarketItem | null = null;

      for (let page = 1; page <= 10; page++) {
        const res = await axios.post("/api/market/items", {
          Sort: "GRADE",
          CategoryCode: categoryCode,
          PageNo: page,
          SortCondition: "ASC",
        });

        const items: MarketItem[] = Array.isArray(res.data.ObjectItems)
          ? res.data.ObjectItems
          : Array.isArray(res.data.Items)
          ? res.data.Items
          : [];

        console.log(
          `Page ${page} 아이템 목록:`,
          items.map((i) => i.Name)
        );

        match = items.find((i) => i.Name.includes(name)) || null;
        if (match) break;

        if (items.length < 10) break;
      }

      if (!match) {
        alert(`"${name}" 시세 정보를 찾을 수 없습니다.`);
        return;
      }

      if (materials.some((m) => m.name === match!.Name)) {
        alert(`"${match!.Name}"은 이미 추가된 재료입니다.`);
        return;
      }

      setMaterials([
        ...materials,
        {
          name: match.Name,
          quantity: 1,
          price: match.RecentPrice,
          icon: match.Icon,
          recent: match.RecentPrice,
          min: match.CurrentMinPrice,
          avg: match.YDayAvgPrice,
          bundle: match.BundleCount ?? 1, // 기본값 1
        },
      ]);
    } catch (err) {
      console.error("재료 시세 요청 실패:", err);
    }
  };

  const calculatePackageGoldValue = () => {
    const goldFromCash = (packagePrice / goldRate) * 100;
    const netGold = goldFromCash * 0.95;

    const totalGold = materials.reduce(
      (sum, m) => sum + m.price * m.quantity,
      0
    );

    let resultText = "";

    //패키지 가격 기준 계산
    if (packagePrice && priceType) {
      if (priceType === "cash") {
        // 현금 기준 → 골드 환산
        const goldFromCash = (packagePrice / goldRate) * 100;
        resultText += `현금 ₩${packagePrice.toLocaleString()} → 약 ${Math.floor(
          goldFromCash
        ).toLocaleString()} 골드 가치\n\n`;
      } else if (priceType === "crystal") {
        // 크리스탈 기준 → 골드 환산 (수수료 반영)
        const goldFromCrystal = (packagePrice * crystalRate) / 95;
        resultText += `크리스탈 ${packagePrice}개 → 약 ${Math.floor(
          goldFromCrystal
        ).toLocaleString()} 골드 가치\n`;
        resultText += `(1크당 ${Math.floor(
          goldFromCrystal / packagePrice
        )} 골드)\n\n`;
      }
    }

    //현재 재료 총합 기준 골드 가치 계산
    if (totalGold > 0 && (priceType === "cash" || priceType === "crystal")) {
      const goldCostInKRW = goldRate ? (totalGold * goldRate) / 100 : 0;
      const crystalAmount = crystalRate ? totalGold / (crystalRate / 95) : 0;

      resultText += `현재 구성된 재료 기준:\n`;
      resultText += `총 ${totalGold.toLocaleString()} 골드\n`;

      if (priceType === "cash") {
        resultText += `→ 골드 기준 현금가: 약 ${Math.floor(
          goldCostInKRW
        ).toLocaleString()}원\n`;
      }

      if (priceType === "crystal") {
        resultText += `→ 크리스탈 기준: 약 ${Math.ceil(
          crystalAmount
        )} 개 (95% 적용)\n`;
      }

      // 기준 골드 가치와 비교하여 효율 계산
      const 기준골드 =
        priceType === "cash"
          ? (packagePrice / goldRate) * 100
          : (packagePrice * crystalRate) / 95;

      const 차이율 = ((totalGold - 기준골드) / 기준골드) * 100;
      const rounded = Math.round(차이율);

      let percentColor = "gray";
      if (rounded > 1) percentColor = "red";
      else if (rounded < -1) percentColor = "skyblue";

      resultText += `→ ${rounded >= 0 ? "이득" : "손해"}: `;

      resultText += `%c${rounded}%`;

      // setResult 는 styled가 안 되니 따로 색상 분기
      setResult({
        text: resultText,
        diff: rounded,
        color: percentColor,
      });
    }
  };

  function handleMaterialChange(
    index: number,
    field: "quantity",
    value: string
  ) {
    const updated = [...materials];
    updated[index] = {
      ...updated[index],
      [field]: Number(value),
    };
    setMaterials(updated);
  }

  return (
    <Container>
      <Row>
        <Input
          type="number"
          placeholder="패키지 가격"
          value={packagePrice || ""}
          onChange={(e) => setPackagePrice(Number(e.target.value))}
        />
        <select
          value={priceType}
          onChange={(e) => setPriceType(e.target.value as "cash" | "crystal")}
          style={{ padding: "10px", fontSize: "16px", borderRadius: "5px" }}
        >
          <option value="cash">현금 (₩)</option>
          <option value="crystal">크리스탈 (개)</option>
        </select>
      </Row>

      <Row>
        <Input
          placeholder="골드 비율 (예: 25)"
          type="number"
          value={goldRate || ""}
          onChange={(e) => setGoldRate(Number(e.target.value))}
        />
        <Input
          placeholder="크리스탈 비율 (예: 95)"
          type="number"
          value={crystalRate || ""}
          onChange={(e) => setCrystalRate(Number(e.target.value))}
        />
      </Row>

      <Table>
        <thead>
          <tr>
            {["이름", "수량", "전일 평균", "최근 거래", "최저가"].map(
              (label, i, arr) => (
                <Th key={label} isLast={i === arr.length - 1}>
                  {label}
                </Th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {materials.map((m, index) => (
            <TableRow key={index}>
              <Td>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <img
                    src={m.icon}
                    alt={m.name}
                    style={{ width: 48, height: 48, objectFit: "contain" }}
                  />
                  <div>
                    <div style={{ fontWeight: "bold" }}>{m.name}</div>
                    {m.bundle > 1 && (
                      <div style={{ fontSize: "12px", color: "#aaa" }}>
                        [{m.bundle}개 단위 판매]
                      </div>
                    )}
                  </div>
                </div>
              </Td>
              <Td center>
                <input
                  type="number"
                  value={m.quantity}
                  onChange={(e) =>
                    handleMaterialChange(index, "quantity", e.target.value)
                  }
                  style={{ width: "50px" }}
                />
              </Td>
              <Td center>{m.avg ?? "-"}</Td>
              <Td center>{m.recent ?? "-"}</Td>
              <Td center noRight>
                {m.min ?? "-"}
              </Td>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <AddButton onClick={() => setShowModal(true)}>+</AddButton>
      <ActionButton onClick={calculatePackageGoldValue}>효율 계산</ActionButton>

      {result && (
        <Result>
          {result.text.split("%c")[0]}
          <span style={{ color: result.color }}>{result.diff}%</span>
        </Result>
      )}
      {showModal && (
        <Modal>
          <h3>재료 추가</h3>
          {presetMaterials.map(({ name, categoryCode }) => (
            <div
              key={name}
              style={{ cursor: "pointer", marginBottom: 5 }}
              onClick={() => {
                addMaterialByName(name, categoryCode);
                setShowModal(false);
              }}
            >
              {name}
            </div>
          ))}
        </Modal>
      )}
    </Container>
  );
}

export default Package;
