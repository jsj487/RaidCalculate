export const materialNameMap: Record<string, string> = {
  "경이로운 명예의 돌파석": "Glorious_Honor_Stone.png",
  "빛나는 지혜의 엘릭서": "Shining_Elixir_of_Wisdom.png",
  "쇠락의 눈동자": "Decaying_Eye.png",
  "광기의 나팔": "Madness_Horn.png",
  수호강석: "Guardian_Stone.png",
  "농축 돌파석": "Concentrated_Breakthrough_Stone.png",
  "수호석 결정": "Guardian_Stone_Crystal.png",
  "순환 돌파석": "Cycling_Breakthrough_Stone.png",
  "시련의 빛": "Light_of_Trial.png",
  "심화 돌파석": "Advanced_Breakthrough_Stone.png",
  "아그리스의 비늘": "Agrise_Scale.png",
  "알키오네의 눈": "Eye_of_Alcyone.png",
  "어둠의 불": "Fire_of_Darkness.png",
  "업화의 쐐기돌": "Searing_Spike.png",
  "욕망의 날개": "Wings_of_Desire.png",
  "운명의 돌": "Stone_of_Fate.png",
  "마수의 뼈": "Beast_Bone.png",
  "운명의 돌파석": "Breakstone_of_Fate.png",
  "운명의 수호석": "Guardian_Stone_of_Fate.png",
  "운명의 파괴석": "Destruction_Stone_of_Fate.png",
  "관조의 빛무리": "Contemplation_Light.png",
  "빛나는 지혜의 기운": "Radiant_Energy.png",
  "운명의 파편": "Fragment_of_Fate.png",
  "명예의 파편": "Honor_Fragment.png",
  "위대한 명예의 돌파석": "Great_Honor_Breakstone.png",
  "정제된 수호강석": "Refined_Guardian_Stone.png",
  "정제된 파괴강석": "Refined_Destruction_Stone.png",
  "찬란한 명예의 돌파석": "Radiant_Breakthrough_Stone_of_Honor.png",
  "카르마의 잔영": "Shadow_of_Karma.png",
  "클리어 메달": "Clear_Medal.png",
  "융합 돌파석": "Fusion_Breakthrough_Stone.png",
  "베히모스의 비늘": "Behemoth_Scale.png",
  "몽환의 사념": "Dream_Thought.png",
  "마력의 샘물": "Mana_Spring.png",
  파괴강석: "Destruction_Stone.png",
  "파괴석 결정": "Destruction_Stone_Fragment.png",
  "혼돈의 돌": "Stone_of_Chaos.png",
};

export const getMaterialImagePath = (materialName: string): string | null => {
  const mappedName = materialNameMap[materialName];
  if (!mappedName) {
    console.warn(`Material name "${materialName}" not found in mapping.`);
    return null;
  }
  return `${process.env.PUBLIC_URL}/img/Material_Icon/${mappedName}`;
};
