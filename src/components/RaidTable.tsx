import styled from "styled-components";
import React, { useState, useEffect } from "react";

const TableContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px); /* 화면 높이에서 상단 여백을 뺀 값 */
  background-color: #2d2d2d;
  color: white;
  border-radius: 8px;
  padding: 20px 0px;
  overflow-y: auto; /* 세로 스크롤 가능 */
  text-align: center;
  position: relative;

  /* 스크롤바 숨기기 */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  @media (max-width: 768px) {
    height: calc(100vh - 80px); /* 모바일에서 적응 */
    padding: 10px;
  }
`;

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 40px;
  font-weight: 700;
  color: white;
`;

const Instructions = styled.p`
  margin-bottom: 20px;
  font-size: 14px;
  color: #ddd;
  text-align: center;
  border: 1px dashed #ddd; /* 점선 테두리 */
  border-radius: 8px; /* 모서리를 둥글게 */
  padding: 10px; /* 글자 주변 공간 */
  display: inline-block; /* 글자 주변 크기로 테두리 설정 */
  margin: 15px auto; /* 수평 중앙 정렬 */
`;

const Icon = styled.span<{ color: string }>`
  display: inline-block;
  width: 16px; /* 도형의 너비 */
  height: 16px; /* 도형의 높이 */
  background-color: ${(props) => props.color}; /* 도형 색상 */
  vertical-align: middle; /* 텍스트와 수평 맞춤 */
  margin-right: 5px; /* 텍스트와 간격 */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const TableHeader = styled.th`
  position: relative; /* ResetIcon의 absolute 위치 기준 설정 */
  background-color: #444;
  color: white;
  text-align: center;
  padding: 10px;
  border: 1px solid #555;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 5px;
    font-size: 10px;
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

  @media (max-width: 768px) {
    padding: 5px;
    font-size: 10px;
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
    props.state === 0
      ? "#555" // 기본 상태: 회색
      : props.state === 1
      ? "#00f" // 클리어 상태: 파란색
      : "#f00"}; // 더 보기 상태: 빨간색
  background-image: ${(props) =>
    props.state > 0 ? `url(${process.env.PUBLIC_URL}/img/check.png)` : "none"};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: background-color 0.3s ease, transform 0.3s ease;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }

  &:hover {
    transform: scale(1.1); /* hover 시 버튼 크기 확대 효과 */
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

const AccordionContent = styled.div<{ isOpen: boolean }>`
  overflow: hidden; /* 스크롤바 숨김 */
  max-height: ${(props) =>
    props.isOpen ? "1000px" : "0"}; /* 열릴 때와 닫힐 때의 높이 설정 */
  transition: max-height 0.6s ease-in-out; /* 스르륵 열리고 닫히는 효과 */
`;

interface RaidTableProps {
  characters: any[];
  server: string | null;
  toggleStates: { [key: string]: number };
  setToggleStates: (key: string, newState: number) => void; // 함수 타입 정의
  setGoldRewards: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  raidValues: Record<
    string,
    Record<
      string,
      {
        minItemLevel: number;
        phases: Array<{ clearGold: number; bonusGold: number }>;
      }
    >
  >; // RaidValues 타입 정의
}

function RaidTable({
  characters,
  toggleStates,
  setToggleStates,
  setGoldRewards,
  raidValues,
}: RaidTableProps) {
  const raidCategories = [
    {
      category: "카제로스 레이드",
      raids: [
        { name: "카제로스 아브렐슈드", maxPhases: 2, levels: ["하드", "노말"] },
        { name: "에기르", maxPhases: 2, levels: ["하드", "노말"] },
        { name: "에키드나", maxPhases: 2, levels: ["하드", "노말"] },
      ],
    },
    {
      category: "에픽 레이드",
      raids: [{ name: "베히모스", maxPhases: 2, levels: ["노말"] }],
    },
    {
      category: "군단장 레이드",
      raids: [
        {
          name: "카멘",
          maxPhases: 4,
          levels: ["하드", "노말"],
        },
        { name: "일리아칸", maxPhases: 3, levels: ["하드", "노말"] },
        { name: "군단장 아브렐슈드", maxPhases: 4, levels: ["하드", "노말"] },
        { name: "쿠크세이튼", maxPhases: 3, levels: ["노말"] },
        { name: "비아키스", maxPhases: 2, levels: ["하드", "노말"] },
        { name: "발탄", maxPhases: 2, levels: ["하드", "노말"] },
      ],
    },
    {
      category: "어비스 던전",
      raids: [
        { name: "혼돈의 상아탑", maxPhases: 3, levels: ["하드", "노말"] },
        { name: "카양겔", maxPhases: 3, levels: ["하드", "노말"] },
      ],
    },
  ];

  const [characterRaidCounts, setCharacterRaidCounts] = useState<{
    [characterName: string]: Set<string>;
  }>({});

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () =>
      raidCategories.reduce(
        (acc, category) => ({ ...acc, [category.category]: true }),
        {}
      )
  );

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
      const raidData = raidValues[raidName]?.[raidLevel]?.phases[phaseIndex];
      if (raidData) {
        setGoldRewards((prevRewards) => {
          const updatedRewards = { ...prevRewards };
          const currentReward = updatedRewards[characterName] || 0;
          const additionalGold =
            newState === 1
              ? raidData.clearGold
              : newState === 2
              ? raidData.bonusGold
              : -raidData.clearGold - raidData.bonusGold;

          updatedRewards[characterName] = Math.max(
            0,
            currentReward + additionalGold
          );
          return updatedRewards;
        });
      }

      // 업데이트된 레이드 반환
      return { ...prevCounts, [characterName]: updatedRaids };
    });
  };

  // 모든 상태 초기화
  const resetAll = () => {
    const isConfirmed = window.confirm("표를 전부 초기화 하겠습니까?");
    if (isConfirmed) {
      Object.keys(toggleStates).forEach((key) => {
        setToggleStates(key, 0);
      });
      localStorage.setItem("toggleStates", JSON.stringify({}));
      setCharacterRaidCounts({}); // 레이드 이름 초기화
    }
  };

  // 특정 캐릭터 열 초기화
  const resetCharacterColumn = (charIndex: number) => {
    const characterName = characters[charIndex]?.CharacterName;
    if (!characterName) return;

    // toggleStates에서 해당 캐릭터와 관련된 상태 초기화
    Object.keys(toggleStates).forEach((key) => {
      if (key.includes(characterName)) {
        setToggleStates(key, 0); // 상태 초기화
      }
    });

    // 해당 캐릭터의 레이드 선택 상태 초기화
    setCharacterRaidCounts((prev) => {
      const updated = { ...prev };
      delete updated[characterName]; // 캐릭터의 상태 삭제
      return updated;
    });
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

    console.log("Updated characterRaidCounts:", newCounts);
    setCharacterRaidCounts(newCounts);
  }, [toggleStates]);

  return (
    <TableContainer>
      <Title>주간 레이드</Title>
      <Instructions>
        사각형은 각 레이드에 관문을 의미합니다. 사각형 색에 따라 레이드 클리어
        상태를 알 수 있습니다.
        <br />
        <Icon color="blue" /> - 클리어 골드, <Icon color="red" /> - 더 보기 한
        골드
      </Instructions>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <ResetButton onClick={resetAll}>전체 초기화</ResetButton>
      </div>
      {raidCategories.map((category) => (
        <div key={category.category}>
          <AccordionTitle onClick={() => toggleCategory(category.category)}>
            <AccordionIcon isOpen={openCategories[category.category]}>
              ▶
            </AccordionIcon>
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
                      {char.CharacterName}
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
                          onClick={() => resetCharacterColumn(index)}
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
                                  .map(
                                    (level) =>
                                      `[${level} - ${
                                        raidValues[raid.name]?.[level]
                                          ?.minItemLevel
                                      }]`
                                  )
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
                                  length:
                                    raidValues[raid.name]?.[level]?.phases
                                      ?.length || 0, // phases 배열의 길이 사용
                                },
                                (_, phase) => {
                                  const toggleKey = `${raid.name}-${level}-${characters[charIndex]?.CharacterName}-${phase}`;
                                  return (
                                    <ToggleButton
                                      key={toggleKey}
                                      state={toggleStates[toggleKey] || 0}
                                      onClick={() =>
                                        handleToggleClick(
                                          toggleKey,
                                          charIndex,
                                          raid.name,
                                          level,
                                          phase
                                        )
                                      }
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
