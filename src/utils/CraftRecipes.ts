export interface CraftMaterial {
  name: string;
  amount: number;
  categoryCode: number;
}

export interface CraftRecipe {
  id: string;
  name: string;
  fee: number;
  outputCount: number;
  laborCost: number;
  materials: CraftMaterial[];
}

export const CraftRecipes: CraftRecipe[] = [
  //아비도스 융화 재료
  {
    id: "abyssoos_flower",
    name: "아비도스 융화 재료 (식물채집) X10",
    fee: 400,
    outputCount: 10,
    laborCost: 288,
    materials: [
      { name: "들꽃", amount: 86, categoryCode: 90200 },
      { name: "수줍은 들꽃", amount: 45, categoryCode: 90200 },
      { name: "아비도스 들꽃", amount: 33, categoryCode: 90200 },
    ],
  },
  {
    id: "abyssoos_fossil",
    name: "아비도스 융화 재료 (고고학) X10",
    fee: 400,
    outputCount: 10,
    laborCost: 288,
    materials: [
      { name: "고대 유물", amount: 120, categoryCode: 90700 },
      { name: "희귀한 유물", amount: 42, categoryCode: 90700 },
      { name: "아비도스 유물", amount: 36, categoryCode: 90700 },
    ],
  },
  {
    id: "abyssoos_wood",
    name: "아비도스 융화 재료 (벌목) X10",
    fee: 400,
    outputCount: 10,
    laborCost: 288,
    materials: [
      { name: "목재", amount: 86, categoryCode: 90300 },
      { name: "부드러운 목재", amount: 45, categoryCode: 90300 },
      { name: "아비도스 목재", amount: 33, categoryCode: 90300 },
    ],
  },
  {
    id: "abyssoos_crystal",
    name: "아비도스 융화 재료 (채광) X10",
    fee: 400,
    outputCount: 10,
    laborCost: 288,
    materials: [
      { name: "목재", amount: 86, categoryCode: 90300 },
      { name: "부드러운 목재", amount: 45, categoryCode: 90300 },
      { name: "아비도스 목재", amount: 33, categoryCode: 90300 },
    ],
  },
  {
    id: "abyssoos_fish",
    name: "아비도스 융화 재료 (낚시) X10",
    fee: 400,
    outputCount: 10,
    laborCost: 288,
    materials: [
      { name: "생선", amount: 86, categoryCode: 90600 },
      { name: "붉은 살 생선", amount: 45, categoryCode: 90600 },
      { name: "아비도스 태양 잉어", amount: 33, categoryCode: 90600 },
    ],
  },
  {
    id: "abyssoos_meet",
    name: "아비도스 융화 재료 (수렵) X10",
    fee: 400,
    outputCount: 10,
    laborCost: 288,
    materials: [
      { name: "두툼한 생고기", amount: 86, categoryCode: 90500 },
      { name: "다듬은 생고기", amount: 45, categoryCode: 90500 },
      { name: "아비도스 두툼한 생고기", amount: 33, categoryCode: 90500 },
    ],
  },
];
