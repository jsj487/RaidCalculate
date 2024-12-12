const RaidValues: Record<
  string,
  Record<
    string, // 난이도 (하드, 노말 등)
    {
      minItemLevel: number; // 최소 아이템 레벨
      phases: Array<{ clearGold: number; bonusGold: number }>; // 각 관문에 대한 골드 정보
    }
  >
> = {
  // 카제로스 레이드
  "카제로스 아브렐슈드": {
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
        { clearGold: 8500, bonusGold: 4700 }, // 1관문
        { clearGold: 16500, bonusGold: 11300 }, // 2관문
      ],
    },
  },
  에기르: {
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
  에키드나: {
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
  // 에픽 레이드
  베히모스: {
    노말: {
      minItemLevel: 1640,
      phases: [
        { clearGold: 7000, bonusGold: 3900 },
        { clearGold: 14500, bonusGold: 9600 },
      ],
    },
  },
  // 군단장 레이드
  카멘: {
    하드: {
      minItemLevel: 1630,
      phases: [
        { clearGold: 5000, bonusGold: 3000 },
        { clearGold: 6000, bonusGold: 3600 },
        { clearGold: 9000, bonusGold: 6200 },
        { clearGold: 21000, bonusGold: 17400 },
      ],
    },
    노말: {
      minItemLevel: 1610,
      phases: [
        { clearGold: 3500, bonusGold: 2000 },
        { clearGold: 4000, bonusGold: 2200 },
        { clearGold: 5500, bonusGold: 3000 },
      ],
    },
  },
  일리아칸: {
    하드: {
      minItemLevel: 1600,
      phases: [
        { clearGold: 1500, bonusGold: 900 },
        { clearGold: 2500, bonusGold: 1800 },
        { clearGold: 3500, bonusGold: 2550 },
      ],
    },
    노말: {
      minItemLevel: 1580,
      phases: [
        { clearGold: 1000, bonusGold: 550 },
        { clearGold: 1800, bonusGold: 1250 },
        { clearGold: 2600, bonusGold: 1850 },
      ],
    },
  },
  "군단장 아브렐슈드": {
    하드: {
      minItemLevel: 1540,
      phases: [
        { clearGold: 1200, bonusGold: 800 },
        { clearGold: 1200, bonusGold: 800 },
        { clearGold: 1200, bonusGold: 1100 },
        { clearGold: 2000, bonusGold: 1200 },
      ],
    },
    노말: {
      minItemLevel: 1490,
      phases: [
        { clearGold: 1000, bonusGold: 750 },
        { clearGold: 1000, bonusGold: 700 },
        { clearGold: 1000, bonusGold: 600 },
        { clearGold: 1600, bonusGold: 1000 },
      ],
    },
  },
  쿠크세이튼: {
    노말: {
      minItemLevel: 1475,
      phases: [
        { clearGold: 600, bonusGold: 300 },
        { clearGold: 900, bonusGold: 400 },
        { clearGold: 1500, bonusGold: 800 },
      ],
    },
  },
  비아키스: {
    하드: {
      minItemLevel: 1460,
      phases: [
        { clearGold: 900, bonusGold: 400 },
        { clearGold: 1500, bonusGold: 850 },
      ],
    },
    노말: {
      minItemLevel: 1430,
      phases: [
        { clearGold: 600, bonusGold: 300 },
        { clearGold: 1000, bonusGold: 550 },
      ],
    },
  },
  발탄: {
    하드: {
      minItemLevel: 1445,
      phases: [
        { clearGold: 700, bonusGold: 250 },
        { clearGold: 1100, bonusGold: 500 },
      ],
    },
    노말: {
      minItemLevel: 1415,
      phases: [
        { clearGold: 500, bonusGold: 200 },
        { clearGold: 700, bonusGold: 300 },
      ],
    },
  },
  // 어비스 던전
  "혼돈의 상아탑": {
    하드: {
      minItemLevel: 1620,
      phases: [
        { clearGold: 3000, bonusGold: 1800 },
        { clearGold: 4000, bonusGold: 2550 },
        { clearGold: 6000, bonusGold: 4000 },
      ],
    },
    노말: {
      minItemLevel: 1600,
      phases: [
        { clearGold: 1500, bonusGold: 900 },
        { clearGold: 2000, bonusGold: 1350 },
        { clearGold: 3000, bonusGold: 2000 },
      ],
    },
  },
  카양겔: {
    하드: {
      minItemLevel: 1580,
      phases: [
        { clearGold: 1000, bonusGold: 650 },
        { clearGold: 1600, bonusGold: 1100 },
        { clearGold: 2200, bonusGold: 1500 },
      ],
    },
    노말: {
      minItemLevel: 1540,
      phases: [
        { clearGold: 800, bonusGold: 500 },
        { clearGold: 1200, bonusGold: 800 },
        { clearGold: 1600, bonusGold: 1100 },
      ],
    },
  },
};

export default RaidValues;
