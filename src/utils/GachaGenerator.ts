import { AllOptions } from "./BaraceletOptions";

type BraceletOptionResult = {
  category: string;
  name: string;
  value: string;
  grade?: string;
};

// 공통 확률 선택 함수
const pickByProbability = <T extends { probability: number }>(
  items: T[]
): T => {
  const total = items.reduce((sum, item) => sum + item.probability, 0);
  const rand = Math.random() * total;
  let cumulative = 0;
  for (const item of items) {
    cumulative += item.probability;
    if (rand < cumulative) return item;
  }
  return items[items.length - 1];
};

const categoryPool = [
  { category: "기본 효과", probability: 35.0 },
  { category: "전투 특성", probability: 35.0 },
  { category: "특수 효과", probability: 30.0 },
];

export const generateBraceletOptions = (
  selectedTypes: string[]
): BraceletOptionResult[] => {
  const result: BraceletOptionResult[] = [];
  const usedCombatStatTypes = new Set<string>();

  for (let i = 0; i < selectedTypes.length; i++) {
    // 1단계: 카테고리 선택
    const filteredCategoryPool = categoryPool.filter((c) =>
      selectedTypes.includes(c.category)
    );
    const selectedCategory = pickByProbability(filteredCategoryPool);

    // 2단계: 해당 카테고리 내 옵션 필터링
    const categoryOptions = AllOptions.filter(
      (opt) => opt.category === selectedCategory.category
    );

    if (
      selectedCategory.category === "기본 효과" ||
      selectedCategory.category === "전투 특성"
    ) {
      const typeAOptions = categoryOptions.filter(
        (opt): opt is typeof opt & { probability: number } =>
          typeof opt.probability === "number"
      );

      const stat = pickByProbability(typeAOptions);
      const range = pickByProbability(stat.values);

      if (selectedCategory.category === "전투 특성") {
        if (usedCombatStatTypes.has(stat.type)) continue;
        usedCombatStatTypes.add(stat.type);
      }

      result.push({
        category: selectedCategory.category,
        name: stat.template,
        value: range.range,
      });
    }

    if (selectedCategory.category === "특수 효과") {
      // ✅ values의 확률 총합을 기반으로 확률 보정
      const specialOptions = categoryOptions
        .filter(
          (
            opt
          ): opt is typeof opt & {
            values: { range: string[]; grade: string; probability: number }[];
          } =>
            Array.isArray(opt.values) &&
            typeof opt.values[0]?.probability === "number" &&
            Array.isArray(opt.values[0]?.range)
        )
        .map((opt) => {
          const totalProb = opt.values.reduce(
            (acc, v) => acc + v.probability,
            0
          );
          return { ...opt, probability: totalProb };
        });

      const option = pickByProbability(specialOptions);
      const tier = pickByProbability(option.values);

      result.push({
        category: selectedCategory.category,
        name: option.template,
        value: tier.range.join(" "),
        grade: tier.grade,
      });
    }
  }

  return result;
};
