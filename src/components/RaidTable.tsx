import styled from "styled-components";
import { useState } from "react";

const TableContainer = styled.div`
  width: 100%;
  margin-top: 20px;
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
  white-space: nowrap; /* 헤더 텍스트 줄바꿈 방지 */
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
  gap: 5px; /* 버튼 간 간격 */
`;

const ToggleButton = styled.div<{ state: number }>`
  width: 30px;
  height: 30px;
  cursor: pointer;
  background-color: ${(props) =>
    props.state === 0 ? "#555" : props.state === 1 ? "#00f" : "#f00"};
  transition: background-color 0.3s ease; /* 부드러운 전환 효과 추가 */

  &:hover {
    background-color: ${(props) =>
      props.state === 0 ? "#777" : props.state === 1 ? "#3399ff" : "#ff6666"};
  }
`;

interface RaidTableProps {
  characters: any[]; // 캐릭터 데이터
  server: string | null; // 서버 데이터 추가
}

function RaidTable({ characters, server }: RaidTableProps) {
  // 레이드 데이터 정의
  const raidData = [
    { name: "아브렐슈드", maxPhases: 2, levels: ["하드", "노말"] },
    { name: "에기르", maxPhases: 2, levels: ["하드", "노말"] },
    { name: "에기드나", maxPhases: 2, levels: ["하드", "노말"] },
  ];

  // 상태 관리: 토글 상태를 저장
  const [toggleStates, setToggleStates] = useState<{
    [key: string]: number;
  }>({});

  const handleToggle = (key: string) => {
    setToggleStates((prevStates) => ({
      ...prevStates,
      [key]: (prevStates[key] || 0) === 2 ? 0 : (prevStates[key] || 0) + 1,
    }));
  };

  return (
    <TableContainer>
      <h2>{server} 레이드 테이블</h2> {/* 서버 이름 표시 */}
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
          {raidData.map((raid) => (
            <>
              {raid.levels.map((level) => (
                <TableRow key={`${raid.name}-${level}`}>
                  {level === "하드" && (
                    <TableCell rowSpan={raid.levels.length}>
                      {raid.name}
                    </TableCell>
                  )}
                  <TableCell>{level}</TableCell>

                  {characters.map((_, charIndex) => (
                    <TableCell key={`${raid.name}-${level}-${charIndex}`}>
                      <ToggleContainer>
                        {Array.from({ length: raid.maxPhases }, (_, phase) => {
                          const toggleKey = `${raid.name}-${level}-${charIndex}-${phase}`;
                          return (
                            <ToggleButton
                              key={toggleKey}
                              state={toggleStates[toggleKey] || 0}
                              onClick={() => handleToggle(toggleKey)}
                            />
                          );
                        })}
                      </ToggleContainer>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

export default RaidTable;
