import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { IoIosRefresh } from "react-icons/io"; // React Icons import 추가

const TableContainer = styled.div`
  width: 100%;
  background-color: #2d2d2d;
  color: white;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  text-align: center; /* 중앙 정렬 */

  @media (max-width: 768px) {
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
  margin: 0 auto; /* 수평 중앙 정렬 */
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
    props.state === 0 ? "#555" : props.state === 1 ? "#00f" : "#f00"};
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

const ResetIcon = styled(IoIosRefresh)`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white; /* 아이콘 색상 */
  font-size: 24px; /* 아이콘 크기 */
  transition: transform 0.5s ease-in-out;

  &:hover {
    transform: translateY(-50%) rotate(360deg); /* hover 시 360도 회전 */
  }
`;

interface RaidTableProps {
  characters: any[];
  server: string | null;
  toggleStates: { [key: string]: number };
  setToggleStates: (key: string, newState: number) => void; // 함수 타입 정의
  setGoldRewards: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  raidValues: Record<
    string,
    Record<string, Array<{ clearGold: number; bonusGold: number }>>
  >;
}

function RaidTable({
  characters,
  toggleStates,
  setToggleStates,
  setGoldRewards,
  raidValues,
}: RaidTableProps) {
  const [characterRaidCounts, setCharacterRaidCounts] = useState<{
    [characterName: string]: Set<string>;
  }>({});

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
        { name: "혼돈의 상하탑", maxPhases: 3, levels: ["하드", "노말"] },
        { name: "카양겔", maxPhases: 3, levels: ["하드", "노말"] },
      ],
    },
  ];

  const handleToggleClick = (
    key: string,
    displayedCharIndex: number,
    raidName: string,
    level: string,
    phase: number
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
      const raidData = raidValues[raidName]?.[level]?.[phase];
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
    Object.keys(toggleStates).forEach((key) => {
      if (key.includes(`-${charIndex}-`)) {
        setToggleStates(key, 0); // 해당 캐릭터 열의 상태를 0으로 초기화
      }
    });

    // 해당 캐릭터의 레이드 선택 상태 초기화
    setCharacterRaidCounts((prev) => {
      const updated = { ...prev };
      delete updated[charIndex]; // 해당 캐릭터의 상태 삭제
      return updated;
    });
  };

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
        <React.Fragment key={category.category}>
          <h2>{category.category}</h2>
          <Table>
            <thead>
              <TableRow>
                <TableHeader>레이드 이름</TableHeader>
                <TableHeader>난이도</TableHeader>
                {characters.map((char, index) => (
                  <TableHeader key={index}>
                    {char.CharacterName}
                    {category.category === "카제로스 레이드" && (
                      <ResetIcon onClick={() => resetCharacterColumn(index)} />
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
                          {raid.name}
                        </TableCell>
                      )}
                      <TableCell>{level}</TableCell>
                      {characters.map((_, charIndex) => (
                        <TableCell key={`${raid.name}-${level}-${charIndex}`}>
                          <ToggleContainer>
                            {Array.from(
                              {
                                length:
                                  raidValues[raid.name]?.[level]?.length || 0,
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
        </React.Fragment>
      ))}
    </TableContainer>
  );
}

export default RaidTable;
