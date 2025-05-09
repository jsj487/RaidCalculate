import styled from "styled-components";
import RaidGoldModal from "./RaidGoldModal";
import { RaidValues } from "./RaidValues";
import React, { useState, useEffect } from "react";

const TableContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  background-color: #2d2d2d;
  color: white;
  border-radius: 8px;
  padding: 20px 0px;
  overflow-x: auto; /* 가로 스크롤 활성화 */
  overflow-y: auto; /* 세로 스크롤 가능 */
  position: relative;

  /* 스크롤바 숨기기 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* 테이블 최소 너비 설정 */

  @media (max-width: 768px) {
    min-width: 100%; /* 모바일에서 최소 너비 */
    font-size: 10px;
  }
`;

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 40px;
  font-weight: 700;
  color: white;
`;

const Instructions = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  background-color: #444;
  border-radius: 50%; /* 원형 테두리 */
  border: 1px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px auto 15px 15px; /* 왼쪽 정렬 */
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;

  &:hover > div {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipText = styled.div`
  visibility: hidden;
  width: 300px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  border: 1px solid #fff;
  padding: 5px 0;
  position: absolute;
  z-index: 1001;
  top: 50%; /* 툴팁 위치 조정 */
  left: 50px; /* 툴팁이 원형 왼쪽에 위치하도록 설정 */
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent #555 transparent transparent;
  }
`;

// 툴팁 컨테이너 유지
const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Icon = styled.span<{ color: string }>`
  display: inline-block;
  width: 16px; /* 도형의 너비 */
  height: 16px; /* 도형의 높이 */
  background-color: ${(props) => props.color}; /* 도형 색상 */
  vertical-align: middle; /* 텍스트와 수평 맞춤 */
  margin-right: 5px; /* 텍스트와 간격 */
`;

const TableHeader = styled.th`
  position: relative;
  background-color: #444;
  color: white;
  text-align: center;
  padding: 10px;
  border: 1px solid #555;
  white-space: nowrap; /* 글자가 줄바꿈되지 않도록 */

  @media (max-width: 768px) {
    padding: 5px;
    font-size: 10px; /* 모바일에서 글자 크기 축소 */
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #3a3a3a;
  }
`;

const TableCell = styled.td`
  text-align: center;
  padding: 10px;
  border: 1px solid #555;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 5px;
    font-size: 10px; /* 모바일에서 글자 크기 축소 */
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;

  @media (max-width: 768px) {
    gap: 3px;
  }
`;

const ToggleButton = styled.div<{ state: number }>`
  width: 30px;
  height: 30px;
  cursor: pointer;
  background-color: ${(props) =>
    props.state === 0 ? "#555" : props.state === 1 ? "#00f" : "#f00"};
  background-image: ${(props) =>
    props.state > 0 ? `url(${process.env.PUBLIC_URL}/img/check.png)` : "none"};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: background-color 0.3s ease, transform 0.3s ease;

  @media (max-width: 768px) {
    width: 20px; /* 모바일에서 버튼 크기 축소 */
    height: 20px;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const ResetButton = styled.button`
  background: #565656;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    background: #3e3e3e;
  }
`;

const ResetIcon = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 24px; /* 아이콘 너비 */
  height: 24px; /* 아이콘 높이 */
  background-image: url(${process.env
    .PUBLIC_URL}/img/reset-icon.png); /* 다운받은 이미지 경로 */
  background-size: contain; /* 이미지를 버튼 크기에 맞게 */
  background-repeat: no-repeat; /* 이미지 반복 방지 */
  background-position: center; /* 이미지 중앙 정렬 */
  transition: transform 0.5s ease-in-out;

  &:hover {
    transform: translateY(-50%) rotate(360deg); /* hover 시 360도 회전 */
  }
`;

const AccordionTitle = styled.h2`
  cursor: pointer;
  background: #444;
  color: white;
  padding: 10px 25px;
  border: 1px solid #555;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    background: #555;
  }
`;

const AccordionIcon = styled.span<{ isOpen: boolean }>`
  font-size: 20px;
  margin-right: 20px;
  transform: ${(props) => (props.isOpen ? "rotate(90deg)" : "rotate(0)")};
  transition: transform 0.3s ease;
`;

