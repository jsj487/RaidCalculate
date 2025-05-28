import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { logBraceletResult } from "../utils/BraceletLogger";
import { generateBraceletOptions } from "../utils/GachaGenerator";
import { AllOptions } from "../utils/BaraceletOptions";

import { Helmet } from "react-helmet";
import { v4 as uuidv4 } from "uuid";
import { collection, onSnapshot } from "firebase/firestore";
import { supabase } from "../utils/SupabaseClient";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  color: white;
  font-family: sans-serif;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BraceletBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1e1e1e;
  border: 1px solid #555;
  padding: 20px;
  border-radius: 12px;
  width: 500px;
  margin: 0 auto;
`;

const BraceletImage = styled.img`
  width: 80px;
  height: 80px;
  margin: 0 auto 12px;
  display: block;
`;

const BraceletName = styled.h2`
  font-size: 20px;
  color: #fff;
  text-align: center;
  margin-bottom: 16px;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #444;
  margin: 16px 0;
`;

const SectionTitle = styled.h3`
  color: #f2c94c;
  font-size: 16px;
  margin-bottom: 10px;
`;

const EffectBox = styled.div`
  border: 1px solid #444;
  height: 300px;
  border-radius: 10px;
  background-color: #181818;
  padding: 16px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
`;

const Button = styled.button`
  background-color: #333;
  color: white;
  border: 1px solid #fff;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

const CenterButton = styled(Button)`
  display: block;
  margin: 24px auto 0;
`;

const LogButton = styled.button`
  position: absolute;
  top: 120px;
  right: 50px;
  background-color: #333;
  color: white;
  border: 1px solid #fff;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

const OptionLine = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 6px 0;
`;

const ValueSpan = styled.span<{ grade: string }>`
  color: ${({ grade }) =>
    grade === "상옵"
      ? "#FFA500"
      : grade === "중옵"
      ? "#9370DB"
      : grade === "하옵"
      ? "#1E90FF"
      : "white"};
`;

type GeneratedOption = {
  id: string;
  parts: (string | { value: string; grade: string })[];
  locked: boolean;
};

type CategoryStats = {
  [type: string]: {
    [range: string]: number;
  };
};

type CombatStatsMap = CategoryStats;

type SpecialStatsMap = {
  [template: string]: {
    하옵: number;
    중옵: number;
    상옵: number;
    total: number;
  };
};

function parseTemplate(template: string, values: string[], grade: string) {
  const parts: (string | { value: string; grade: string })[] = [];

  const valueRegex = /VALUE\d*/g;
  let lastIndex = 0;
  let match;
  let index = 0;

  const hasPlaceholder = valueRegex.test(template);
  if (!hasPlaceholder) {
    // VALUE가 없는 경우: 텍스트 + 수치 사이 띄어쓰기 추가
    parts.push(template);
    if (values.length > 0) {
      parts.push({ value: " " + values.join(" "), grade });
    }
    return parts;
  }

  // VALUE 치환 처리
  valueRegex.lastIndex = 0; // regex 재사용 시 초기화
  while (
    (match = valueRegex.exec(template)) !== null &&
    index < values.length
  ) {
    const before = template.slice(lastIndex, match.index);
    if (before) parts.push(before);
    parts.push({ value: values[index], grade });
    lastIndex = valueRegex.lastIndex;
    index++;
  }

  if (lastIndex < template.length) {
    parts.push(template.slice(lastIndex));
  }

  return parts;
}

