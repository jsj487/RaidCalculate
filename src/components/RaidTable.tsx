import styled from "styled-components";
import { useState, useEffect } from "react";
import React from "react";

const TableContainer = styled.div`
  width: 100%;
  background-color: #2d2d2d;
  color: white;
  border-radius: 8px;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #444;
  color: white;
  text-align: center;
  padding: 10px;
  border: 1px solid #555;
  white-space: nowrap;
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
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;

const ToggleButton = styled.div<{ state: number }>`
  width: 30px;
  height: 30px;
  cursor: pointer;
  background-color: ${(props) =>
    props.state === 0 ? "#555" : props.state === 1 ? "#00f" : "#f00"};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.state === 0 ? "#777" : props.state === 1 ? "#3399ff" : "#ff6666"};
  }
`;

interface RaidTableProps {
  characters: any[];
  server: string | null;
  onToggle: (charIndex: number, gold: number) => void;
  toggleStates: { [key: string]: number }; // 추가
  setToggleStates: (key: string, newState: number) => void; // 추가
}

function RaidTable({
  characters,
  server,
  onToggle,
  toggleStates,
  setToggleStates,
}: RaidTableProps) {
  const raidValues: Record<
    string,
    Record<string, Array<{ clearGold: number; bonusGold: number }>>
  > = {
    // 예시 데이터
    "카제로스 아브렐슈드": {
      하드: [
        { clearGold: 10000, bonusGold: 4500 },
        { clearGold: 20500, bonusGold: 7200 },
      ],
      노말: [
        { clearGold: 8500, bonusGold: 3800 },
        { clearGold: 16500, bonusGold: 5200 },
      ],
    },
  };

  const raidCategories = [
    {
      category: "카제로스 레이드",
      raids: [
        { name: "카제로스 아브렐슈드", maxPhases: 2, levels: ["하드", "노말"] },
      ],
    },
  ];

  const handleToggleClick = (key: string, charIndex: number, phase: number) => {
    const currentState = toggleStates[key] || 0;
    const newState = currentState === 2 ? 0 : currentState + 1;

    const [raidName, raidLevel] = key.split("-").slice(0, 2);
    const { clearGold, bonusGold } = raidValues[raidName]?.[raidLevel]?.[
      phase
    ] || { clearGold: 0, bonusGold: 0 };

    const goldChange =
      newState === 1
        ? clearGold
        : newState === 2
        ? -bonusGold
        : -(clearGold - bonusGold);

    setToggleStates(key, newState);
    onToggle(charIndex, goldChange); // 골드 업데이트 전달
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
                                      handleToggleClick(
                                        toggleKey,
                                        charIndex,
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
