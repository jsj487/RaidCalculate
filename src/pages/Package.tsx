import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import styled from "styled-components";
import ChartModal from "../components/packagepage/ChartModal";
import { Helmet } from "react-helmet";

const SectionCard = styled.div`
  display: flex;
  flex-direction: column; // 필요 시 추가
  align-items: center;
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 20px 30px;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 16px;
  background-color: #1e1e1e;
`;

const InnerCard = styled.div`
  width: 100%;
  max-width: 780px;
  background-color: #2a2a2a;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const HorizontalGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`;

const Row2ColWrapper = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;

  option {
    background-color: #1e1e1e;
    color: white;
  }
`;

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const ResultCard = styled(SectionCard)`
  background-color: #1e1e1e;
  text-align: center;
  padding: 32px;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  min-width: 700px;
  width: 100%;
  border-collapse: collapse;
  color: white;
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

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  width: 200px;
`;

const Result = styled.div`
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

//재료 모달창
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  max-height: 80vh;
  width: 600px;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
`;

const MaterialOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  margin-bottom: 8px;
  background-color: #333;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #444;
  }
`;

const MaterialIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const ModalTitle = styled.h3`
  margin-bottom: 16px;
  text-align: center;
  font-size: 20px;
`;

const ScrollableBox = styled.div`
  max-height: 400px;
  overflow-y: auto;

  /* 스크롤바 커스터마이징 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #222;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #666;
    border-radius: 4px;
  }
`;

interface Stat {
  Date: string;
  AvgPrice: number;
  TradeCount: number;
}

interface MarketItem {
  Id: number;
  Name: string;
  Icon: string;
  RecentPrice: number;
  CurrentMinPrice: number;
  YDayAvgPrice: number;
  BundleCount?: number;
  stats: Stat[];
}

