import React, { useState } from "react";
import styled from "styled-components";
import { SpecialOptions } from "../utils/SpecialOptions";

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

type OptionTier = {
  value: string[]; // ✅ value 배열로 바뀜
  grade: string;
  probability: number;
};

type Option = {
  template: string;
  tiers: OptionTier[];
};

const fixedOptions = ["힘 +10368"];

function pickTier(tiers: OptionTier[]) {
  const total = tiers.reduce((acc, t) => acc + t.probability, 0);
  const r = Math.random() * total;
  let sum = 0;
  for (const tier of tiers) {
    sum += tier.probability;
    if (r <= sum) return tier;
  }
  return tiers[0];
}

function parseTemplate(template: string, values: string[], grade: string) {
  const parts: (string | { value: string; grade: string })[] = [];
  const valueRegex = /VALUE\d*/g;
  let lastIndex = 0;
  let match;
  let index = 0;

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

function generateOptions(options: Option[], count: number) {
  const result: { parts: (string | { value: string; grade: string })[] }[] = [];
  const pool = [...options];
  while (result.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    const selected = pool.splice(index, 1)[0];
    const tier = pickTier(selected.tiers);
    const parts = parseTemplate(selected.template, tier.value, tier.grade);
    result.push({ parts });
  }
  return result;
}

const BraceletGachaSimulator = () => {
  const [generated, setGenerated] = useState<
    { parts: (string | { value: string; grade: string })[] }[]
  >([]);

  const handleGenerate = () => {
    const rolled = generateOptions(SpecialOptions, 3);
    setGenerated(rolled);
  };

  return (
    <Container>
      <Title>팔찌 가챠 시뮬레이터</Title>
      <ResultBox>
        <OptionLine>고정 옵션: {fixedOptions[0]}</OptionLine>
        {generated.map((opt, i) => (
          <OptionLine key={i}>
            {opt.parts.map((part, j) =>
              typeof part === "string" ? (
                <span key={j}>{part}</span>
              ) : (
                <ValueSpan key={j} grade={part.grade}>
                  {part.value}
                </ValueSpan>
              )
            )}
          </OptionLine>
        ))}
      </ResultBox>
      <Button onClick={handleGenerate}>뽑기</Button>
    </Container>
  );
};

export default BraceletGachaSimulator;
