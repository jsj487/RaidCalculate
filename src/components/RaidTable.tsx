import styled from "styled-components";
import React from "react";

const TableContainer = styled.div`
  width: 100%;
  background-color: #2d2d2d;
  color: white;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto; /* 가로 스크롤 가능하도록 설정 */

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* 작은 화면에서 테이블이 줄어들지 않도록 설정 */

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const TableHeader = styled.th`
  background-color: #444;
  color: white;
  text-align: center;
  padding: 10px;
  border: 1px solid #555;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */

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
  transition: background-color 0.3s ease;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

interface RaidTableProps {
  characters: any[];
  server: string | null;
  onToggle: (charIndex: number, gold: number) => void;
  toggleStates: { [key: string]: number };
  setToggleStates: (key: string, newState: number) => void;
  raidValues: Record<
    string,
    Record<string, Array<{ clearGold: number; bonusGold: number }>>
  >; // MainPage에서 전달받음
}

function RaidTable({
  characters,
  onToggle,
  toggleStates,
  setToggleStates,
  raidValues, // props로 가져오기
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
          maxPhases: 4, // 하드 4관문 반영
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

  const handleToggleClick = (key: string, charIndex: number) => {
    const currentState = toggleStates[key] || 0;
    const newState = currentState === 2 ? 0 : currentState + 1;

    // 상태 업데이트
    setToggleStates(key, newState);

    // 골드 업데이트 전달 (newState와 관련된 처리는 MainPage.tsx에서 처리)
    onToggle(charIndex, newState);
  };

  return (
    <TableContainer>
      {raidCategories.map((category) => (
        <React.Fragment key={category.category}>
          <h2>{category.category}</h2>
          <Table>
            <thead>
              <TableRow>
                <TableHeader>레이드 이름</TableHeader>
                <TableHeader>난이도</TableHeader>
                {characters.map((char, index) => (
                  <TableHeader key={index}>{char.CharacterName}</TableHeader>
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
                                const toggleKey = `${raid.name}-${level}-${charIndex}-${phase}`;
                                return (
                                  <ToggleButton
                                    key={toggleKey}
                                    state={toggleStates[toggleKey] || 0}
                                    onClick={() =>
                                      handleToggleClick(toggleKey, charIndex)
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