function Package() {
  const [goldRate, setGoldRate] = useState(0);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedChartIndex, setSelectedChartIndex] = useState<number | null>(
    null
  );
  const [selectedTier, setSelectedTier] = useState<"T3" | "T4" | "all">("all");
  const [selectedType, setSelectedType] = useState<
    "파괴석" | "수호석" | "돌파석" | "융화" | "파편" | "숨결" | "all"
  >("all");
  const [packagePrice, setPackagePrice] = useState<number>(0);
  const [priceType, setPriceType] = useState<"cash" | "crystal">("cash");
  const [crystalRate, setCrystalRate] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [materials, setMaterials] = useState<
    {
      name: string;
      quantity: number | string;
      price: number;
      icon: string;
      recent: number;
      min: number;
      avg: number;
      bundle: number; // <- 추가
      stats: {
        Date: string;
        AvgPrice: number;
        TradeCount: number;
      }[];
    }[]
  >([]);
  const [result, setResult] = useState<{
    text: string;
    diff: number;
    color: string;
  } | null>(null);

  const presetMaterials = [
    {
      name: "운명의 파괴석",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png",
      tier: "T4",
      type: "파괴석",
    },
    {
      name: "운명의 수호석",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png",
      tier: "T4",
      type: "수호석",
    },
    {
      name: "운명의 돌파석",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png",
      tier: "T4",
      type: "돌파석",
    },
    {
      name: "아비도스 융화 재료",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_86.png",
      tier: "T4",
      type: "융화",
    },
    {
      name: "운명의 파편 주머니(대)",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_93.png",
      tier: "T4",
      type: "파편",
    },
    {
      name: "운명의 파편 주머니(중)",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_92.png",
      tier: "T4",
      type: "파편",
    },
    {
      name: "운명의 파편 주머니(소)",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_91.png",
      tier: "T4",
      type: "파편",
    },
    {
      name: "용암의 숨결",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_171.png",
      tier: "T4",
      type: "숨결",
    },
    {
      name: "빙하의 숨결",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_172.png",
      tier: "T4",
      type: "숨결",
    },

    {
      name: "정제된 파괴강석",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_11_15.png",
      tier: "T3",
      type: "파괴석",
    },
    {
      name: "파괴강석",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_10_58.png",
      tier: "T3",
      type: "파괴석",
    },
    {
      name: "파괴석 결정",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_6_105.png",
      tier: "T3",
      type: "파괴석",
    },
    {
      name: "정제된 수호강석",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_11_16.png",
      tier: "T3",
      type: "수호석",
    },
    {
      name: "수호강석",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_10_59.png",
      tier: "T3",
      type: "수호석",
    },
    {
      name: "수호석 결정",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_6_104.png",
      tier: "T3",
      type: "수호석",
    },
    {
      name: "찬란한 명예의 돌파석",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_11_17.png",
      tier: "T3",
      type: "돌파석",
    },
    {
      name: "경이로운 명예의 돌파석",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_157.png",
      tier: "T3",
      type: "돌파석",
    },
    {
      name: "위대한 명예의 돌파석",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_156.png",
      tier: "T3",
      type: "돌파석",
    },
    {
      name: "명예의 돌파석",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_155.png",
      tier: "T3",
      type: "돌파석",
    },
    {
      name: "최상급 오레하 융화 재료",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_11_29.png",
      tier: "T3",
      type: "융화",
    },
    {
      name: "상급 오레하 융화 재료",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_8_109.png",
      tier: "T3",
      type: "융화",
    },
    {
      name: "오레하 융화 재료",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_9_71.png",
      tier: "T3",
      type: "융화",
    },
    {
      name: "명예의 파편 주머니(대)",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_8_227.png",
      tier: "T3",
      type: "파편",
    },
    {
      name: "명예의 파편 주머니(중)",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_8_226.png",
      tier: "T3",
      type: "파편",
    },
    {
      name: "명예의 파편 주머니(소)",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_8_225.png",
      tier: "T3",
      type: "파편",
    },
    {
      name: "태양의 가호",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_163.png",
      tier: "T3",
      type: "숨결",
    },
    {
      name: "태양의 축복",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_162.png",
      tier: "T3",
      type: "숨결",
    },
    {
      name: "태양의 은총",
      categoryCode: 50000,
      icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_161.png",
      tier: "T3",
      type: "숨결",
    },
  ];

  const filteredMaterials = presetMaterials.filter(
    (m) =>
      (selectedTier === "all" || m.tier === selectedTier) &&
      (selectedType === "all" || m.type === selectedType)
  );

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

      const itemId = match.Id;
      const detailRes = await axios.get(`/api/market/items/${itemId}`);
      console.log("상세 응답 전체:", detailRes.data);
      const detail = Array.isArray(detailRes.data)
        ? detailRes.data[0]
        : detailRes.data;

      // 이미 추가된 재료인지 확인
      if (materials.some((m) => m.name === match!.Name)) {
        alert(`"${match.Name}"은 이미 추가된 재료입니다.`);
        return;
      }

      // 재료 정보 state에 추가
      if (editIndex !== null) {
        const updated = [...materials];
        updated[editIndex] = {
          name: match.Name,
          quantity: 1,
          price: match.RecentPrice,
          icon: match.Icon,
          recent: match.RecentPrice,
          min: match.CurrentMinPrice,
          avg: match.YDayAvgPrice,
          bundle: match.BundleCount ?? 1,
          stats: detail.Stats?.slice(0, 7) ?? [],
        };
        setMaterials(updated);
      } else {
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
            bundle: match.BundleCount ?? 1,
            stats: detail.Stats?.slice(0, 7) ?? [],
          },
        ]);
      }
    } catch (err) {
      console.error("재료 시세 요청 실패:", err);
    }
  };

  const calculatePackageGoldValue = () => {
    const totalGold = materials.reduce(
      (sum, m) => sum + m.price * Number(m.quantity),
      0
    );

    let resultText = "";
    let 기준골드 = 0;
    let 금액가치 = "";
    let 비교값 = "";

    // 1. 기준 골드 계산
    if (packagePrice && priceType) {
      if (priceType === "cash") {
        const goldFromCash = (packagePrice / goldRate) * 100;
        기준골드 = goldFromCash;
        금액가치 = `현금 ₩${packagePrice.toLocaleString()} → 약 ${Math.floor(
          goldFromCash
        ).toLocaleString()} 골드 가치`;
      } else if (priceType === "crystal") {
        const goldFromCrystal = (packagePrice * crystalRate) / 95;
        기준골드 = goldFromCrystal;
        금액가치 = `크리스탈 ${packagePrice}개 → 약 ${Math.floor(
          goldFromCrystal
        ).toLocaleString()} 골드 가치`;
      }
    }

    // 2. 재료 총합 계산
    if (totalGold > 0 && 기준골드 > 0) {
      const goldCostInKRW = goldRate ? (totalGold * goldRate) / 100 : 0;
      const crystalAmount = crystalRate ? totalGold / (crystalRate / 95) : 0;

      let 비교기준 = "";
      if (priceType === "cash") {
        비교기준 = `→ 골드 기준 현금가: 약 ${Math.floor(
          goldCostInKRW
        ).toLocaleString()}원`;
      } else if (priceType === "crystal") {
        비교기준 = `→ 크리스탈 기준: 약 ${Math.ceil(crystalAmount)} 개`;
      }

      // 3. 차이 계산
      const 차이율 = ((totalGold - 기준골드) / 기준골드) * 100;
      const rounded = Math.round(차이율);
      let percentColor = "gray";
      if (rounded > 1) percentColor = "red";
      else if (rounded < -1) percentColor = "skyblue";

      const 효율 = `${rounded >= 0 ? "이득" : "손해"}:  `;

      // 4. 최종 텍스트 조립
      resultText = `
${금액가치}

패키지 구성 값:
총 ${totalGold.toLocaleString()} 골드
${비교기준}
${효율}
`.trim();

      // 5. 결과 저장
      setResult({
        text: resultText,
        diff: rounded,
        color: percentColor,
      });
    }
  };

  const handleMaterialChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...materials];
    updated[index] = {
      ...updated[index],
      [field]: field === "quantity" ? value : Number(value),
    };
    setMaterials(updated);
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <Container>
      <Helmet>
        <title>패키지 계산기 - ArkLator</title>
        <meta name="description" content="로스트아크 패키지 효율 계산기" />
      </Helmet>
      <OuterContainer>
        <InnerCard>
          <HorizontalGroup>
            <Row2ColWrapper>
              <InputGroup>
                <Select
                  value={priceType}
                  onChange={(e) =>
                    setPriceType(e.target.value as "cash" | "crystal")
                  }
                >
                  <option value="cash">현금 (₩)</option>
                  <option value="crystal">크리스탈 (개)</option>
                </Select>

                <Input
                  placeholder="골드 비율 (예: 25)"
                  type="number"
                  value={goldRate || ""}
                  onChange={(e) => setGoldRate(Number(e.target.value))}
                />
              </InputGroup>

              <InputGroup>
                <Input
                  type="number"
                  placeholder="패키지 가격"
                  value={packagePrice || ""}
                  onChange={(e) => setPackagePrice(Number(e.target.value))}
                />
                {priceType === "crystal" && (
                  <Input
                    placeholder="크리스탈 비율 (예: 6000)"
                    type="number"
                    value={crystalRate || ""}
                    onChange={(e) => setCrystalRate(Number(e.target.value))}
                  />
                )}
              </InputGroup>
            </Row2ColWrapper>
          </HorizontalGroup>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  {[
                    "이름",
                    "수량",
                    "전일 평균",
                    "최근 거래",
                    "최저가",
                    "시세",
                  ].map((label, i, arr) => (
                    <Th key={label} isLast={i === arr.length - 1}>
                      {label}
                    </Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {materials.map((m, index) => (
                  <TableRow key={index}>
                    <Td
                      style={{
                        borderRight: "1px solid #444",
                        padding: "8px",
                        cursor: "pointer",
                        backgroundColor: "#1e1e1e",
                      }}
                      onClick={() => {
                        setShowModal(true);
                        setEditIndex(index);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#2a2a2a";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#1e1e1e";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <img
                          src={m.icon}
                          alt={m.name}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "contain",
                          }}
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
                        value={m.quantity === 0 ? "" : m.quantity}
                        onChange={(e) =>
                          handleMaterialChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        style={{ width: "50px" }}
                      />
                    </Td>
                    <Td center>{m.avg ?? "-"}</Td>
                    <Td center>{m.recent ?? "-"}</Td>
                    <Td center>{m.min ?? "-"}</Td>
                    <Td center noRight>
                      <button
                        onClick={() => {
                          setSelectedChartIndex(index);
                        }}
                        style={{
                          backgroundColor: "#2a2a2a",
                          border: "none",
                          borderRadius: "50%",
                          padding: "8px",
                          cursor: "pointer",
                        }}
                        title="시세 보기"
                      >
                        <FaChartLine size={18} color="#fff" />
                      </button>
                    </Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
          <AddButton onClick={() => setShowModal(true)}>+</AddButton>
          <ActionButton onClick={calculatePackageGoldValue}>
            효율 계산
          </ActionButton>
          <FlexRow>
            {result && (
              <ResultCard>
                <Result>
                  {result.text.split("%c")[0]}
                  <span style={{ color: result.color }}> {result.diff}%</span>
                </Result>
              </ResultCard>
            )}
          </FlexRow>
        </InnerCard>
      </OuterContainer>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>재료 선택</ModalTitle>
            <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
              {["all", "T4", "T3"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier as "T3" | "T4" | "all")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    backgroundColor: selectedTier === tier ? "#3a72e8" : "#555",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {tier === "all" ? "전체 티어" : tier}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              {[
                "all",
                "파괴석",
                "수호석",
                "돌파석",
                "융화",
                "파편",
                "숨결",
              ].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setSelectedType(
                      type as
                        | "파괴석"
                        | "수호석"
                        | "돌파석"
                        | "융화"
                        | "파편"
                        | "숨결"
                        | "all"
                    )
                  }
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    backgroundColor: selectedType === type ? "#3a72e8" : "#555",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {type === "all" ? "전체 종류" : type}
                </button>
              ))}
            </div>
            <ScrollableBox>
              {filteredMaterials.map(({ name, icon, categoryCode }) => (
                <MaterialOption
                  key={name}
                  onClick={() => {
                    addMaterialByName(name, categoryCode);
                    setShowModal(false);
                    setEditIndex(null);
                  }}
                >
                  <MaterialIcon src={icon} alt={name} />
                  <div>{name}</div>
                </MaterialOption>
              ))}
            </ScrollableBox>
          </ModalBox>
        </ModalOverlay>
      )}

      <ChartModal
        open={selectedChartIndex !== null}
        onClose={() => setSelectedChartIndex(null)}
        itemName={materials[selectedChartIndex!]?.name || ""}
        icon={materials[selectedChartIndex!]?.icon || ""}
        bundle={materials[selectedChartIndex!]?.bundle || 1}
        stats={materials[selectedChartIndex!]?.stats || []}
      />
    </Container>
  );
}

export default Package;
