import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { logBraceletResult } from "../utils/BraceletLogger";
import { generateFinalOptions } from "../utils/GachaGenerator";
import {
  BaseEffects,
  CombatStats,
  SpecialOptions,
} from "../utils/BaraceletOptions";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../utils/FireBase";

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background-color: #111;
  color: white;
  font-family: sans-serif;
`;

const Title = styled.h1`
  font-size: 22px;
  margin-bottom: 20px;
  text-align: center;
`;

const ResultBox = styled.div`
  border: 1px solid #888;
  border-radius: 10px;
  padding: 20px;
  background-color: #1e1e1e;
  margin-bottom: 20px;
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

const Button = styled.button`
  background-color: #2e8b57;
  color: white;
  padding: 10px 20px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #276849;
  }
`;

type GeneratedOption = {
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

  const [baseStats, setBaseStats] = useState<CategoryStats>({});
  const [combatStats, setCombatStats] = useState<CombatStatsMap>({});
  const [specialStats, setSpecialStats] = useState<SpecialStatsMap>({});

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
    while (newGenerated.length < 3) {
      const raw = generateFinalOptions()[0]; // 하나씩 뽑기
      const values = raw.value ? raw.value.split(" ") : [];
      const parts = parseTemplate(raw.name, values, raw.grade ?? "하옵");
      const template = parts
        .map((p) => (typeof p === "string" ? p : "VALUE"))
        .join("");

      if (lockedTemplates.has(template)) continue;

      newGenerated.push({ parts, locked: false });
      lockedTemplates.add(template);
    }

    setGenerated(newGenerated);
    logBraceletResult(newGenerated);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "bracelet_logs"),
      (snapshot) => {
        const base: CategoryStats = {};
        const combat: CombatStatsMap = {};
        const special: SpecialStatsMap = {};

        snapshot.forEach((doc) => {
          const data = doc.data().options;

          if (data) {
            if (Array.isArray(data["기본 효과"])) {
              data["기본 효과"].forEach((opt) => {
                const type = opt.template.replace("VALUE", "").trim();
                const range = opt.value.trim();

                if (!base[type]) base[type] = {};
                if (!base[type][range]) base[type][range] = 0;
                base[type][range]++;
              });
            }

            if (Array.isArray(data["전투 특성"])) {
              data["전투 특성"].forEach((opt) => {
                const type = opt.template.replace("VALUE", "").trim();
                const range = opt.value.trim();

                if (!combat[type]) combat[type] = {};
                if (!combat[type][range]) combat[type][range] = 0;
                combat[type][range]++;
              });
            }

            if (Array.isArray(data["특수 효과"])) {
              data["특수 효과"].forEach((opt) => {
                const template = opt.template;
                const grade = opt.grade as "하옵" | "중옵" | "상옵";

                if (!special[template]) {
                  special[template] = { 하옵: 0, 중옵: 0, 상옵: 0, total: 0 }; // ✅ total 포함
                }

                special[template][grade]++;
                special[template].total++; // ✅ total 증가
              });
            }
          }
        });

        setBaseStats(base);
        setCombatStats(combat);
        setSpecialStats(special);
      }
    );

    return () => unsubscribe();
  }, []);

  const STAT_ORDER = ["치명", "특화", "신속", "제압", "인내", "숙련"];

  const probabilityMap: Record<string, number> = {};

  // 기본 효과
  const baseProbabilityMap: Record<string, number> = {};
  BaseEffects.forEach((eff) => {
    eff.values.forEach((val) => {
      const key = `${eff.type} ${val.range}`;
      baseProbabilityMap[key] = val.probability;
    });
  });

  // 전투 특성
  CombatStats.forEach((stat) => {
    stat.values.forEach((val) => {
      const key = `${stat.type} ${val.range}`;
      probabilityMap[key] = val.probability;
    });
  });

  // 특수 효과
  SpecialOptions.forEach((opt) => {
    opt.tiers.forEach((tier) => {
      const key = `${opt.template} ${tier.value.join(" ")}`;
      probabilityMap[key] = tier.probability;
    });
  });

  return (
    <Container>
      <Title>팔찌 가챠 시뮬레이터</Title>
      <ResultBox>
        {generated.map((opt, i) => (
          <OptionLine key={i}>
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
            <div style={{ lineHeight: "1.6" }}>
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
      </ResultBox>
      <Button onClick={() => setIsModalOpen(true)}>로그 기록 보기</Button>
      <Button onClick={handleGenerate}>뽑기</Button>

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
            <h2 style={{ color: "white" }}>기본 효과 통계</h2>
            {Object.entries(baseStats).map(([type, rangeMap]) => {
              const total = Object.values(rangeMap).reduce((a, b) => a + b, 0);

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
                          // "10241~10880" → 10241, "12161~12800" → 12161
                          const aStart = parseInt(a[0].split("~")[0]);
                          const bStart = parseInt(b[0].split("~")[0]);
                          return aStart - bStart;
                        })
                        .map(([range, count]) => (
                          <tr key={range}>
                            <td style={{ padding: "6px" }}>{range}</td>
                            <td style={{ padding: "6px", textAlign: "center" }}>
                              {count}
                            </td>
                            <td style={{ padding: "6px", textAlign: "center" }}>
                              {((count / total) * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
            <h2 style={{ color: "white", marginTop: "40px" }}>
              전투 특성 통계
            </h2>
            {Object.entries(combatStats)
              .sort(
                ([a], [b]) => STAT_ORDER.indexOf(a) - STAT_ORDER.indexOf(b) // 정해진 순서로 정렬
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
                                style={{ padding: "6px", textAlign: "center" }}
                              >
                                {count}
                              </td>
                              <td
                                style={{ padding: "6px", textAlign: "center" }}
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
            <h2 style={{ color: "white", marginTop: "40px" }}>
              특수 효과 통계
            </h2>
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
                  <th style={{ textAlign: "left", padding: "8px" }}>옵션</th>
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
                  .sort((a, b) => b[1].total - a[1].total)
                  .map(([template, counts]) => {
                    const total = counts.total;
                    const percent = (n: number) =>
                      ((n / total) * 100).toFixed(2);

                    return (
                      <tr key={template}>
                        <td style={{ padding: "8px" }}>{template}</td>
                        <td style={{ textAlign: "center" }}>
                          {percent(counts["하옵"])}%
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {percent(counts["중옵"])}%
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {percent(counts["상옵"])}%
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {total}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Container>
  );
};

export default BraceletGachaSimulator;
