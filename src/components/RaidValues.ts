type Material = {
  name: string; // 재료 이름
  quantity: number; // 재료 갯수
};

type RaidValuesType = {
  [category: string]: {
    [raidName: string]: {
      [raidLevel: string]: {
        minItemLevel: number;
        phases: Array<{
          clearGold: number;
          bonusGold: number;
          clearMaterials: Material[]; // 클리어 시 받는 재료
          bonusMaterials: Material[];
        }>;
      };
    };
  };
};

export const RaidValues: RaidValuesType = {
  // 카제로스 레이드
  "카제로스 레이드": {
    "3막: 모르둠": {
      하드: {
        minItemLevel: 1700,
        phases: [
          //하드 - 1관문
          {
            clearGold: 7000,
            bonusGold: 4300,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 440 },
              { name: "운명의 수호석", quantity: 880 },
              { name: "운명의 파편", quantity: 3400 },
              { name: "우레의 뇌옥", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 640 },
              { name: "운명의 수호석", quantity: 1280 },
              { name: "운명의 파편", quantity: 5400 },
              { name: "운명의 돌파석", quantity: 24 },
              { name: "우레의 뇌옥", quantity: 3 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 11000,
            bonusGold: 6900,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 520 },
              { name: "운명의 수호석", quantity: 1040 },
              { name: "운명의 파편", quantity: 4000 },
              { name: "우레의 뇌옥", quantity: 12 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 880 },
              { name: "운명의 수호석", quantity: 1760 },
              { name: "운명의 파편", quantity: 7600 },
              { name: "운명의 돌파석", quantity: 28 },
              { name: "우레의 뇌옥", quantity: 5 },
            ],
          },
          //하드 - 3관문
          {
            clearGold: 16000,
            bonusGold: 10200,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 640 },
              { name: "운명의 수호석", quantity: 1280 },
              { name: "운명의 파편", quantity: 5600 },
              { name: "우레의 뇌옥", quantity: 10 },
              { name: "운명의 돌", quantity: 7 },
              { name: "순환 돌파석", quantity: 15 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 1300 },
              { name: "운명의 수호석", quantity: 2600 },
              { name: "운명의 파편", quantity: 10500 },
              { name: "운명의 돌파석", quantity: 40 },
              { name: "우레의 뇌옥", quantity: 10 },
              { name: "순환 돌파석", quantity: 10 },
            ],
          },
        ],
      },
      노말: {
        minItemLevel: 1680,
        phases: [
          //하드 - 1관문
          {
            clearGold: 6000,
            bonusGold: 3600,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 320 },
              { name: "운명의 수호석", quantity: 640 },
              { name: "운명의 파편", quantity: 2600 },
              { name: "낙뢰의 뿔", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 500 },
              { name: "운명의 수호석", quantity: 1000 },
              { name: "운명의 파편", quantity: 4800 },
              { name: "운명의 돌파석", quantity: 18 },
              { name: "낙뢰의 뿔", quantity: 3 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 9500,
            bonusGold: 6300,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 400 },
              { name: "운명의 수호석", quantity: 800 },
              { name: "운명의 파편", quantity: 3000 },
              { name: "낙뢰의 뿔", quantity: 5 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 620 },
              { name: "운명의 수호석", quantity: 1240 },
              { name: "운명의 파편", quantity: 5600 },
              { name: "운명의 돌파석", quantity: 20 },
              { name: "낙뢰의 뿔", quantity: 5 },
            ],
          },
          //하드 - 3관문
          {
            clearGold: 12500,
            bonusGold: 8300,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 520 },
              { name: "운명의 수호석", quantity: 1040 },
              { name: "운명의 파편", quantity: 4200 },
              { name: "낙뢰의 뿔", quantity: 10 },
              { name: "운명의 돌", quantity: 5 },
              { name: "순환 돌파석", quantity: 11 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 840 },
              { name: "운명의 수호석", quantity: 1680 },
              { name: "운명의 파편", quantity: 7400 },
              { name: "운명의 돌파석", quantity: 26 },
              { name: "낙뢰의 뿔", quantity: 10 },
              { name: "순환 돌파석", quantity: 7 },
            ],
          },
        ],
      },
    },
    "2막: 아브렐슈드": {
      하드: {
        minItemLevel: 1690,
        phases: [
          //하드 - 1관문
          {
            clearGold: 10000,
            bonusGold: 5500,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 640 },
              { name: "운명의 수호석", quantity: 1280 },
              { name: "운명의 파편", quantity: 4600 },
              { name: "카르마의 잔영", quantity: 8 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 950 },
              { name: "운명의 수호석", quantity: 1900 },
              { name: "운명의 파편", quantity: 8000 },
              { name: "운명의 돌파석", quantity: 32 },
              { name: "카르마의 잔영", quantity: 8 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 20500,
            bonusGold: 13300,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 700 },
              { name: "운명의 수호석", quantity: 1400 },
              { name: "운명의 파편", quantity: 6000 },
              { name: "카르마의 잔영", quantity: 12 },
              { name: "운명의 돌", quantity: 6 },
              { name: "순환 돌파석", quantity: 13 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 1400 },
              { name: "운명의 수호석", quantity: 2800 },
              { name: "운명의 파편", quantity: 14000 },
              { name: "운명의 돌파석", quantity: 48 },
              { name: "카르마의 잔영", quantity: 12 },
              { name: "순환 돌파석", quantity: 9 },
            ],
          },
        ],
      },
      노말: {
        minItemLevel: 1670,
        phases: [
          //노말 - 1관문
          {
            clearGold: 8500,
            bonusGold: 4700,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 540 },
              { name: "운명의 수호석", quantity: 1080 },
              { name: "운명의 파편", quantity: 4000 },
              { name: "카르마의 잔영", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 800 },
              { name: "운명의 수호석", quantity: 1600 },
              { name: "운명의 파편", quantity: 7000 },
              { name: "운명의 돌파석", quantity: 18 },
              { name: "카르마의 잔영", quantity: 4 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 16500,
            bonusGold: 11300,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 640 },
              { name: "운명의 수호석", quantity: 1280 },
              { name: "운명의 파편", quantity: 4600 },
              { name: "카르마의 잔영", quantity: 6 },
              { name: "운명의 돌", quantity: 4 },
              { name: "순환 돌파석", quantity: 11 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 1050 },
              { name: "운명의 수호석", quantity: 2100 },
              { name: "운명의 파편", quantity: 10500 },
              { name: "운명의 돌파석", quantity: 30 },
              { name: "카르마의 잔영", quantity: 6 },
              { name: "순환 돌파석", quantity: 7 },
            ],
          },
        ],
      },
    },
    "1막: 에기르": {
      하드: {
        minItemLevel: 1680,
        phases: [
          //하드 - 1관문
          {
            clearGold: 9000,
            bonusGold: 4900,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 680 },
              { name: "운명의 수호석", quantity: 1320 },
              { name: "운명의 파편", quantity: 4200 },
              { name: "업화의 쐐기돌", quantity: 8 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 850 },
              { name: "운명의 수호석", quantity: 1700 },
              { name: "운명의 파편", quantity: 7500 },
              { name: "운명의 돌파석", quantity: 28 },
              { name: "업화의 쐐기돌", quantity: 8 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 18500,
            bonusGold: 11900,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 660 },
              { name: "운명의 수호석", quantity: 1320 },
              { name: "운명의 파편", quantity: 5400 },
              { name: "업화의 쐐기돌", quantity: 12 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 1150 },
              { name: "운명의 수호석", quantity: 2300 },
              { name: "운명의 파편", quantity: 11000 },
              { name: "운명의 돌파석", quantity: 38 },
              { name: "업화의 쐐기돌", quantity: 12 },
            ],
          },
        ],
      },
      노말: {
        minItemLevel: 1660,
        phases: [
          //노말 - 1관문
          {
            clearGold: 7500,
            bonusGold: 4300,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 480 },
              { name: "운명의 수호석", quantity: 960 },
              { name: "운명의 파편", quantity: 3600 },
              { name: "업화의 쐐기돌", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 700 },
              { name: "운명의 수호석", quantity: 1400 },
              { name: "운명의 파편", quantity: 6500 },
              { name: "운명의 돌파석", quantity: 16 },
              { name: "업화의 쐐기돌", quantity: 4 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 15500,
            bonusGold: 10200,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 580 },
              { name: "운명의 수호석", quantity: 1160 },
              { name: "운명의 파편", quantity: 4400 },
              { name: "업화의 쐐기돌", quantity: 6 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 1000 },
              { name: "운명의 수호석", quantity: 2000 },
              { name: "운명의 파편", quantity: 9500 },
              { name: "운명의 돌파석", quantity: 28 },
              { name: "업화의 쐐기돌", quantity: 6 },
            ],
          },
        ],
      },
    },
    "서막: 에키드나": {
      하드: {
        minItemLevel: 1640,
        phases: [
          //하드 - 1관문
          {
            clearGold: 6000,
            bonusGold: 3200,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 200 },
              { name: "운명의 수호석", quantity: 400 },
              { name: "운명의 파편", quantity: 2700 },
              { name: "알키오네의 눈", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 550 },
              { name: "운명의 수호석", quantity: 1100 },
              { name: "운명의 파편", quantity: 3800 },
              { name: "운명의 돌파석", quantity: 12 },
              { name: "알키오네의 눈", quantity: 3 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 12500,
            bonusGold: 8400,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 260 },
              { name: "운명의 수호석", quantity: 520 },
              { name: "운명의 파편", quantity: 3800 },
              { name: "알키오네의 눈", quantity: 6 },
              { name: "순환 돌파석", quantity: 7 },
              { name: "혼돈의 돌", quantity: 7 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 850 },
              { name: "운명의 수호석", quantity: 1700 },
              { name: "운명의 파편", quantity: 5800 },
              { name: "운명의 돌파석", quantity: 19 },
              { name: "알키오네의 눈", quantity: 6 },
              { name: "순환 돌파석", quantity: 6 },
            ],
          },
        ],
      },
      노말: {
        minItemLevel: 1620,
        phases: [
          //노말 - 1관문
          {
            clearGold: 5000,
            bonusGold: 2800,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 160 },
              { name: "정제된 수호강석", quantity: 320 },
              { name: "명예의 파편", quantity: 3600 },
              { name: "아그리스의 비늘", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 450 },
              { name: "정제된 수호강석", quantity: 900 },
              { name: "명예의 파편", quantity: 6500 },
              { name: "찬란한 명예의 돌파석", quantity: 16 },
              { name: "아그리스의 비늘", quantity: 3 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 9500,
            bonusGold: 6100,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 220 },
              { name: "정제된 수호강석", quantity: 440 },
              { name: "명예의 파편", quantity: 4200 },
              { name: "아그리스의 비늘", quantity: 6 },
              { name: "농축 돌파석", quantity: 7 },
              { name: "혼돈의 돌", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 800 },
              { name: "정제된 수호강석", quantity: 1600 },
              { name: "명예의 파편", quantity: 9500 },
              { name: "찬란한 명예의 돌파석", quantity: 28 },
              { name: "아그리스의 비늘", quantity: 6 },
              { name: "농축 돌파석", quantity: 5 },
            ],
          },
        ],
      },
    },
  },
  // 에픽 레이드
  "에픽 레이드": {
    베히모스: {
      노말: {
        minItemLevel: 1640,
        phases: [
          //노말 - 1관문
          {
            clearGold: 6000,
            bonusGold: 3800,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 210 },
              { name: "운명의 수호석", quantity: 420 },
              { name: "운명의 파편", quantity: 3000 },
              { name: "베히모스의 비늘", quantity: 10 },
              { name: "마력의 샘물", quantity: 10 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 600 },
              { name: "운명의 수호석", quantity: 800 },
              { name: "운명의 파편", quantity: 4000 },
              { name: "베히모스의 비늘", quantity: 10 },
              { name: "마력의 샘물", quantity: 10 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 12500,
            bonusGold: 8400,
            clearMaterials: [
              { name: "운명의 파괴석", quantity: 270 },
              { name: "운명의 수호석", quantity: 540 },
              { name: "운명의 파편", quantity: 4000 },
              { name: "베히모스의 비늘", quantity: 20 },
              { name: "마력의 샘물", quantity: 18 },
              { name: "순환 돌파석", quantity: 9 },
              { name: "혼돈의 돌", quantity: 10 },
            ],
            bonusMaterials: [
              { name: "운명의 파괴석", quantity: 900 },
              { name: "운명의 수호석", quantity: 1800 },
              { name: "운명의 파편", quantity: 6000 },
              { name: "운명의 돌파석", quantity: 21 },
              { name: "베히모스의 비늘", quantity: 20 },
              { name: "마력의 샘물", quantity: 18 },
              { name: "순환 돌파석", quantity: 7 },
            ],
          },
        ],
      },
    },
  },
  // 군단장 레이드
  "군단장 레이드": {
    카멘: {
      하드: {
        minItemLevel: 1630,
        phases: [
          //하드 - 1관문
          {
            clearGold: 3500,
            bonusGold: 2400,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 150 },
              { name: "정제된 수호강석", quantity: 300 },
              { name: "명예의 파편", quantity: 2400 },
              { name: "어둠의 불", quantity: 12 },
              { name: "마력의 샘물", quantity: 6 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 500 },
              { name: "정제된 수호강석", quantity: 1000 },
              { name: "명예의 파편", quantity: 5000 },
              { name: "찬란한 명예의 돌파석", quantity: 15 },
              { name: "어둠의 불", quantity: 12 },
              { name: "마력의 샘물", quantity: 6 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 4500,
            bonusGold: 3000,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 200 },
              { name: "정제된 수호강석", quantity: 400 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "어둠의 불", quantity: 16 },
              { name: "마력의 샘물", quantity: 9 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 600 },
              { name: "정제된 수호강석", quantity: 1200 },
              { name: "명예의 파편", quantity: 6000 },
              { name: "찬란한 명예의 돌파석", quantity: 21 },
              { name: "어둠의 불", quantity: 16 },
              { name: "마력의 샘물", quantity: 9 },
            ],
          },
          //하드 - 3관문
          {
            clearGold: 7500,
            bonusGold: 5100,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 240 },
              { name: "정제된 수호강석", quantity: 480 },
              { name: "명예의 파편", quantity: 3600 },
              { name: "어둠의 불", quantity: 24 },
              { name: "마력의 샘물", quantity: 12 },
              { name: "농축 돌파석", quantity: 9 },
              { name: "혼돈의 돌", quantity: 7 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 700 },
              { name: "정제된 수호강석", quantity: 1400 },
              { name: "명예의 파편", quantity: 7500 },
              { name: "찬란한 명예의 돌파석", quantity: 27 },
              { name: "어둠의 불", quantity: 24 },
              { name: "마력의 샘물", quantity: 12 },
              { name: "농축 돌파석", quantity: 5 },
            ],
          },
          //하드 - 4관문
          {
            clearGold: 8000,
            bonusGold: 5600,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 300 },
              { name: "정제된 수호강석", quantity: 600 },
              { name: "명예의 파편", quantity: 4500 },
              { name: "어둠의 불", quantity: 24 },
              { name: "마력의 샘물", quantity: 12 },
              { name: "농축 돌파석", quantity: 12 },
              { name: "혼돈의 돌", quantity: 10 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 850 },
              { name: "정제된 수호강석", quantity: 1700 },
              { name: "명예의 파편", quantity: 9000 },
              { name: "찬란한 명예의 돌파석", quantity: 34 },
              { name: "어둠의 불", quantity: 24 },
              { name: "마력의 샘물", quantity: 12 },
              { name: "농축 돌파석", quantity: 7 },
            ],
          },
        ],
      },
      노말: {
        minItemLevel: 1610,
        phases: [
          //노말 - 1관문
          {
            clearGold: 2500,
            bonusGold: 1700,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 100 },
              { name: "정제된 수호강석", quantity: 200 },
              { name: "명예의 파편", quantity: 2000 },
              { name: "어둠의 불", quantity: 6 },
              { name: "마력의 샘물", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 380 },
              { name: "정제된 수호강석", quantity: 760 },
              { name: "명예의 파편", quantity: 3500 },
              { name: "찬란한 명예의 돌파석", quantity: 13 },
              { name: "어둠의 불", quantity: 6 },
              { name: "마력의 샘물", quantity: 2 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 3000,
            bonusGold: 2000,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 120 },
              { name: "정제된 수호강석", quantity: 240 },
              { name: "명예의 파편", quantity: 2500 },
              { name: "어둠의 불", quantity: 8 },
              { name: "마력의 샘물", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 450 },
              { name: "정제된 수호강석", quantity: 900 },
              { name: "명예의 파편", quantity: 4500 },
              { name: "찬란한 명예의 돌파석", quantity: 16 },
              { name: "어둠의 불", quantity: 8 },
              { name: "마력의 샘물", quantity: 3 },
            ],
          },
          //노말 - 3관문
          {
            clearGold: 4500,
            bonusGold: 3000,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 150 },
              { name: "정제된 수호강석", quantity: 300 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "어둠의 불", quantity: 12 },
              { name: "마력의 샘물", quantity: 4 },
              { name: "농축 돌파석", quantity: 5 },
              { name: "혼돈의 돌", quantity: 5 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 600 },
              { name: "정제된 수호강석", quantity: 1200 },
              { name: "명예의 파편", quantity: 6000 },
              { name: "찬란한 명예의 돌파석", quantity: 20 },
              { name: "어둠의 불", quantity: 12 },
              { name: "마력의 샘물", quantity: 4 },
              { name: "농축 돌파석", quantity: 3 },
            ],
          },
        ],
      },
    },
    일리아칸: {
      하드: {
        minItemLevel: 1600,
        phases: [
          //하드 - 1관문
          {
            clearGold: 1500,
            bonusGold: 900,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 180 },
              { name: "정제된 수호강석", quantity: 360 },
              { name: "명예의 파편", quantity: 2400 },
              { name: "쇠락의 눈동자", quantity: 7 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 200 },
              { name: "정제된 수호강석", quantity: 400 },
              { name: "명예의 파편", quantity: 4000 },
              { name: "찬란한 명예의 돌파석", quantity: 9 },
              { name: "쇠락의 눈동자", quantity: 7 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 2500,
            bonusGold: 1800,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 200 },
              { name: "정제된 수호강석", quantity: 400 },
              { name: "명예의 파편", quantity: 2400 },
              { name: "쇠락의 눈동자", quantity: 7 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 240 },
              { name: "정제된 수호강석", quantity: 480 },
              { name: "명예의 파편", quantity: 4000 },
              { name: "찬란한 명예의 돌파석", quantity: 12 },
              { name: "쇠락의 눈동자", quantity: 7 },
            ],
          },
          //하드 - 3관문
          {
            clearGold: 3500,
            bonusGold: 2550,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 280 },
              { name: "정제된 수호강석", quantity: 560 },
              { name: "명예의 파편", quantity: 4000 },
              { name: "쇠락의 눈동자", quantity: 8 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 360 },
              { name: "정제된 수호강석", quantity: 720 },
              { name: "명예의 파편", quantity: 5500 },
              { name: "찬란한 명예의 돌파석", quantity: 18 },
              { name: "쇠락의 눈동자", quantity: 8 },
            ],
          },
        ],
      },
      노말: {
        minItemLevel: 1580,
        phases: [
          //노말 - 1관문
          {
            clearGold: 1000,
            bonusGold: 550,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 120 },
              { name: "정제된 수호강석", quantity: 240 },
              { name: "명예의 파편", quantity: 1200 },
              { name: "쇠락의 눈동자", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 120 },
              { name: "정제된 수호강석", quantity: 240 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "찬란한 명예의 돌파석", quantity: 6 },
              { name: "쇠락의 눈동자", quantity: 3 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 1800,
            bonusGold: 1250,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 160 },
              { name: "정제된 수호강석", quantity: 320 },
              { name: "명예의 파편", quantity: 1600 },
              { name: "쇠락의 눈동자", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 160 },
              { name: "정제된 수호강석", quantity: 320 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "찬란한 명예의 돌파석", quantity: 8 },
              { name: "쇠락의 눈동자", quantity: 3 },
            ],
          },
          //노말 - 3관문
          {
            clearGold: 2600,
            bonusGold: 1850,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 240 },
              { name: "정제된 수호강석", quantity: 480 },
              { name: "명예의 파편", quantity: 2400 },
              { name: "쇠락의 눈동자", quantity: 5 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 240 },
              { name: "정제된 수호강석", quantity: 480 },
              { name: "명예의 파편", quantity: 4200 },
              { name: "찬란한 명예의 돌파석", quantity: 8 },
              { name: "쇠락의 눈동자", quantity: 5 },
            ],
          },
        ],
      },
    },
    "군단장 아브렐슈드": {
      하드: {
        minItemLevel: 1540,
        phases: [
          //하드 - 1관문
          {
            clearGold: 1200,
            bonusGold: 800,
            clearMaterials: [
              { name: "파괴강석", quantity: 280 },
              { name: "수호강석", quantity: 560 },
              { name: "명예의 파편", quantity: 2500 },
              { name: "몽환의 사념", quantity: 6 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 260 },
              { name: "수호강석", quantity: 520 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "경이로운 명예의 돌파석", quantity: 12 },
              { name: "몽환의 사념", quantity: 6 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 1200,
            bonusGold: 800,
            clearMaterials: [
              { name: "파괴강석", quantity: 320 },
              { name: "수호강석", quantity: 640 },
              { name: "명예의 파편", quantity: 2500 },
              { name: "몽환의 사념", quantity: 6 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 420 },
              { name: "수호강석", quantity: 840 },
              { name: "명예의 파편", quantity: 4000 },
              { name: "경이로운 명예의 돌파석", quantity: 16 },
              { name: "몽환의 사념", quantity: 6 },
            ],
          },
          //하드 - 3관문
          {
            clearGold: 1200,
            bonusGold: 700,
            clearMaterials: [
              { name: "파괴강석", quantity: 400 },
              { name: "수호강석", quantity: 800 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "몽환의 사념", quantity: 7 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 640 },
              { name: "수호강석", quantity: 1280 },
              { name: "명예의 파편", quantity: 5200 },
              { name: "경이로운 명예의 돌파석", quantity: 24 },
              { name: "몽환의 사념", quantity: 7 },
            ],
          },
          //하드 - 4관문
          {
            clearGold: 2000,
            bonusGold: 1200,
            clearMaterials: [
              { name: "파괴강석", quantity: 800 },
              { name: "수호강석", quantity: 1600 },
              { name: "명예의 파편", quantity: 6000 },
              { name: "몽환의 사념", quantity: 10 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 1000 },
              { name: "수호강석", quantity: 2000 },
              { name: "명예의 파편", quantity: 10000 },
              { name: "경이로운 명예의 돌파석", quantity: 40 },
              { name: "몽환의 사념", quantity: 10 },
            ],
          },
        ],
      },
      노말: {
        minItemLevel: 1490,
        phases: [
          //노말 - 1관문
          {
            clearGold: 1000,
            bonusGold: 750,
            clearMaterials: [
              { name: "파괴강석", quantity: 60 },
              { name: "수호강석", quantity: 120 },
              { name: "명예의 파편", quantity: 800 },
              { name: "몽환의 사념", quantity: 4 },
              { name: "클리어 메달", quantity: 150 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 120 },
              { name: "수호강석", quantity: 240 },
              { name: "명예의 파편", quantity: 2100 },
              { name: "경이로운 명예의 돌파석", quantity: 6 },
              { name: "몽환의 사념", quantity: 4 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 1000,
            bonusGold: 700,
            clearMaterials: [
              { name: "파괴강석", quantity: 60 },
              { name: "수호강석", quantity: 120 },
              { name: "명예의 파편", quantity: 800 },
              { name: "몽환의 사념", quantity: 4 },
              { name: "클리어 메달", quantity: 150 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 150 },
              { name: "수호강석", quantity: 300 },
              { name: "명예의 파편", quantity: 2400 },
              { name: "경이로운 명예의 돌파석", quantity: 9 },
              { name: "몽환의 사념", quantity: 4 },
            ],
          },
          //노말 - 3관문
          {
            clearGold: 1000,
            bonusGold: 600,
            clearMaterials: [
              { name: "파괴강석", quantity: 120 },
              { name: "수호강석", quantity: 240 },
              { name: "명예의 파편", quantity: 1500 },
              { name: "몽환의 사념", quantity: 5 },
              { name: "혼돈의 돌", quantity: 1 },
              { name: "심화 돌파석", quantity: 21 },
              { name: "클리어 메달", quantity: 150 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 200 },
              { name: "수호강석", quantity: 400 },
              { name: "명예의 파편", quantity: 2800 },
              { name: "경이로운 명예의 돌파석", quantity: 8 },
              { name: "몽환의 사념", quantity: 5 },
              { name: "심화 돌파석", quantity: 10 },
            ],
          },
          //노말 - 4관문
          {
            clearGold: 1600,
            bonusGold: 1000,
            clearMaterials: [
              { name: "파괴강석", quantity: 400 },
              { name: "수호강석", quantity: 800 },
              { name: "운명의 파편", quantity: 3000 },
              { name: "몽환의 사념", quantity: 7 },
              { name: "혼돈의 돌", quantity: 3 },
              { name: "심화 돌파석", quantity: 41 },
              { name: "클리어 메달", quantity: 250 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 600 },
              { name: "수호강석", quantity: 1200 },
              { name: "운명의 파편", quantity: 7000 },
              { name: "경이로운 명예의 돌파석", quantity: 27 },
              { name: "몽환의 사념", quantity: 7 },
              { name: "심화 돌파석", quantity: 20 },
            ],
          },
        ],
      },
    },
    쿠크세이튼: {
      노말: {
        minItemLevel: 1475,
        phases: [
          //노말 - 1관문
          {
            clearGold: 600,
            bonusGold: 300,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 200 },
              { name: "수호석 결정", quantity: 400 },
              { name: "명예의 파편", quantity: 800 },
              { name: "광기의 나팔", quantity: 1 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 300 },
              { name: "수호석 결정", quantity: 600 },
              { name: "명예의 파편", quantity: 1300 },
              { name: "위대한 명예의 돌파석", quantity: 12 },
              { name: "광기의 나팔", quantity: 1 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 900,
            bonusGold: 400,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 200 },
              { name: "수호석 결정", quantity: 400 },
              { name: "명예의 파편", quantity: 800 },
              { name: "광기의 나팔", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 420 },
              { name: "수호석 결정", quantity: 840 },
              { name: "명예의 파편", quantity: 1300 },
              { name: "위대한 명예의 돌파석", quantity: 12 },
              { name: "광기의 나팔", quantity: 2 },
            ],
          },
          //노말 - 3관문
          {
            clearGold: 1500,
            bonusGold: 800,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 280 },
              { name: "수호석 결정", quantity: 560 },
              { name: "명예의 파편", quantity: 800 },
              { name: "광기의 나팔", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 540 },
              { name: "수호석 결정", quantity: 1080 },
              { name: "명예의 파편", quantity: 1600 },
              { name: "위대한 명예의 돌파석", quantity: 12 },
              { name: "광기의 나팔", quantity: 2 },
            ],
          },
        ],
      },
    },
    비아키스: {
      하드: {
        minItemLevel: 1460,
        phases: [
          //하드 - 1관문
          {
            clearGold: 900,
            bonusGold: 400,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 240 },
              { name: "수호석 결정", quantity: 480 },
              { name: "명예의 파편", quantity: 600 },
              { name: "욕망의 날개", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 450 },
              { name: "수호석 결정", quantity: 900 },
              { name: "명예의 파편", quantity: 1600 },
              { name: "위대한 명예의 돌파석", quantity: 12 },
              { name: "욕망의 날개", quantity: 3 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 1500,
            bonusGold: 850,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 280 },
              { name: "수호석 결정", quantity: 560 },
              { name: "명예의 파편", quantity: 900 },
              { name: "욕망의 날개", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 520 },
              { name: "수호석 결정", quantity: 1040 },
              { name: "명예의 파편", quantity: 2000 },
              { name: "위대한 명예의 돌파석", quantity: 12 },
              { name: "욕망의 날개", quantity: 3 },
            ],
          },
        ],
      },
      노말: {
        minItemLevel: 1430,
        phases: [
          //노말 - 1관문
          {
            clearGold: 600,
            bonusGold: 300,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "욕망의 날개", quantity: 1 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "위대한 명예의 돌파석", quantity: 0 },
              { name: "욕망의 날개", quantity: 1 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 1000,
            bonusGold: 550,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "욕망의 날개", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "위대한 명예의 돌파석", quantity: 0 },
              { name: "욕망의 날개", quantity: 2 },
            ],
          },
        ],
      },
    },
    발탄: {
      하드: {
        minItemLevel: 1445,
        phases: [
          //하드 - 1관문
          {
            clearGold: 700,
            bonusGold: 250,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 200 },
              { name: "수호석 결정", quantity: 400 },
              { name: "명예의 파편", quantity: 500 },
              { name: "마수의 뼈", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 360 },
              { name: "수호석 결정", quantity: 720 },
              { name: "명예의 파편", quantity: 1000 },
              { name: "위대한 명예의 돌파석", quantity: 10 },
              { name: "마수의 뼈", quantity: 3 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 1100,
            bonusGold: 500,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 240 },
              { name: "수호석 결정", quantity: 480 },
              { name: "명예의 파편", quantity: 700 },
              { name: "마수의 뼈", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 480 },
              { name: "수호석 결정", quantity: 960 },
              { name: "명예의 파편", quantity: 1300 },
              { name: "위대한 명예의 돌파석", quantity: 10 },
              { name: "마수의 뼈", quantity: 3 },
            ],
          },
        ],
      },
      노말: {
        minItemLevel: 1415,
        phases: [
          //노말 - 1관문
          {
            clearGold: 500,
            bonusGold: 200,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 150 },
              { name: "수호석 결정", quantity: 300 },
              { name: "명예의 파편", quantity: 400 },
              { name: "마수의 뼈", quantity: 1 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "위대한 명예의 돌파석", quantity: 0 },
              { name: "마수의 뼈", quantity: 1 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 700,
            bonusGold: 300,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 200 },
              { name: "수호석 결정", quantity: 400 },
              { name: "명예의 파편", quantity: 600 },
              { name: "마수의 뼈", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "위대한 명예의 돌파석", quantity: 0 },
              { name: "마수의 뼈", quantity: 2 },
            ],
          },
        ],
      },
    },
  },
  // 어비스 던전
  "어비스 던전": {
    "혼돈의 상아탑": {
      하드: {
        minItemLevel: 1620,
        phases: [
          //하드 - 1관문
          {
            clearGold: 2000,
            bonusGold: 1350,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 140 },
              { name: "정제된 수호강석", quantity: 280 },
              { name: "명예의 파편", quantity: 2400 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 210 },
              { name: "정제된 수호강석", quantity: 420 },
              { name: "명예의 파편", quantity: 5500 },
              { name: "찬란한 명예의 돌파석", quantity: 4 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 3000,
            bonusGold: 2000,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 140 },
              { name: "정제된 수호강석", quantity: 280 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 210 },
              { name: "정제된 수호강석", quantity: 420 },
              { name: "명예의 파편", quantity: 5500 },
              { name: "찬란한 명예의 돌파석", quantity: 4 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
          },
          //하드 - 3관문
          {
            clearGold: 5500,
            bonusGold: 3700,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 160 },
              { name: "정제된 수호강석", quantity: 320 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "빛나는 지혜의 기운", quantity: 8 },
              { name: "빛나는 지혜의 엘릭서", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 420 },
              { name: "정제된 수호강석", quantity: 840 },
              { name: "명예의 파편", quantity: 7500 },
              { name: "찬란한 명예의 돌파석", quantity: 10 },
              { name: "빛나는 지혜의 기운", quantity: 8 },
              { name: "빛나는 지혜의 엘릭서", quantity: 2 },
            ],
          },
        ],
      },
      노말: {
        minItemLevel: 1600,
        phases: [
          //노말 - 1관문
          {
            clearGold: 1500,
            bonusGold: 900,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 100 },
              { name: "정제된 수호강석", quantity: 200 },
              { name: "명예의 파편", quantity: 2000 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 140 },
              { name: "정제된 수호강석", quantity: 280 },
              { name: "명예의 파편", quantity: 4000 },
              { name: "찬란한 명예의 돌파석", quantity: 3 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 2000,
            bonusGold: 1350,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 130 },
              { name: "정제된 수호강석", quantity: 260 },
              { name: "명예의 파편", quantity: 2500 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 140 },
              { name: "정제된 수호강석", quantity: 280 },
              { name: "명예의 파편", quantity: 4000 },
              { name: "찬란한 명예의 돌파석", quantity: 3 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
          },
          //노말 - 3관문
          {
            clearGold: 3000,
            bonusGold: 2000,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 130 },
              { name: "정제된 수호강석", quantity: 260 },
              { name: "명예의 파편", quantity: 2500 },
              { name: "빛나는 지혜의 기운", quantity: 8 },
              { name: "빛나는 지혜의 엘릭서", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 280 },
              { name: "정제된 수호강석", quantity: 560 },
              { name: "명예의 파편", quantity: 6500 },
              { name: "찬란한 명예의 돌파석", quantity: 4 },
              { name: "빛나는 지혜의 기운", quantity: 8 },
              { name: "빛나는 지혜의 엘릭서", quantity: 2 },
            ],
          },
        ],
      },
    },
    카양겔: {
      하드: {
        minItemLevel: 1580,
        phases: [
          //하드 - 1관문
          {
            clearGold: 1000,
            bonusGold: 650,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 80 },
              { name: "정제된 수호강석", quantity: 160 },
              { name: "명예의 파편", quantity: 2500 },
              { name: "시련의 빛", quantity: 14 },
              { name: "관조의 빛무리", quantity: 1 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 70 },
              { name: "정제된 수호강석", quantity: 140 },
              { name: "명예의 파편", quantity: 1500 },
              { name: "찬란한 명예의 돌파석", quantity: 3 },
              { name: "시련의 빛", quantity: 10 },
              { name: "관조의 빛무리", quantity: 1 },
            ],
          },
          //하드 - 2관문
          {
            clearGold: 1600,
            bonusGold: 1100,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 120 },
              { name: "정제된 수호강석", quantity: 240 },
              { name: "명예의 파편", quantity: 3500 },
              { name: "시련의 빛", quantity: 16 },
              { name: "관조의 빛무리", quantity: 1 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 90 },
              { name: "정제된 수호강석", quantity: 180 },
              { name: "명예의 파편", quantity: 2000 },
              { name: "찬란한 명예의 돌파석", quantity: 4 },
              { name: "시련의 빛", quantity: 16 },
              { name: "관조의 빛무리", quantity: 1 },
            ],
          },
          //하드 - 3관문
          {
            clearGold: 2200,
            bonusGold: 1500,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 150 },
              { name: "정제된 수호강석", quantity: 300 },
              { name: "명예의 파편", quantity: 5000 },
              { name: "시련의 빛", quantity: 20 },
              { name: "관조의 빛무리", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 120 },
              { name: "정제된 수호강석", quantity: 240 },
              { name: "명예의 파편", quantity: 2500 },
              { name: "찬란한 명예의 돌파석", quantity: 6 },
              { name: "시련의 빛", quantity: 20 },
              { name: "관조의 빛무리", quantity: 3 },
            ],
          },
        ],
      },
      노말: {
        minItemLevel: 1540,
        phases: [
          //노말 - 1관문
          {
            clearGold: 800,
            bonusGold: 500,
            clearMaterials: [
              { name: "파괴강석", quantity: 240 },
              { name: "수호강석", quantity: 480 },
              { name: "명예의 파편", quantity: 2000 },
              { name: "시련의 빛", quantity: 11 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 180 },
              { name: "수호강석", quantity: 360 },
              { name: "명예의 파편", quantity: 1000 },
              { name: "경이로운 명예의 돌파석", quantity: 5 },
              { name: "시련의 빛", quantity: 11 },
            ],
          },
          //노말 - 2관문
          {
            clearGold: 1200,
            bonusGold: 800,
            clearMaterials: [
              { name: "파괴강석", quantity: 280 },
              { name: "수호강석", quantity: 560 },
              { name: "명예의 파편", quantity: 2500 },
              { name: "시련의 빛", quantity: 12 },
              { name: "관조의 빛무리", quantity: 1 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 220 },
              { name: "수호강석", quantity: 440 },
              { name: "명예의 파편", quantity: 1500 },
              { name: "경이로운 명예의 돌파석", quantity: 6 },
              { name: "시련의 빛", quantity: 12 },
              { name: "관조의 빛무리", quantity: 1 },
            ],
          },
          //노말 - 3관문
          {
            clearGold: 1600,
            bonusGold: 1100,
            clearMaterials: [
              { name: "파괴강석", quantity: 360 },
              { name: "수호강석", quantity: 720 },
              { name: "명예의 파편", quantity: 4000 },
              { name: "시련의 빛", quantity: 17 },
              { name: "관조의 빛무리", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 300 },
              { name: "수호강석", quantity: 600 },
              { name: "명예의 파편", quantity: 2000 },
              { name: "경이로운 명예의 돌파석", quantity: 8 },
              { name: "시련의 빛", quantity: 17 },
              { name: "관조의 빛무리", quantity: 2 },
            ],
          },
        ],
      },
    },
  },

  "싱글 레이드": {
    에키드나: {
      싱글: {
        minItemLevel: 1620,
        phases: [
          //싱글 - 1관문
          {
            clearGold: 4000,
            bonusGold: 3200,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 240 },
              { name: "정제된 수호강석", quantity: 480 },
              { name: "명예의 파편", quantity: 5400 },
              { name: "찬란한 명예의 돌파석", quantity: 5 },
              { name: "아그리스의 비늘", quantity: 3 },
              { name: "클리어 메달", quantity: 400 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 495 },
              { name: "정제된 수호강석", quantity: 990 },
              { name: "명예의 파편", quantity: 7150 },
              { name: "찬란한 명예의 돌파석", quantity: 18 },
              { name: "아그리스의 비늘", quantity: 3 },
            ],
          },
          //싱글 - 2관문
          {
            clearGold: 7600,
            bonusGold: 5950,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 330 },
              { name: "정제된 수호강석", quantity: 660 },
              { name: "명예의 파편", quantity: 6300 },
              { name: "찬란한 명예의 돌파석", quantity: 6 },
              { name: "아그리스의 비늘", quantity: 6 },
              { name: "농축 돌파석", quantity: 7 },
              { name: "혼돈의 돌", quantity: 4 },
              { name: "클리어 메달", quantity: 550 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 880 },
              { name: "정제된 수호강석", quantity: 1760 },
              { name: "명예의 파편", quantity: 10450 },
              { name: "찬란한 명예의 돌파석", quantity: 31 },
              { name: "아그리스의 비늘", quantity: 6 },
              { name: "농축 돌파석", quantity: 5 },
            ],
          },
        ],
      },
    },
    카멘: {
      싱글: {
        minItemLevel: 1610,
        phases: [
          //싱글 - 1관문
          {
            clearGold: 2000,
            bonusGold: 1350,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 150 },
              { name: "정제된 수호강석", quantity: 300 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "찬란한 명예의 돌파석", quantity: 5 },
              { name: "어둠의 불", quantity: 6 },
              { name: "마력의 샘물", quantity: 2 },
              { name: "클리어 메달", quantity: 200 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 420 },
              { name: "정제된 수호강석", quantity: 840 },
              { name: "명예의 파편", quantity: 3850 },
              { name: "찬란한 명예의 돌파석", quantity: 15 },
              { name: "어둠의 불", quantity: 6 },
              { name: "마력의 샘물", quantity: 2 },
            ],
          },
          //싱글 - 2관문
          {
            clearGold: 2400,
            bonusGold: 1600,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 180 },
              { name: "정제된 수호강석", quantity: 360 },
              { name: "명예의 파편", quantity: 3750 },
              { name: "찬란한 명예의 돌파석", quantity: 5 },
              { name: "어둠의 불", quantity: 8 },
              { name: "마력의 샘물", quantity: 3 },
              { name: "클리어 메달", quantity: 300 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 495 },
              { name: "정제된 수호강석", quantity: 990 },
              { name: "명예의 파편", quantity: 4950 },
              { name: "찬란한 명예의 돌파석", quantity: 18 },
              { name: "어둠의 불", quantity: 8 },
              { name: "마력의 샘물", quantity: 3 },
            ],
          },
          //싱글 - 3관문
          {
            clearGold: 3600,
            bonusGold: 2300,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 225 },
              { name: "정제된 수호강석", quantity: 450 },
              { name: "명예의 파편", quantity: 4500 },
              { name: "찬란한 명예의 돌파석", quantity: 6 },
              { name: "어둠의 불", quantity: 12 },
              { name: "마력의 샘물", quantity: 4 },
              { name: "농축 돌파석", quantity: 5 },
              { name: "혼돈의 돌", quantity: 5 },
              { name: "클리어 메달", quantity: 500 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 660 },
              { name: "정제된 수호강석", quantity: 1320 },
              { name: "명예의 파편", quantity: 6600 },
              { name: "찬란한 명예의 돌파석", quantity: 22 },
              { name: "어둠의 불", quantity: 12 },
              { name: "마력의 샘물", quantity: 4 },
            ],
          },
        ],
      },
    },
    "혼돈의 상아탑": {
      싱글: {
        minItemLevel: 1600,
        phases: [
          //싱글 - 1관문
          {
            clearGold: 1200,
            bonusGold: 950,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 200 },
              { name: "정제된 수호강석", quantity: 400 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "찬란한 명예의 돌파석", quantity: 3 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 180 },
              { name: "정제된 수호강석", quantity: 360 },
              { name: "명예의 파편", quantity: 4500 },
              { name: "찬란한 명예의 돌파석", quantity: 8 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
          },
          //싱글 - 2관문
          {
            clearGold: 1600,
            bonusGold: 1250,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 200 },
              { name: "정제된 수호강석", quantity: 400 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "찬란한 명예의 돌파석", quantity: 3 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 200 },
              { name: "정제된 수호강석", quantity: 400 },
              { name: "명예의 파편", quantity: 4500 },
              { name: "찬란한 명예의 돌파석", quantity: 8 },
              { name: "빛나는 지혜의 기운", quantity: 4 },
            ],
          },
          //싱글 - 3관문
          {
            clearGold: 2400,
            bonusGold: 1850,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 260 },
              { name: "정제된 수호강석", quantity: 520 },
              { name: "명예의 파편", quantity: 4500 },
              { name: "찬란한 명예의 돌파석", quantity: 4 },
              { name: "빛나는 지혜의 기운", quantity: 8 },
              { name: "빛나는 지혜의 엘릭서", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 280 },
              { name: "정제된 수호강석", quantity: 560 },
              { name: "명예의 파편", quantity: 7500 },
              { name: "찬란한 명예의 돌파석", quantity: 16 },
              { name: "빛나는 지혜의 기운", quantity: 8 },
              { name: "빛나는 지혜의 엘릭서", quantity: 2 },
            ],
          },
        ],
      },
    },
    일리아칸: {
      싱글: {
        minItemLevel: 1580,
        phases: [
          //싱글 - 1관문
          {
            clearGold: 800,
            bonusGold: 575,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 140 },
              { name: "정제된 수호강석", quantity: 280 },
              { name: "명예의 파편", quantity: 2700 },
              { name: "찬란한 명예의 돌파석", quantity: 2 },
              { name: "쇠락의 눈동자", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 160 },
              { name: "정제된 수호강석", quantity: 320 },
              { name: "명예의 파편", quantity: 4500 },
              { name: "찬란한 명예의 돌파석", quantity: 7 },
              { name: "쇠락의 눈동자", quantity: 3 },
            ],
          },
          //싱글 - 2관문
          {
            clearGold: 1440,
            bonusGold: 1165,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 180 },
              { name: "정제된 수호강석", quantity: 360 },
              { name: "명예의 파편", quantity: 2700 },
              { name: "찬란한 명예의 돌파석", quantity: 2 },
              { name: "쇠락의 눈동자", quantity: 3 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 180 },
              { name: "정제된 수호강석", quantity: 360 },
              { name: "명예의 파편", quantity: 4500 },
              { name: "찬란한 명예의 돌파석", quantity: 88 },
              { name: "쇠락의 눈동자", quantity: 3 },
            ],
          },
          //싱글 - 3관문
          {
            clearGold: 2080,
            bonusGold: 1705,
            clearMaterials: [
              { name: "정제된 파괴강석", quantity: 260 },
              { name: "정제된 수호강석", quantity: 520 },
              { name: "명예의 파편", quantity: 4200 },
              { name: "찬란한 명예의 돌파석", quantity: 3 },
              { name: "쇠락의 눈동자", quantity: 5 },
            ],
            bonusMaterials: [
              { name: "정제된 파괴강석", quantity: 260 },
              { name: "정제된 수호강석", quantity: 520 },
              { name: "명예의 파편", quantity: 5000 },
              { name: "찬란한 명예의 돌파석", quantity: 14 },
              { name: "쇠락의 눈동자", quantity: 5 },
            ],
          },
        ],
      },
    },
    카양겔: {
      싱글: {
        minItemLevel: 1540,
        phases: [
          //싱글 - 1관문
          {
            clearGold: 640,
            bonusGold: 440,
            clearMaterials: [
              { name: "파괴강석", quantity: 260 },
              { name: "수호강석", quantity: 520 },
              { name: "명예의 파편", quantity: 2100 },
              { name: "경이로운 명예의 돌파석", quantity: 3 },
              { name: "시련의 빛", quantity: 11 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 220 },
              { name: "수호강석", quantity: 440 },
              { name: "명예의 파편", quantity: 3500 },
              { name: "경이로운 명예의 돌파석", quantity: 10 },
              { name: "시련의 빛", quantity: 11 },
            ],
          },
          //싱글 - 2관문
          {
            clearGold: 960,
            bonusGold: 735,
            clearMaterials: [
              { name: "파괴강석", quantity: 300 },
              { name: "수호강석", quantity: 600 },
              { name: "명예의 파편", quantity: 2500 },
              { name: "경이로운 명예의 돌파석", quantity: 3 },
              { name: "시련의 빛", quantity: 12 },
              { name: "관조의 빛무리", quantity: 1 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 280 },
              { name: "수호강석", quantity: 560 },
              { name: "명예의 파편", quantity: 3500 },
              { name: "경이로운 명예의 돌파석", quantity: 12 },
              { name: "시련의 빛", quantity: 12 },
              { name: "관조의 빛무리", quantity: 1 },
            ],
          },
          //싱글 - 3관문
          {
            clearGold: 1280,
            bonusGold: 980,
            clearMaterials: [
              { name: "파괴강석", quantity: 400 },
              { name: "수호강석", quantity: 800 },
              { name: "명예의 파편", quantity: 4100 },
              { name: "경이로운 명예의 돌파석", quantity: 4 },
              { name: "시련의 빛", quantity: 17 },
              { name: "관조의 빛무리", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 340 },
              { name: "수호강석", quantity: 680 },
              { name: "명예의 파편", quantity: 5500 },
              { name: "경이로운 명예의 돌파석", quantity: 16 },
              { name: "시련의 빛", quantity: 17 },
              { name: "관조의 빛무리", quantity: 2 },
            ],
          },
        ],
      },
    },
    아브렐슈드: {
      싱글: {
        minItemLevel: 1490,
        phases: [
          //싱글 - 1관문
          {
            clearGold: 800,
            bonusGold: 700,
            clearMaterials: [
              { name: "파괴강석", quantity: 120 },
              { name: "수호강석", quantity: 240 },
              { name: "명예의 파편", quantity: 1100 },
              { name: "경이로운 명예의 돌파석", quantity: 2 },
              { name: "몽환의 사념", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 120 },
              { name: "수호강석", quantity: 240 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "경이로운 명예의 돌파석", quantity: 8 },
              { name: "몽환의 사념", quantity: 4 },
            ],
          },
          //싱글 - 2관문
          {
            clearGold: 800,
            bonusGold: 650,
            clearMaterials: [
              { name: "파괴강석", quantity: 120 },
              { name: "수호강석", quantity: 240 },
              { name: "명예의 파편", quantity: 1300 },
              { name: "경이로운 명예의 돌파석", quantity: 2 },
              { name: "몽환의 사념", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 180 },
              { name: "수호강석", quantity: 360 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "경이로운 명예의 돌파석", quantity: 10 },
              { name: "몽환의 사념", quantity: 4 },
            ],
          },
          //싱글 - 3관문
          {
            clearGold: 800,
            bonusGold: 600,
            clearMaterials: [
              { name: "파괴강석", quantity: 140 },
              { name: "수호강석", quantity: 280 },
              { name: "명예의 파편", quantity: 1600 },
              { name: "경이로운 명예의 돌파석", quantity: 2 },
              { name: "몽환의 사념", quantity: 5 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 300 },
              { name: "수호강석", quantity: 600 },
              { name: "명예의 파편", quantity: 4000 },
              { name: "경이로운 명예의 돌파석", quantity: 16 },
              { name: "몽환의 사념", quantity: 5 },
            ],
          },
          //싱글 - 4관문
          {
            clearGold: 1280,
            bonusGold: 830,
            clearMaterials: [
              { name: "파괴강석", quantity: 420 },
              { name: "수호강석", quantity: 840 },
              { name: "명예의 파편", quantity: 3000 },
              { name: "경이로운 명예의 돌파석", quantity: 4 },
              { name: "몽환의 사념", quantity: 7 },
            ],
            bonusMaterials: [
              { name: "파괴강석", quantity: 600 },
              { name: "수호강석", quantity: 1200 },
              { name: "명예의 파편", quantity: 7000 },
              { name: "경이로운 명예의 돌파석", quantity: 28 },
              { name: "몽환의 사념", quantity: 7 },
            ],
          },
        ],
      },
    },
    쿠크세이튼: {
      싱글: {
        minItemLevel: 1475,
        phases: [
          //싱글 - 1관문
          {
            clearGold: 480,
            bonusGold: 380,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 200 },
              { name: "수호석 결정", quantity: 400 },
              { name: "명예의 파편", quantity: 800 },
              { name: "광기의 나팔", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "광기의 나팔", quantity: 0 },
            ],
          },
          //싱글 - 2관문
          {
            clearGold: 720,
            bonusGold: 570,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 200 },
              { name: "수호석 결정", quantity: 400 },
              { name: "명예의 파편", quantity: 800 },
              { name: "광기의 나팔", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "광기의 나팔", quantity: 0 },
            ],
          },
          //싱글 - 3관문
          {
            clearGold: 1200,
            bonusGold: 1000,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 280 },
              { name: "수호석 결정", quantity: 560 },
              { name: "명예의 파편", quantity: 800 },
              { name: "광기의 나팔", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "광기의 나팔", quantity: 0 },
            ],
          },
        ],
      },
    },
    비아키스: {
      싱글: {
        minItemLevel: 1430,
        phases: [
          //싱글 - 1관문
          {
            clearGold: 480,
            bonusGold: 380,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 150 },
              { name: "수호석 결정", quantity: 300 },
              { name: "명예의 파편", quantity: 500 },
              { name: "욕망의 날개", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "욕망의 날개", quantity: 0 },
            ],
          },
          //싱글 - 2관문
          {
            clearGold: 800,
            bonusGold: 650,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 200 },
              { name: "수호석 결정", quantity: 400 },
              { name: "명예의 파편", quantity: 700 },
              { name: "욕망의 날개", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "욕망의 날개", quantity: 0 },
            ],
          },
        ],
      },
    },
    발탄: {
      싱글: {
        minItemLevel: 1415,
        phases: [
          //싱글 - 1관문
          {
            clearGold: 400,
            bonusGold: 325,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 150 },
              { name: "수호석 결정", quantity: 300 },
              { name: "명예의 파편", quantity: 400 },
              { name: "마수의 뼈", quantity: 2 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "마수의 뼈", quantity: 0 },
            ],
          },
          //싱글 - 2관문
          {
            clearGold: 560,
            bonusGold: 460,
            clearMaterials: [
              { name: "파괴석 결정", quantity: 200 },
              { name: "수호석 결정", quantity: 400 },
              { name: "명예의 파편", quantity: 400 },
              { name: "마수의 뼈", quantity: 4 },
            ],
            bonusMaterials: [
              { name: "파괴석 결정", quantity: 0 },
              { name: "수호석 결정", quantity: 0 },
              { name: "명예의 파편", quantity: 0 },
              { name: "마수의 뼈", quantity: 0 },
            ],
          },
        ],
      },
    },
  },
};
