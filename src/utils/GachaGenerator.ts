import { BaseEffects, CombatStats, SpecialOptions } from "./BaraceletOptions";

type FinalOption = {
  category: "기본 효과" | "전투 특성" | "특수 효과";
  name: string;
  value: string;
  grade?: string;
};

// 확률 기반 선택 함수 (타입 보존)
function pickByProbability<T extends { probability: number }>(items: T[]): T {
  const total = items.reduce((sum, item) => sum + item.probability, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const item of items) {
    acc += item.probability;
    if (r <= acc) return item;
  }
  return items[0];
}

export function generateFinalOptions(): FinalOption[] {
  const categories: {
    type: FinalOption["category"];
    probability: number;
    max: number;
  }[] = [
    { type: "기본 효과", probability: 35, max: 2 },
    { type: "전투 특성", probability: 35, max: 2 },
    { type: "특수 효과", probability: 30, max: 5 },
  ];

  const selectedTypes: FinalOption["category"][] = [];
  const counts: Record<FinalOption["category"], number> = {
    "기본 효과": 0,
    "전투 특성": 0,
    "특수 효과": 0,
  };

  while (selectedTypes.length < 3) {
    const pool = categories.filter((c) => counts[c.type] < c.max);

    // 남은 pool의 확률 재계산
    const total = pool.reduce((acc, cur) => acc + cur.probability, 0);
    const normalizedPool = pool.map((c) => ({
      ...c,
      probability: (c.probability / total) * 100,
    }));

    const picked = pickByProbability(normalizedPool);
    counts[picked.type]++;
    selectedTypes.push(picked.type);
  }

  const result: FinalOption[] = [];
  const usedCombatStatTypes = new Set<string>();

  for (const category of selectedTypes) {
    if (category === "기본 효과") {
      const stat = pickByProbability(BaseEffects);
      const range = pickByProbability(stat.values);
      result.push({
        category,
        name: stat.type,
        value: range.range,
      });
    } else if (category === "전투 특성") {
      let stat;
      let tryCount = 0;

      do {
        stat = pickByProbability(CombatStats);
        tryCount++;
      } while (usedCombatStatTypes.has(stat.type) && tryCount < 10);

      if (usedCombatStatTypes.has(stat.type)) continue; // 실패 시 무시
      usedCombatStatTypes.add(stat.type);

      const range = pickByProbability(stat.values);

      result.push({
        category,
        name: stat.type,
        value: range.range,
      });
    } else if (category === "특수 효과") {
      const option =
        SpecialOptions[Math.floor(Math.random() * SpecialOptions.length)];
      const tier = pickByProbability(option.tiers);
      result.push({
        category,
        name: option.template,
        value: tier.value.join(" "),
        grade: tier.grade,
      });
    }
  }

  return result;
}
