// CraftRecipes.ts
export interface RecipeDefinition {
  id: string;
  name: string; // 예: 아비도스 융화 재료
  fee: number; // 기본 수수료
  outputCount: number; // 10개 생산
  types: string[]; // 생활 콘텐츠 종류
}

export const CraftRecipes: RecipeDefinition[] = [
  {
    id: "abyssoos", // 내부 식별자
    name: "아비도스 융화 재료",
    fee: 400,
    outputCount: 10,
    types: ["식물채집", "고고학", "벌목", "채광", "낚시", "수렵"],
  },
  {
    id: "oreha",
    name: "오레하 융화 재료",
    fee: 600,
    outputCount: 10,
    types: ["채광", "벌목", "수렵"],
  },
];
