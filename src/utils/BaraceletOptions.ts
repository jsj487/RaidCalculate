export const BaseEffects = [
  {
    type: "힘/민첩/지능",
    probability: 50.0,
    values: [
      { range: "9600~10240", probability: 10.0 },
      { range: "10241~10880", probability: 16.0 },
      { range: "10881~11520", probability: 16.0 },
      { range: "11521~12160", probability: 16.0 },
      { range: "12161~12800", probability: 10.0 },
      { range: "12801~13440", probability: 10.0 },
      { range: "13441~14080", probability: 10.0 },
      { range: "14081~14720", probability: 4.0 },
      { range: "14721~15360", probability: 4.0 },
      { range: "15361~16000", probability: 4.0 },
    ],
  },
  {
    type: "체력",
    probability: 50.0,
    values: [
      { range: "4000~4200", probability: 10.0 },
      { range: "4201~4400", probability: 16.0 },
      { range: "4401~4600", probability: 16.0 },
      { range: "4601~4800", probability: 16.0 },
      { range: "4801~5000", probability: 10.0 },
      { range: "5001~5200", probability: 10.0 },
      { range: "5201~5400", probability: 10.0 },
      { range: "5401~5600", probability: 4.0 },
      { range: "5601~5800", probability: 4.0 },
      { range: "5801~6000", probability: 4.0 },
    ],
  },
];

export const CombatStats = [
  {
    type: "치명",
    probability: 16.6667,
    values: [
      { range: "61~66", probability: 10.0 },
      { range: "67~72", probability: 16.0 },
      { range: "73~78", probability: 16.0 },
      { range: "79~84", probability: 16.0 },
      { range: "85~90", probability: 10.0 },
      { range: "91~96", probability: 10.0 },
      { range: "97~102", probability: 10.0 },
      { range: "103~108", probability: 4.0 },
      { range: "109~114", probability: 4.0 },
      { range: "115~120", probability: 4.0 },
    ],
  },
  {
    type: "특화",
    probability: 16.6667,
    values: [
      { range: "61~66", probability: 10.0 },
      { range: "67~72", probability: 16.0 },
      { range: "73~78", probability: 16.0 },
      { range: "79~84", probability: 16.0 },
      { range: "85~90", probability: 10.0 },
      { range: "91~96", probability: 10.0 },
      { range: "97~102", probability: 10.0 },
      { range: "103~108", probability: 4.0 },
      { range: "109~114", probability: 4.0 },
      { range: "115~120", probability: 4.0 },
    ],
  },
  {
    type: "제압",
    probability: 16.6667,
    values: [
      { range: "61~66", probability: 10.0 },
      { range: "67~72", probability: 16.0 },
      { range: "73~78", probability: 16.0 },
      { range: "79~84", probability: 16.0 },
      { range: "85~90", probability: 10.0 },
      { range: "91~96", probability: 10.0 },
      { range: "97~102", probability: 10.0 },
      { range: "103~108", probability: 4.0 },
      { range: "109~114", probability: 4.0 },
      { range: "115~120", probability: 4.0 },
    ],
  },
  {
    type: "신속",
    probability: 16.6667,
    values: [
      { range: "61~66", probability: 10.0 },
      { range: "67~72", probability: 16.0 },
      { range: "73~78", probability: 16.0 },
      { range: "79~84", probability: 16.0 },
      { range: "85~90", probability: 10.0 },
      { range: "91~96", probability: 10.0 },
      { range: "97~102", probability: 10.0 },
      { range: "103~108", probability: 4.0 },
      { range: "109~114", probability: 4.0 },
      { range: "115~120", probability: 4.0 },
    ],
  },
  {
    type: "인내",
    probability: 16.6667,
    values: [
      { range: "61~66", probability: 10.0 },
      { range: "67~72", probability: 16.0 },
      { range: "73~78", probability: 16.0 },
      { range: "79~84", probability: 16.0 },
      { range: "85~90", probability: 10.0 },
      { range: "91~96", probability: 10.0 },
      { range: "97~102", probability: 10.0 },
      { range: "103~108", probability: 4.0 },
      { range: "109~114", probability: 4.0 },
      { range: "115~120", probability: 4.0 },
    ],
  },
  {
    type: "숙련",
    probability: 16.6667,
    values: [
      { range: "61~66", probability: 10.0 },
      { range: "67~72", probability: 16.0 },
      { range: "73~78", probability: 16.0 },
      { range: "79~84", probability: 16.0 },
      { range: "85~90", probability: 10.0 },
      { range: "91~96", probability: 10.0 },
      { range: "97~102", probability: 10.0 },
      { range: "103~108", probability: 4.0 },
      { range: "109~114", probability: 4.0 },
      { range: "115~120", probability: 4.0 },
    ],
  },
];

