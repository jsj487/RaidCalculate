export const RaidValues: Record<
  string, // 카테고리 이름 (예: 카제로스 레이드)
  Record<
    string, // 레이드 이름 (예: 카제로스 아브렐슈드)
    Record<
      string, // 난이도 (하드, 노말)
      {
        minItemLevel: number; // 최소 아이템 레벨
        phases: Array<{ clearGold: number; bonusGold: number }>; // 각 관문에 대한 보상
      }
    >
  >
> = {
  // 카제로스 레이드
  "카제로스 레이드": {
    "2막: 아브렐슈드": {
      하드: {
        minItemLevel: 1690,
        phases: [
          { clearGold: 10000, bonusGold: 5500 },
          { clearGold: 20500, bonusGold: 13300 },
        ],
      },
      노말: {
        minItemLevel: 1670,
        phases: [
          { clearGold: 8500, bonusGold: 4700 },
          { clearGold: 16500, bonusGold: 11300 },
        ],
      },
    },
    "1막: 에기르": {
      하드: {
        minItemLevel: 1680,
        phases: [
          { clearGold: 9000, bonusGold: 4900 },
          { clearGold: 18500, bonusGold: 11900 },
        ],
      },
      노말: {
        minItemLevel: 1660,
        phases: [
          { clearGold: 7500, bonusGold: 4300 },
          { clearGold: 15500, bonusGold: 10200 },
        ],
      },
    },
    "서막: 에키드나": {
      하드: {
        minItemLevel: 1640,
        phases: [
          { clearGold: 6000, bonusGold: 3200 },
          { clearGold: 12500, bonusGold: 8400 },
        ],
      },
      노말: {
        minItemLevel: 1620,
        phases: [
          { clearGold: 5000, bonusGold: 2800 },
          { clearGold: 9500, bonusGold: 6100 },
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
          { clearGold: 6000, bonusGold: 2200 },
          { clearGold: 12500, bonusGold: 4100 },
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
          { clearGold: 3500, bonusGold: 1100 },
          { clearGold: 4500, bonusGold: 1500 },
          { clearGold: 7500, bonusGold: 2400 },
          { clearGold: 8000, bonusGold: 2400 },
        ],
      },
      노말: {
        minItemLevel: 1610,
        phases: [
          { clearGold: 2500, bonusGold: 800 },
          { clearGold: 3000, bonusGold: 1000 },
          { clearGold: 4500, bonusGold: 1500 },
        ],
      },
    },
    일리아칸: {
      하드: {
        minItemLevel: 1600,
        phases: [
          { clearGold: 1500, bonusGold: 600 },
          { clearGold: 2500, bonusGold: 700 },
          { clearGold: 3500, bonusGold: 950 },
        ],
      },
      노말: {
        minItemLevel: 1580,
        phases: [
          { clearGold: 1000, bonusGold: 450 },
          { clearGold: 1800, bonusGold: 550 },
          { clearGold: 2600, bonusGold: 750 },
        ],
      },
    },
    "군단장 아브렐슈드": {
      하드: {
        minItemLevel: 1540,
        phases: [
          { clearGold: 1200, bonusGold: 400 },
          { clearGold: 1200, bonusGold: 400 },
          { clearGold: 1200, bonusGold: 500 },
          { clearGold: 2000, bonusGold: 800 },
        ],
      },
      노말: {
        minItemLevel: 1490,
        phases: [
          { clearGold: 1000, bonusGold: 250 },
          { clearGold: 1000, bonusGold: 300 },
          { clearGold: 1000, bonusGold: 400 },
          { clearGold: 1600, bonusGold: 600 },
        ],
      },
    },
    쿠크세이튼: {
      노말: {
        minItemLevel: 1475,
        phases: [
          { clearGold: 600, bonusGold: 300 },
          { clearGold: 900, bonusGold: 500 },
          { clearGold: 1500, bonusGold: 700 },
        ],
      },
    },
    비아키스: {
      하드: {
        minItemLevel: 1460,
        phases: [
          { clearGold: 900, bonusGold: 500 },
          { clearGold: 1500, bonusGold: 650 },
        ],
      },
      노말: {
        minItemLevel: 1430,
        phases: [
          { clearGold: 600, bonusGold: 300 },
          { clearGold: 1000, bonusGold: 450 },
        ],
      },
    },
    발탄: {
      하드: {
        minItemLevel: 1445,
        phases: [
          { clearGold: 700, bonusGold: 450 },
          { clearGold: 1100, bonusGold: 600 },
        ],
      },
      노말: {
        minItemLevel: 1415,
        phases: [
          { clearGold: 500, bonusGold: 300 },
          { clearGold: 700, bonusGold: 400 },
        ],
      },
    },
  },
  // 어비스 레이드
  "어비스 레이드": {
    "혼돈의 상아탑": {
      하드: {
        minItemLevel: 1620,
        phases: [
          { clearGold: 2000, bonusGold: 650 },
          { clearGold: 3000, bonusGold: 1000 },
          { clearGold: 5500, bonusGold: 1800 },
        ],
      },
      노말: {
        minItemLevel: 1600,
        phases: [
          { clearGold: 1500, bonusGold: 600 },
          { clearGold: 2000, bonusGold: 650 },
          { clearGold: 3000, bonusGold: 1000 },
        ],
      },
    },
    카양겔: {
      하드: {
        minItemLevel: 1580,
        phases: [
          { clearGold: 1000, bonusGold: 350 },
          { clearGold: 1600, bonusGold: 500 },
          { clearGold: 2200, bonusGold: 700 },
        ],
      },
      노말: {
        minItemLevel: 1540,
        phases: [
          { clearGold: 800, bonusGold: 300 },
          { clearGold: 1200, bonusGold: 400 },
          { clearGold: 1600, bonusGold: 500 },
        ],
      },
    },
  },

  "싱글 레이드": {
    에키드나: {
      싱글: {
        minItemLevel: 1620,
        phases: [
          { clearGold: 4000, bonusGold: 800 },
          { clearGold: 7600, bonusGold: 1650 },
        ],
      },
    },
    카멘: {
      싱글: {
        minItemLevel: 1610,
        phases: [
          { clearGold: 2000, bonusGold: 650 },
          { clearGold: 2400, bonusGold: 800 },
          { clearGold: 3600, bonusGold: 1300 },
        ],
      },
    },
    "혼돈의 상아탑": {
      싱글: {
        minItemLevel: 1600,
        phases: [
          { clearGold: 1200, bonusGold: 250 },
          { clearGold: 1600, bonusGold: 350 },
          { clearGold: 2400, bonusGold: 550 },
        ],
      },
    },
    일리아칸: {
      싱글: {
        minItemLevel: 1580,
        phases: [
          { clearGold: 800, bonusGold: 225 },
          { clearGold: 1440, bonusGold: 275 },
          { clearGold: 2080, bonusGold: 375 },
        ],
      },
    },
    카양겔: {
      싱글: {
        minItemLevel: 1580,
        phases: [
          { clearGold: 640, bonusGold: 200 },
          { clearGold: 960, bonusGold: 250 },
          { clearGold: 1280, bonusGold: 300 },
        ],
      },
    },
    아브렐슈드: {
      싱글: {
        minItemLevel: 1490,
        phases: [
          { clearGold: 800, bonusGold: 100 },
          { clearGold: 800, bonusGold: 150 },
          { clearGold: 800, bonusGold: 200 },
          { clearGold: 1280, bonusGold: 450 },
        ],
      },
    },
    쿠크세이튼: {
      싱글: {
        minItemLevel: 1475,
        phases: [
          { clearGold: 480, bonusGold: 100 },
          { clearGold: 720, bonusGold: 150 },
          { clearGold: 1200, bonusGold: 200 },
        ],
      },
    },
    비아키스: {
      싱글: {
        minItemLevel: 1430,
        phases: [
          { clearGold: 480, bonusGold: 100 },
          { clearGold: 800, bonusGold: 150 },
        ],
      },
    },
    발탄: {
      싱글: {
        minItemLevel: 1415,
        phases: [
          { clearGold: 400, bonusGold: 75 },
          { clearGold: 560, bonusGold: 100 },
        ],
      },
    },
  },
};