const IconWrapper = styled.div`
  display: flex;

  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
`;

const AccordionContent = styled.div<{ isOpen: boolean }>`
  overflow: hidden; /* 스크롤바 숨김 */
  max-height: ${(props) =>
    props.isOpen ? "1000px" : "0"}; /* 열릴 때와 닫힐 때의 높이 설정 */
  transition: max-height 0.6s ease-in-out; /* 스르륵 열리고 닫히는 효과 */
`;

interface Material {
  name: string;
  quantity: number;
}

interface RaidTableProps {
  characters: any[];
  server?: string | null; // Make server optional
  toggleStates: { [key: string]: number };
  setToggleStates: (key: string, newState: number) => void;
  setGoldRewards: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  resetToggleStates: () => void; // New prop for reset
  resetChaToggleStates: (charName: string) => void; // Accepts a character name
  goldRewards: Record<string, number>;
  materialRewards: Record<string, { clear: Material[]; bonus: Material[] }>;
  raidValues: Record<
    string,
    Record<
      string,
      Record<
        string,
        {
          minItemLevel: number;
          phases: Array<{
            clearGold: number;
            bonusCost: number;
            clearMaterials: Material[];
            bonusMaterials: Material[];
          }>;
        }
      >
    >
  >;
}

function RaidTable({
  setToggleStates,
  setGoldRewards,
  characters,
  toggleStates,
  goldRewards,
  raidValues,
  resetToggleStates,
  resetChaToggleStates,
}: RaidTableProps) {
  const transformRaidValues = (raidValues: typeof RaidValues) => {
    return Object.entries(raidValues).map(([category, raids]) => ({
      category,
      raids: Object.entries(raids).map(([raidName, difficulties]) => ({
        name: raidName,
        maxPhases: Math.max(
          ...Object.values(difficulties).map(
            (difficulty) => difficulty.phases.length
          )
        ),
        levels: Object.keys(difficulties), // 난이도 리스트
      })),
    }));
  };

  const raidCategories = transformRaidValues(raidValues); // 변환된 데이터 사용

  const [characterRaidCounts, setCharacterRaidCounts] = useState<{
    [characterName: string]: Set<string>;
  }>({});

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () =>
      raidCategories.reduce(
        (acc, category) => ({ ...acc, [category.category]: false }),
        {}
      )
  );

  const getRaidData = (
    raidValues: any,
    raidName: string,
    level: string
  ): {
    minItemLevel: number;
    phases: Array<{
      clearGold: number;
      bonusCost: number;
      clearMaterials: Material[];
      bonusMaterials: Material[];
    }>;
  } | null => {
    // 모든 카테고리를 순회하며 raidName과 level이 일치하는 데이터를 찾는다
    for (const category of Object.keys(raidValues)) {
      const raidCategory = raidValues[category];
      if (raidCategory?.[raidName]?.[level]) {
        return raidCategory[raidName][level];
      }
    }
    return null; // 일치하는 데이터가 없을 경우
  };

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleToggleClick = (
    key: string,
    displayedCharIndex: number,
    raidName: string,
    raidLevel: string,
    phaseIndex: number
  ) => {
    const currentState = toggleStates[key] || 0;
    const newState = (currentState + 1) % 3;
    const characterName = characters[displayedCharIndex]?.CharacterName;

    if (!characterName) return;

    // 현재 활성화된 레이드 이름 추적
    setCharacterRaidCounts((prevCounts) => {
      const activeRaids = prevCounts[characterName] || new Set<string>();
      const updatedRaids = new Set(activeRaids);

      // 상태에 따라 레이드 추가/삭제
      if (newState > 0) {
        updatedRaids.add(raidName); // 레이드 추가
      } else {
        updatedRaids.delete(raidName); // 레이드 삭제
      }

      // 경고 조건 확인
      if (updatedRaids.size > 3) {
        alert(`${characterName}는 더 이상 레이드를 진행하지 못 합니다.`);
        return prevCounts; // 상태 업데이트 중단
      }

      // 상태 업데이트 진행
      setToggleStates(key, newState);

      // 골드 업데이트
      const raidData = getRaidData(raidValues, raidName, raidLevel);
      if (raidData && Array.isArray(raidData.phases)) {
        const phaseData = raidData.phases[phaseIndex];
        if (phaseData) {
          console.log("Clear Materials:", phaseData.clearMaterials);
          console.log("Bonus Materials:", phaseData.bonusMaterials);

          const additionalGold =
            newState === 1
              ? phaseData.clearGold
              : newState === 2
              ? phaseData.bonusCost
              : -(phaseData.clearGold || 0);

          setToggleStates(key, newState);

          // Dynamically update gold rewards in TabData
          const updatedRewards = { ...goldRewards };
          updatedRewards[characterName] =
            (updatedRewards[characterName] || 0) + additionalGold;
          setGoldRewards(updatedRewards);
        }
      }

      // 업데이트된 레이드 반환
      return { ...prevCounts, [characterName]: updatedRaids };
    });
  };

  const isPhaseDisabled = (
    raidName: string,
    currentLevel: string,
    currentPhase: number,
    characterName: string
  ) => {
    // 같은 레이드의 다른 난이도에서 동일 관문이 체크되었는지 확인
    return Object.keys(toggleStates).some((key) => {
      const [tRaidName, tLevel, tCharName, tPhase] = key.split("-");
      const isSameRaid = tRaidName === raidName;
      const isSamePhase = parseInt(tPhase, 10) === currentPhase;
      const isDifferentLevel = tLevel !== currentLevel;
      const isSameCharacter = tCharName === characterName;

      return (
        isSameRaid &&
        isSamePhase &&
        isDifferentLevel &&
        isSameCharacter &&
        toggleStates[key] > 0
      );
    });
  };

  const handleGlobalReset = () => {
    resetToggleStates(); // Trigger a global reset for all toggle states
  };

  useEffect(() => {
    const newCounts: Record<string, Set<string>> = {};

    Object.keys(toggleStates).forEach((key) => {
      if (toggleStates[key] > 0) {
        const [raidName, , characterName] = key.split("-");

        // 레이드 이름 기준으로 Set에 추가
        if (!newCounts[characterName]) newCounts[characterName] = new Set();
        newCounts[characterName].add(raidName);
      }
    });

    setCharacterRaidCounts(newCounts);
  }, [toggleStates]);

  const categoryIcons: Record<string, string | null> = {
    "카제로스 레이드": `${process.env.PUBLIC_URL}/img/Kazeroth_Raid.png`,
    "에픽 레이드": `${process.env.PUBLIC_URL}/img/Epic_Raid.png`,
    "군단장 레이드": `${process.env.PUBLIC_URL}/img/Commander_Raid.png`,
    "어비스 던전": `${process.env.PUBLIC_URL}/img/Abyss_Dungeon.png`,
    "싱글 레이드": `${process.env.PUBLIC_URL}/img/Solo_Raid.png`, // 아이콘이 없는 경우
  };

  return (
    <TableContainer>
      <Title>주간 레이드</Title>
      <TooltipContainer>
        <Instructions>
          ?
          <TooltipText>
            사각형은 각 레이드에 관문을 의미합니다. 사각형 색에 따라 레이드
            클리어 상태를 알 수 있습니다. <hr /> <Icon color="blue" /> - 클리어
            골드
            <br /> <Icon color="red" />- 더 보기 한 골드
          </TooltipText>
        </Instructions>
      </TooltipContainer>
      <RaidGoldModal />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <ResetButton onClick={handleGlobalReset}>전체 초기화</ResetButton>
      </div>
      {raidCategories.map((category) => (
        <div key={category.category}>
          <AccordionTitle onClick={() => toggleCategory(category.category)}>
            <AccordionIcon isOpen={openCategories[category.category]}>
              ▶
            </AccordionIcon>
            <IconWrapper>
              <img
                src={categoryIcons[category.category]!}
                alt={`${category.category} icon`}
              />
            </IconWrapper>
            {category.category}
          </AccordionTitle>

          <AccordionContent isOpen={openCategories[category.category]}>
            <Table>
              <thead>
                <TableRow>
                  <TableHeader>레이드 이름</TableHeader>
                  <TableHeader>난이도</TableHeader>
                  {characters.map((char, index) => (
                    <TableHeader key={index}>
                      {char?.CharacterName || "No Name"}
                      <div
                        style={{
                          fontSize: "12px",
                          marginTop: "5px",
                          color:
                            (characterRaidCounts[char.CharacterName]?.size ||
                              0) >= 3
                              ? "red"
                              : "#ccc",
                        }}
                      >
                        {/* ItemAvgLevel */}
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#FFD700",
                          }}
                        >
                          [{char?.ItemMaxLevel || "No Level"}]
                        </div>

                        {/* Raid Count */}
                        <div
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                            color:
                              (characterRaidCounts[char.CharacterName]?.size ||
                                0) >= 3
                                ? "red"
                                : "#ccc",
                          }}
                        >
                          {characterRaidCounts[char.CharacterName]?.size || 0}/3
                        </div>
                      </div>
                      <div
                        style={{
                          width: "50%",
                          height: "4px",
                          backgroundColor: "#ccc",
                          margin: "5px auto",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: `${
                              ((characterRaidCounts[char.CharacterName]?.size ||
                                0) /
                                3) *
                              100
                            }%`,
                            height: "100%",
                            backgroundColor:
                              (characterRaidCounts[char.CharacterName]?.size ||
                                0) >= 3
                                ? "red"
                                : "green",
                          }}
                        ></div>
                      </div>
                      {category.category === "카제로스 레이드" && (
                        <ResetIcon
                          onClick={() =>
                            resetChaToggleStates(char.CharacterName)
                          }
                        />
                      )}
                    </TableHeader>
                  ))}
                </TableRow>
              </thead>

              <tbody>
                {category.raids.map((raid) => (
                  <React.Fragment key={raid.name}>
                    {raid.levels.map((level, levelIndex) => (
                      <TableRow key={`${raid.name}-${level}`}>
                        {levelIndex === 0 && (
                          <TableCell rowSpan={raid.levels.length}>
                            <div>
                              {raid.name}
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#ccc",
                                  marginTop: "5px",
                                }}
                              >
                                {raid.levels
                                  .map((level) => {
                                    const raidData = getRaidData(
                                      raidValues,
                                      raid.name,
                                      level
                                    );
                                    return `[${level} - ${
                                      raidData?.minItemLevel || "N/A"
                                    }]`;
                                  })
                                  .join(", ")}
                              </div>
                            </div>
                          </TableCell>
                        )}
                        <TableCell>{level}</TableCell>
                        {characters.map((_, charIndex) => (
                          <TableCell key={`${raid.name}-${level}-${charIndex}`}>
                            <ToggleContainer>
                              {Array.from(
                                {
                                  length: (() => {
                                    const raidData = getRaidData(
                                      raidValues,
                                      raid.name,
                                      level
                                    );
                                    return raidData &&
                                      Array.isArray(raidData.phases)
                                      ? raidData.phases.length
                                      : 0;
                                  })(),
                                },
                                (_, phase) => {
                                  const toggleKey = `${raid.name}-${level}-${characters[charIndex]?.CharacterName}-${phase}`;
                                  const isDisabled = isPhaseDisabled(
                                    raid.name,
                                    level,
                                    phase,
                                    characters[charIndex]?.CharacterName
                                  );

                                  return (
                                    <ToggleButton
                                      key={toggleKey}
                                      state={toggleStates[toggleKey] || 0}
                                      onClick={() =>
                                        !isDisabled &&
                                        handleToggleClick(
                                          toggleKey,
                                          charIndex,
                                          raid.name,
                                          level,
                                          phase
                                        )
                                      }
                                      style={{
                                        opacity: isDisabled ? 0.5 : 1,
                                        cursor: isDisabled
                                          ? "not-allowed"
                                          : "pointer",
                                      }}
                                    />
                                  );
                                }
                              )}
                            </ToggleContainer>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </AccordionContent>
        </div>
      ))}
    </TableContainer>
  );
}

export default RaidTable;
function setMaterials(arg0: {
  clearMaterials: Material[];
  bonusMaterials: Material[];
}) {
  throw new Error("Function not implemented.");
}