export const SpecialOptions = [
  {
    template: "공격 및 이동 속도가 VALUE 증가한다.",
    tiers: [
      {
        value: ["4%"],
        grade: "하옵",
        probability: 4.2,
      },
      {
        value: ["5%"],
        grade: "중옵",
        probability: 2.1,
      },
      {
        value: ["6%"],
        grade: "상옵",
        probability: 0.7,
      },
    ],
  },
  {
    template: "시드 등급 이하 몬스터에게 주는 피해가 VALUE 증가한다.",
    tiers: [
      {
        value: ["4%"],
        grade: "하옵",
        probability: 4.2,
      },
      {
        value: ["5%"],
        grade: "중옵",
        probability: 2.1,
      },
      {
        value: ["6%"],
        grade: "상옵",
        probability: 0.7,
      },
    ],
  },
  {
    template: "시드 등급 이하 몬스터에게 받는 피해가 VALUE 감소한다.",
    tiers: [
      {
        value: ["6%"],
        grade: "하옵",
        probability: 4.2,
      },
      {
        value: ["8%"],
        grade: "중옵",
        probability: 2.1,
      },
      {
        value: ["10%"],
        grade: "상옵",
        probability: 0.7,
      },
    ],
  },
  {
    template: "물리 방어력 VALUE",
    tiers: [
      {
        value: ["+5000"],
        grade: "하옵",
        probability: 4.2,
      },
      {
        value: ["+6000"],
        grade: "중옵",
        probability: 2.1,
      },
      {
        value: ["+7000"],
        grade: "상옵",
        probability: 0.7,
      },
    ],
  },
  {
    template: "마법 방어력 VALUE",
    tiers: [
      {
        value: ["+5000"],
        grade: "하옵",
        probability: 4.2,
      },
      {
        value: ["+6000"],
        grade: "중옵",
        probability: 2.1,
      },
      {
        value: ["+7000"],
        grade: "상옵",
        probability: 0.7,
      },
    ],
  },
  {
    template: "최대 생명력 VALUE",
    tiers: [
      {
        value: ["+11200"],
        grade: "하옵",
        probability: 4.2,
      },
      {
        value: ["+14000"],
        grade: "중옵",
        probability: 2.1,
      },
      {
        value: ["+16800"],
        grade: "상옵",
        probability: 0.7,
      },
    ],
  },
  {
    template: "전투 중 생명력 회복량 VALUE",
    tiers: [
      {
        value: ["+100"],
        grade: "하옵",
        probability: 4.2,
      },
      {
        value: ["+130"],
        grade: "중옵",
        probability: 2.1,
      },
      {
        value: ["+160"],
        grade: "상옵",
        probability: 0.7,
      },
    ],
  },
  {
    template: "전투자원 자연 회복량 VALUE",
    tiers: [
      {
        value: ["+8%"],
        grade: "하옵",
        probability: 4.2,
      },
      {
        value: ["+10%"],
        grade: "중옵",
        probability: 2.1,
      },
      {
        value: ["+12%"],
        grade: "상옵",
        probability: 0.7,
      },
    ],
  },
  {
    template: "이동기 및 기상기 재사용 대기 시간이 VALUE 감소한다.",
    tiers: [
      {
        value: ["8%"],
        grade: "하옵",
        probability: 4.2,
      },
      {
        value: ["10%"],
        grade: "중옵",
        probability: 2.1,
      },
      {
        value: ["12%"],
        grade: "상옵",
        probability: 0.7,
      },
    ],
  },
  {
    template:
      "공격 적중 시 VALUE1초 동안 경직 및 피격 이상에 면역이 된다. (재사용 대기 시간 VALUE2초) 해당 효과는 1회 피격 시 사라진다.",
    tiers: [
      {
        value: ["80", "80"],
        grade: "하옵",
        probability: 4.2,
      },
      {
        value: ["70", "70"],
        grade: "중옵",
        probability: 2.1,
      },
      {
        value: ["60", "60"],
        grade: "상옵",
        probability: 0.7,
      },
    ],
  },
  {
    template:
      "치명타 적중률이 VALUE 증가한다. 공격이 치명타로 적중 시 적에게 주는 피해가 1.5% 증가한다.",
    tiers: [
      {
        value: ["3.4%"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["4.2%"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["5.0%"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template:
      "치명타 피해가 VALUE 증가한다. 공격이 치명타로 적중 시 적에게 주는 피해가 1.5% 증가한다.",
    tiers: [
      {
        value: ["6.8%"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["8.4%"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["10.0%"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template:
      "적에게 주는 피해가 VALUE1 증가하며, 무력화 상태의 적에게 주는 피해가 VALUE2 증가한다.",
    tiers: [
      {
        value: ["2.0%", "4.0%"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["2.5%", "4.5%"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["3.0%", "5.0%"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template:
      "추가 피해가 VALUE 증가한다. 악마 및 대악마 계열 피해량이 2.5% 증가한다.",
    tiers: [
      {
        value: ["2.5%"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["3.0%"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["3.5%"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template:
      "스킬의 재사용 대기 시간이 2% 증가하지만, 적에게 주는 피해가 VALUE 증가한다.",
    tiers: [
      {
        value: ["4.5%"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["5.0%"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["5.5%"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template:
      "적에게 공격 적중 시 8초 동안 대상의 방어력을 VALUE1 감소시킨다. 해당 효과는 한 파티 당 하나만 적용된다. 아군 공격력 강화 효과가 VALUE2 증가한다.",
    tiers: [
      {
        value: ["1.8%", "2.0%"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["2.1%", "2.5%"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["2.5%", "3.0%"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template:
      "적에게 공격 적중 시 8초 동안 대상의 치명타 저항을 VALUE1 감소시킨다. 해당 효과는 한 파티 당 하나만 적용된다. 아군 공격력 강화 효과가 VALUE2 증가한다.",
    tiers: [
      {
        value: ["1.8%", "2.0%"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["2.1%", "2.5%"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["2.5%", "3.0%"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template:
      "파티 효과로 보호 효과가 적용된 대상이 5초 동안 적에게 주는 피해가 VALUE1 증가한다. 해당 효과는 한 파티 당 하나만 적용되며, 지속 시간이 없는 보호 효과에는 적용되지 않는다. 아군 공격력 강화 효과가 VALUE2 증가한다.",
    tiers: [
      {
        value: ["0.9%", "2.0%"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["1.1%", "2.5%"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["1.3%", "3.0%"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template:
      "적에게 공격 적중 시 8초 동안 대상의 치명타 피해 저항을 VALUE1 감소시킨다. 해당 효과는 한 파티 당 하나만 적용된다. 아군 공격력 강화 효과가 VALUE2 증가한다.",
    tiers: [
      {
        value: ["3.6%", "2.0%"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["4.2%", "2.5%"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["4.8%", "3.0%"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template:
      "공격 적중 시 매 초 마다 10초 동안 무기 공격력이 VALUE, 공격 및 이동 속도가 1% 증가한다.(최대 6중첩)",
    tiers: [
      {
        value: ["1160"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["1320"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["1480"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template:
      "무기 공격력이 VALUE1 증가한다. 자신의 생명력이 50% 이상일 경우 적에게 공격 적중 시 5초 동안 무기 공격력이 VALUE2 증가한다.	",
    tiers: [
      {
        value: ["7200", "2000"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["8100", "2200"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["9000", "2400"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template:
      "무기 공격력이 VALUE1 증가한다. 공격 적중 시 30초 마다 120초 동안 무기 공격력이 VALUE2 증가한다. (최대 30중첩)",
    tiers: [
      {
        value: ["6900", "130"],
        grade: "하옵",
        probability: 0.5,
      },
      {
        value: ["7800", "140"],
        grade: "중옵",
        probability: 0.25,
      },
      {
        value: ["8700", "150"],
        grade: "상옵",
        probability: 0.08333,
      },
    ],
  },
  {
    template: "적에게 주는 피해가 VALUE 증가한다.",
    tiers: [
      {
        value: ["2.0%"],
        grade: "하옵",
        probability: 1.0909,
      },
      {
        value: ["2.5%"],
        grade: "중옵",
        probability: 0.5455,
      },
      {
        value: ["3.0%"],
        grade: "상옵",
        probability: 0.1818,
      },
    ],
  },
  {
    template: "추가 피해 VALUE",
    tiers: [
      {
        value: ["+3.0%"],
        grade: "하옵",
        probability: 1.0909,
      },
      {
        value: ["+3.5%"],
        grade: "중옵",
        probability: 0.5455,
      },
      {
        value: ["+4.0%"],
        grade: "상옵",
        probability: 0.1818,
      },
    ],
  },
  {
    template: "백어택 스킬이 적에게 주는 피해가 VALUE 증가한다.",
    tiers: [
      {
        value: ["2.5%"],
        grade: "하옵",
        probability: 1.0909,
      },
      {
        value: ["3.0%"],
        grade: "중옵",
        probability: 0.5455,
      },
      {
        value: ["3.5%"],
        grade: "상옵",
        probability: 0.1818,
      },
    ],
  },
  {
    template: "헤드어택 스킬이 적에게 주는 피해가 VALUE 증가한다.",
    tiers: [
      {
        value: ["2.5%"],
        grade: "하옵",
        probability: 1.0909,
      },
      {
        value: ["3.0%"],
        grade: "중옵",
        probability: 0.5455,
      },
      {
        value: ["3.5%"],
        grade: "상옵",
        probability: 0.1818,
      },
    ],
  },
  {
    template:
      "방향성 공격이 아닌 스킬이 적에게 주는 피해가 VALUE 증가한다. 각성기는 적용되지 않는다.",
    tiers: [
      {
        value: ["2.5%"],
        grade: "하옵",
        probability: 1.0909,
      },
      {
        value: ["3.0%"],
        grade: "중옵",
        probability: 0.5455,
      },
      {
        value: ["3.5%"],
        grade: "상옵",
        probability: 0.1818,
      },
    ],
  },
  {
    template: "파티원 보호 및 회복 효과가 VALUE 증가한다.",
    tiers: [
      {
        value: ["2.5%"],
        grade: "하옵",
        probability: 1.0909,
      },
      {
        value: ["3.0%"],
        grade: "중옵",
        probability: 0.5455,
      },
      {
        value: ["3.5%"],
        grade: "상옵",
        probability: 0.1818,
      },
    ],
  },
  {
    template: "아군 공격력 강화 효과 VALUE",
    tiers: [
      {
        value: ["+4.0%"],
        grade: "하옵",
        probability: 1.0909,
      },
      {
        value: ["+5.0%"],
        grade: "중옵",
        probability: 0.5455,
      },
      {
        value: ["+6.0%"],
        grade: "상옵",
        probability: 0.1818,
      },
    ],
  },
  {
    template: "아군 피해량 강화 효과 VALUE",
    tiers: [
      {
        value: ["+6.0%"],
        grade: "하옵",
        probability: 1.0909,
      },
      {
        value: ["+7.5%"],
        grade: "중옵",
        probability: 0.5455,
      },
      {
        value: ["+9.0%"],
        grade: "상옵",
        probability: 0.1818,
      },
    ],
  },
  {
    template: "치명타 적중률 VALUE",
    tiers: [
      {
        value: ["+3.4%"],
        grade: "하옵",
        probability: 1.0909,
      },
      {
        value: ["+4.2%"],
        grade: "중옵",
        probability: 0.5455,
      },
      {
        value: ["+5.0%"],
        grade: "상옵",
        probability: 0.1818,
      },
    ],
  },
  {
    template: "치명타 피해 VALUE",
    tiers: [
      {
        value: ["+6.8%"],
        grade: "하옵",
        probability: 1.0909,
      },
      {
        value: ["+8.4%"],
        grade: "중옵",
        probability: 0.5455,
      },
      {
        value: ["+10.0%"],
        grade: "상옵",
        probability: 0.1818,
      },
    ],
  },
  {
    template: "무기 공격력 VALUE",
    tiers: [
      {
        value: ["+7200"],
        grade: "하옵",
        probability: 1.0909,
      },
      {
        value: ["+8100"],
        grade: "중옵",
        probability: 0.5455,
      },
      {
        value: ["+9000"],
        grade: "상옵",
        probability: 0.1818,
      },
    ],
  },
];