const BraceletGachaSimulator = () => {
  const [generated, setGenerated] = useState<GeneratedOption[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expanded, setExpanded] = useState({
    기본효과: true,
    전투특성: true,
    특수효과: true,
  });
  const [baseStats, setBaseStats] = useState<CategoryStats>({});
  const [combatStats, setCombatStats] = useState<CombatStatsMap>({});
  const [specialStats, setSpecialStats] = useState<SpecialStatsMap>({});

  const [categoryCounts, setCategoryCounts] = useState<{
    기본효과: number;
    전투특성: number;
    특수효과: number;
  }>({ 기본효과: 0, 전투특성: 0, 특수효과: 0 });

  const handleGenerate = () => {
    const previous = generated;
    const lockedTemplates = new Set<string>();

    const newGenerated: GeneratedOption[] = [];

    // 1. 잠금된 항목 유지
    for (const opt of previous) {
      if (opt.locked) {
        newGenerated.push(opt);

        const template = opt.parts
          .map((p) => (typeof p === "string" ? p : "VALUE"))
          .join("");
        lockedTemplates.add(template);
      }
    }

    // 2. 나머지 칸은 새로 뽑기
    let safetyCount = 0;
    const CATEGORIES = ["기본 효과", "전투 특성", "특수 효과"];

    while (newGenerated.length < 3) {
      const [raw] = generateBraceletOptions(CATEGORIES); // 항상 1개만 생성됨
      const values = raw.value ? raw.value.split(" ") : [];
      const parts = parseTemplate(raw.name, values, raw.grade ?? "하옵");

      const template = parts
        .map((p) => (typeof p === "string" ? p : "VALUE"))
        .join("");

      if (lockedTemplates.has(template)) {
        safetyCount++;
        continue;
      }

      newGenerated.push({
        parts,
        locked: false,
        id: uuidv4(),
      });

      lockedTemplates.add(template);
    }

    setGenerated(newGenerated);
    logBraceletResult(newGenerated);
  };

  useEffect(() => {
    const fetchInitialCompressedLogs = async () => {
      const { data, error } = await supabase
        .from("bracelet_logs_compressed")
        .select("draw_result")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("통계 로딩 에러:", error);
        return;
      }

      const base: CategoryStats = {};
      const combat: CombatStatsMap = {};
      const special: SpecialStatsMap = {};
      let baseCount = 0;
      let combatCount = 0;
      let specialCount = 0;

      data?.forEach((log) => {
        log.draw_result.forEach((opt: any) => {
          const { category, template, value, grade } = opt;

          if (category === "기본 효과") {
            baseCount++;
            if (!base[template]) base[template] = {};
            if (!base[template][value]) base[template][value] = 0;
            base[template][value]++;
          }

          if (category === "전투 특성") {
            combatCount++;
            if (!combat[template]) combat[template] = {};
            if (!combat[template][value]) combat[template][value] = 0;
            combat[template][value]++;
          }

          if (category === "특수 효과") {
            specialCount++;
            if (!special[template]) {
              special[template] = { 하옵: 0, 중옵: 0, 상옵: 0, total: 0 };
            }
            special[template][grade as "하옵" | "중옵" | "상옵"]++;
            special[template].total++;
          }
        });
      });

      setBaseStats(base);
      setCombatStats(combat);
      setSpecialStats(special);
      setCategoryCounts({
        기본효과: baseCount,
        전투특성: combatCount,
        특수효과: specialCount,
      });
    };

    fetchInitialCompressedLogs();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("bracelet-logs")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bracelet_logs",
        },
        (payload) => {
          const { category, template, grade, value } = payload.new;

          const mappedKey =
            category === "기본 효과"
              ? "기본효과"
              : category === "전투 특성"
              ? "전투특성"
              : "특수효과";

          setCategoryCounts((prev) => ({
            ...prev,
            [mappedKey]: prev[mappedKey] + 1,
          }));

          if (category === "기본 효과") {
            const type = template.replace("VALUE", "").trim();
            const range = value.trim();

            setBaseStats((prev) => {
              const next = { ...prev };
              if (!next[type]) next[type] = {};
              if (!next[type][range]) next[type][range] = 0;
              next[type][range]++;
              return next;
            });
          }

          if (category === "전투 특성") {
            const type = template.replace("VALUE", "").trim();
            const range = value.trim();

            setCombatStats((prev) => {
              const next = { ...prev };
              if (!next[type]) next[type] = {};
              if (!next[type][range]) next[type][range] = 0;
              next[type][range]++;
              return next;
            });
          }

          if (category === "특수 효과") {
            setSpecialStats((prev) => {
              const next = { ...prev };
              const typedGrade = grade as "하옵" | "중옵" | "상옵";
              if (!next[template]) {
                next[template] = { 하옵: 0, 중옵: 0, 상옵: 0, total: 0 };
              }
              next[template][typedGrade]++;
              next[template].total++;
              return next;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const STAT_ORDER = ["치명", "특화", "신속", "제압", "인내", "숙련"];

  const probabilityMap: Record<string, number> = {};
  const baseProbabilityMap: Record<string, number> = {};

  // AllOptions 기반 확률 Map 구성
  AllOptions.forEach((opt) => {
    opt.values.forEach((val) => {
      // 기본 효과와 전투 특성은 type + range 조합으로 key 생성
      if (opt.category === "기본 효과" || opt.category === "전투 특성") {
        const key = `${opt.type} ${val.range}`;
        baseProbabilityMap[key] = val.probability;
        probabilityMap[key] = val.probability;
      }

      // 특수 효과는 template + range (또는 grade 추가 가능)
      if (opt.category === "특수 효과") {
        const key = `${opt.template} ${val.range}`;
        probabilityMap[key] = val.probability;
      }
    });
  });

  const totalSpecialCount = Object.values(specialStats).reduce(
    (acc, counts) => acc + counts.하옵 + counts.중옵 + counts.상옵,
    0
  );
  const percent = (n: number) => ((n / totalSpecialCount) * 100).toFixed(2);

  const toggleExpand = (key: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalOptions =
    categoryCounts.기본효과 + categoryCounts.전투특성 + categoryCounts.특수효과;

  const categoryPercent = (count: number) =>
    totalOptions > 0 ? ((count / totalOptions) * 100).toFixed(2) : "0.00";

  return (
    <Container>
      <Helmet>
        <title>팔찌 가챠 - ArkLator</title>
        <meta name="description" content="로스트아크 팔찌 시뮬레이터" />
      </Helmet>

      <LogButton onClick={() => setIsModalOpen(true)}>로그 기록 보기</LogButton>
      <Wrapper>
        <BraceletBox>
          <BraceletImage
            src={`${process.env.PUBLIC_URL}/img/Bracelet.png`}
            alt="Bracelet"
          />
          <BraceletName>찬란한 영웅의 팔찌</BraceletName>

          <Divider />

          <SectionTitle>부여 효과</SectionTitle>
          <EffectBox>
            {generated.map((opt, i) => (
              <OptionLine key={opt.id}>
                <button
                  onClick={() => {
                    const updated = [...generated];
                    updated[i].locked = !updated[i].locked;
                    setGenerated(updated);
                  }}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: opt.locked ? "#FFA500" : "#444",
                    color: "white",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "5px",
                    padding: "2px 8px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {opt.locked ? "잠금" : "해제"}
                </button>
                <div style={{ lineHeight: "1.6", marginTop: "2px" }}>
                  {opt.parts.map((part, j) =>
                    typeof part === "string" ? (
                      <span key={j}>{part}</span>
                    ) : (
                      <ValueSpan key={j} grade={part.grade}>
                        {part.value}
                      </ValueSpan>
                    )
                  )}
                </div>
              </OptionLine>
            ))}
          </EffectBox>

          <CenterButton onClick={handleGenerate}>뽑기</CenterButton>
        </BraceletBox>
      </Wrapper>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#222",
              padding: "20px",
              borderRadius: "10px",
              maxHeight: "80vh",
              overflowY: "auto",
              minWidth: "400px",
            }}
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
          >
            <h2
              onClick={() => toggleExpand("기본효과")}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "white",
                fontSize: "18px",
                marginBottom: "8px",
              }}
            >
              <span style={{ marginRight: "8px" }}>
                {expanded.기본효과 ? "▼" : "▶"}
              </span>
              기본 효과: {categoryCounts.기본효과}회 (
              {categoryPercent(categoryCounts.기본효과)}%)
            </h2>

            <AnimatePresence initial={false}>
              {expanded.기본효과 && (
                <motion.div
                  key="base-stats"
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  {Object.entries(baseStats).map(([type, rangeMap]) => {
                    const total = Object.values(rangeMap).reduce(
                      (a, b) => a + b,
                      0
                    );

                    return (
                      <div key={type} style={{ marginBottom: "20px" }}>
                        <h3 style={{ color: "white" }}>
                          {type} (총 {total}회)
                        </h3>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "14px",
                            color: "white",
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  padding: "8px",
                                  borderBottom: "1px solid #555",
                                }}
                              >
                                수치 범위
                              </th>
                              <th
                                style={{
                                  padding: "8px",
                                  borderBottom: "1px solid #555",
                                }}
                              >
                                등장 횟수
                              </th>
                              <th
                                style={{
                                  padding: "8px",
                                  borderBottom: "1px solid #555",
                                }}
                              >
                                등장 비율 (%)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(rangeMap)
                              .sort((a, b) => {
                                const aStart = parseInt(a[0].split("~")[0]);
                                const bStart = parseInt(b[0].split("~")[0]);
                                return aStart - bStart;
                              })
                              .map(([range, count]) => (
                                <tr key={range}>
                                  <td style={{ padding: "6px" }}>{range}</td>
                                  <td
                                    style={{
                                      padding: "6px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {count}
                                  </td>
                                  <td
                                    style={{
                                      padding: "6px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {((count / total) * 100).toFixed(2)}%
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            <h2
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "white",
                fontSize: "18px",
                marginBottom: "8px",
              }}
              onClick={() => toggleExpand("전투특성")}
            >
              <span style={{ marginRight: "8px" }}>
                {expanded.전투특성 ? "▼" : "▶"}
              </span>
              전투 특성: {categoryCounts.전투특성}회 (
              {categoryPercent(categoryCounts.전투특성)}%)
            </h2>

            <AnimatePresence initial={false}>
              {expanded.전투특성 && (
                <motion.div
                  key="base-stats"
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  {Object.entries(combatStats)
                    .sort(
                      ([a], [b]) =>
                        STAT_ORDER.indexOf(a) - STAT_ORDER.indexOf(b)
                    )
                    .map(([type, rangeMap]) => {
                      const total = Object.values(rangeMap).reduce(
                        (a, b) => a + b,
                        0
                      );

                      return (
                        <div key={type} style={{ marginBottom: "20px" }}>
                          <h3 style={{ color: "white" }}>
                            {type} (총 {total}회)
                          </h3>
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              fontSize: "14px",
                              color: "white",
                            }}
                          >
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    padding: "8px",
                                    borderBottom: "1px solid #555",
                                  }}
                                >
                                  수치 범위
                                </th>
                                <th
                                  style={{
                                    padding: "8px",
                                    borderBottom: "1px solid #555",
                                  }}
                                >
                                  등장 횟수
                                </th>
                                <th
                                  style={{
                                    padding: "8px",
                                    borderBottom: "1px solid #555",
                                  }}
                                >
                                  등장 비율 (%)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(rangeMap)
                                .sort(
                                  (a, b) =>
                                    parseInt(a[0].split("~")[0]) -
                                    parseInt(b[0].split("~")[0])
                                )
                                .map(([range, count]) => (
                                  <tr key={range}>
                                    <td style={{ padding: "6px" }}>{range}</td>
                                    <td
                                      style={{
                                        padding: "6px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {count}
                                    </td>
                                    <td
                                      style={{
                                        padding: "6px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {((count / total) * 100).toFixed(2)}%
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                </motion.div>
              )}
            </AnimatePresence>

            <h2
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "white",
                fontSize: "18px",
                marginBottom: "8px",
              }}
              onClick={() => toggleExpand("특수효과")}
            >
              <span style={{ marginRight: "8px" }}>
                {expanded.특수효과 ? "▼" : "▶"}
              </span>
              특수 효과: {categoryCounts.특수효과}회 (
              {categoryPercent(categoryCounts.특수효과)}%)
            </h2>

            <AnimatePresence initial={false}>
              {expanded.특수효과 && (
                <motion.div
                  key="special-stats"
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "14px",
                      color: "white",
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          옵션
                        </th>
                        <th style={{ textAlign: "center", padding: "8px" }}>
                          하옵 (%)
                        </th>
                        <th style={{ textAlign: "center", padding: "8px" }}>
                          중옵 (%)
                        </th>
                        <th style={{ textAlign: "center", padding: "8px" }}>
                          상옵 (%)
                        </th>
                        <th style={{ textAlign: "center", padding: "8px" }}>
                          총합 (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(specialStats)
                        .sort((a, b) => {
                          const totalA = a[1].하옵 + a[1].중옵 + a[1].상옵;
                          const totalB = b[1].하옵 + b[1].중옵 + b[1].상옵;
                          return totalB - totalA;
                        })
                        .map(([template, counts]) => {
                          const total = counts.하옵 + counts.중옵 + counts.상옵;
                          return (
                            <tr key={template}>
                              <td>{template}</td>
                              <td style={{ textAlign: "center" }}>
                                {percent(counts.하옵)}%
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {percent(counts.중옵)}%
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {percent(counts.상옵)}%
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                {percent(total)}%
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </Container>
  );
};

export default BraceletGachaSimulator;
