import React, { useState } from "react";
import styled from "styled-components";
import { RaidValues } from "./RaidValues";

const ModalButton = styled.button`
  background: #565656;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 20px;
  cursor: pointer;
  margin-left: 30px;

  &:hover {
    background: #3e3e3e;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative; /* CloseButton 위치를 위해 */
  background-color: #333;
  color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%; /* Modal 크기 확대 */
  max-width: 900px;
  max-height: 95vh; /* 최대 높이 확대 */
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background: #565656; /* 동일한 배경색 */
  color: white; /* 글자 색상 */
  border: none; /* 테두리 제거 */
  border-radius: 4px; /* 둥근 모서리 */
  padding: 5px 10px; /* 동일한 패딩 */
  font-size: 20px; /* 글자 크기 */
  cursor: pointer; /* 마우스 커서 포인터 */
  position: absolute; /* 위치 조정 */
  top: 10px;
  right: 10px;

  &:hover {
    background: #3e3e3e; /* 호버 시 배경색 변경 */
  }
`;

const Title = styled.h2`
  text-align: center;
  margin: 0;
  padding: 10px 0;
  font-size: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TableCell = styled.td`
  border: 1px solid #555;
  padding: 8px;
  text-align: center;
  background-color: #444;
  color: white;

  &:last-child {
    font-weight: bold;
  }
`;

const TableHeader = styled.th`
  border: 1px solid #555;
  background-color: #222;
  color: white;
  padding: 8px;
  text-align: center;
`;

const AccordionTitle = styled.h3`
  cursor: pointer;
  background: #444;
  color: white;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    background: #555;
  }
`;

const AccordionContent = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? "10000px" : "0")};
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
`;

const AccordionIcon = styled.span<{ isOpen: boolean }>`
  font-size: 20px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${(props) => (props.isOpen ? "rotate(90deg)" : "rotate(0)")};
  transition: transform 0.3s ease;
`;

const GoldModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () =>
      Object.keys(RaidValues).reduce((acc, category) => {
        acc[category] = false;
        return acc;
      }, {} as Record<string, boolean>)
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const materialNameMap: Record<string, string> = {
    "경이로운 명예의 돌파석": "Glorious_Honor_Stone.png",
    "빛나는 지혜의 엘릭서": "Shining_Elixir_of_Wisdom.png",
    "쇠락의 눈동자": "Decaying_Eye.png",
    "광기의 나팔": "Madness_Horn.png",
    수호강석: "Guardian_Stone.png",
    "농축 돌파석": "Concentrated_Breakthrough_Stone.png",
    "수호석 결정": "Guardian_Stone_Crystal.png",
    "순환 돌파석": "Cycling_Breakthrough_Stone.png",
    "시련의 빛": "Light_of_Trial.png",
    "심화 돌파석": "Advanced_Breakthrough_Stone.png",
    "아그리스의 비늘": "Agrise_Scale.png",
    "알키오네의 눈": "Eye_of_Alcyone.png",
    "어둠의 불": "Fire_of_Darkness.png",
    "업화의 쐐기돌": "Searing_Spike.png",
    "욕망의 날개": "Wings_of_Desire.png",
    "운명의 돌": "Stone_of_Fate.png",
    "마수의 뼈": "Beast_Bone.png",
    "운명의 돌파석": "Breakstone_of_Fate.png",
    "운명의 수호석": "Guardian_Stone_of_Fate.png",
    "운명의 파괴석": "Destruction_Stone_of_Fate.png",
    "관조의 빛무리": "Contemplation_Light.png",
    "빛나는 지혜의 기운": "Radiant_Energy.png",
    "운명의 파편": "Fragment_of_Fate.png",
    "명예의 파편": "Honor_Fragment.png",
    "위대한 명예의 돌파석": "Great_Honor_Breakstone.png",
    "정제된 수호강석": "Refined_Guardian_Stone.png",
    "정제된 파괴강석": "Refined_Destruction_Stone.png",
    "찬란한 명예의 돌파석": "Radiant_Breakthrough_Stone_of_Honor.png",
    "카르마의 잔영": "Shadow_of_Karma.png",
    "클리어 메달": "Clear_Medal.png",
    "융합 돌파석": "Fusion_Breakthrough_Stone.png",
    "베히모스의 비늘": "Behemoth_Scale.png",
    "몽환의 사념": "Dream_Thought.png",
    "마력의 샘물": "Mana_Spring.png",
    파괴강석: "Destruction_Stone.png",
    "파괴석 결정": "Destruction_Stone_Fragment.png",
    "혼돈의 돌": "Stone_of_Chaos.png",
  };

  const getMaterialImagePath = (materialName: string): string => {
    const fileName = materialNameMap[materialName]; // 매핑된 파일 이름 가져오기
    if (!fileName) {
      console.warn(`No mapping found for material: ${materialName}`);
      return ""; // 매핑이 없으면 빈 문자열 반환
    }
    return `${process.env.PUBLIC_URL}/img/Material_Icon/${fileName}`;
  };

  return (
    <>
      <ModalButton onClick={openModal}>레이드 보상 보기</ModalButton>

      {isOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>닫기</CloseButton>
            <Title>레이드 보상(재료는 정확하지 않으니 참고만)</Title>

            {Object.entries(RaidValues).map(([category, raids]) => (
              <div key={category}>
                <AccordionTitle onClick={() => toggleCategory(category)}>
                  <AccordionIcon isOpen={openCategories[category]}>
                    ▶
                  </AccordionIcon>
                  {category}
                </AccordionTitle>

                <AccordionContent isOpen={openCategories[category]}>
                  {Object.entries(raids).map(([raidName, difficulties]) => (
                    <div
                      key={raidName}
                      style={{
                        marginBottom: "20px",
                        border: "1px solid #555",
                      }}
                    >
                      <h4 style={{ textAlign: "center", margin: "10px" }}>
                        {raidName}
                      </h4>
                      <Table>
                        <thead>
                          <tr>
                            <TableHeader>난이도</TableHeader>
                            {Array.from({
                              length: Math.max(
                                ...Object.values(difficulties).map(
                                  (d) => d.phases.length
                                )
                              ),
                            }).map((_, idx) => (
                              <TableHeader key={idx}>{idx + 1}관문</TableHeader>
                            ))}
                            <TableHeader>총합</TableHeader>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(difficulties).map(
                            ([difficulty, data]) => {
                              const totalClearGold = data.phases.reduce(
                                (sum, phase) => sum + phase.clearGold,
                                0
                              );
                              const totalBonusGold = data.phases.reduce(
                                (sum, phase) => sum + phase.bonusGold,
                                0
                              );

                              const maxPhases = Math.max(
                                ...Object.values(difficulties).map(
                                  (d) => d.phases.length
                                )
                              );

                              // 각 난이도의 재료 합산 계산
                              const totalClearMaterials: Record<
                                string,
                                number
                              > = {};
                              const totalBonusMaterials: Record<
                                string,
                                number
                              > = {};

                              data.phases.forEach((phase) => {
                                // 클리어 재료 합산
                                phase.clearMaterials.forEach((material) => {
                                  totalClearMaterials[material.name] =
                                    (totalClearMaterials[material.name] || 0) +
                                    material.quantity;
                                });

                                // 보너스 재료 합산
                                phase.bonusMaterials.forEach((material) => {
                                  totalBonusMaterials[material.name] =
                                    (totalBonusMaterials[material.name] || 0) +
                                    material.quantity;
                                });
                              });

                              return (
                                <React.Fragment key={difficulty}>
                                  <tr>
                                    {/* 난이도 */}
                                    <TableCell rowSpan={2}>
                                      {difficulty}
                                    </TableCell>

                                    {/* 각 관문 골드 */}
                                    {Array.from({ length: maxPhases }).map(
                                      (_, idx) => {
                                        const phase = data.phases[idx];
                                        return (
                                          <TableCell key={idx}>
                                            {phase
                                              ? `${phase.clearGold.toLocaleString()} `
                                              : ""}
                                            {phase && (
                                              <span
                                                style={{ color: "#FF69B4" }}
                                              >
                                                (
                                                {phase.bonusGold.toLocaleString()}
                                                )
                                              </span>
                                            )}
                                          </TableCell>
                                        );
                                      }
                                    )}

                                    {/* 총합 */}
                                    <TableCell>
                                      {totalClearGold.toLocaleString()}{" "}
                                      <span style={{ color: "#FF69B4" }}>
                                        ({totalBonusGold.toLocaleString()})
                                      </span>
                                    </TableCell>
                                  </tr>

                                  {/* 재료 표시 */}
                                  <tr>
                                    {Array.from({ length: maxPhases }).map(
                                      (_, idx) => {
                                        const phase = data.phases[idx];
                                        return (
                                          <TableCell key={`materials-${idx}`}>
                                            {/* Clear Materials */}
                                            {phase?.clearMaterials.map(
                                              (material) => {
                                                const imagePath =
                                                  getMaterialImagePath(
                                                    material.name
                                                  ); // 이미지 경로 가져오기
                                                return (
                                                  <div
                                                    key={material.name}
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: "5px",
                                                    }}
                                                  >
                                                    {imagePath && (
                                                      <img
                                                        src={imagePath}
                                                        alt={material.name}
                                                        style={{
                                                          width: "24px",
                                                          height: "24px",
                                                        }}
                                                      />
                                                    )}
                                                    {material.quantity.toLocaleString()}
                                                  </div>
                                                );
                                              }
                                            )}

                                            {phase?.bonusMaterials.map(
                                              (material) => {
                                                const imagePath =
                                                  getMaterialImagePath(
                                                    material.name
                                                  ); // 이미지 경로 가져오기
                                                return (
                                                  <div
                                                    key={`bonus-${material.name}`}
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: "5px",
                                                      color: "#FF69B4",
                                                    }}
                                                  >
                                                    {imagePath && (
                                                      <img
                                                        src={imagePath}
                                                        alt={material.name}
                                                        style={{
                                                          width: "24px",
                                                          height: "24px",
                                                        }}
                                                      />
                                                    )}
                                                    {material.quantity.toLocaleString()}
                                                  </div>
                                                );
                                              }
                                            )}
                                          </TableCell>
                                        );
                                      }
                                    )}
                                    <TableCell>
                                      {/* Clear Materials Total */}
                                      {Object.entries(totalClearMaterials).map(
                                        ([name, quantity]) => {
                                          const imagePath =
                                            getMaterialImagePath(name); // 이미지 경로 가져오기
                                          return (
                                            <div
                                              key={name}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                              }}
                                            >
                                              {imagePath && (
                                                <img
                                                  src={imagePath}
                                                  alt={name}
                                                  style={{
                                                    width: "24px",
                                                    height: "24px",
                                                  }}
                                                />
                                              )}
                                              {quantity.toLocaleString()}
                                            </div>
                                          );
                                        }
                                      )}

                                      {/* Bonus Materials Total */}
                                      {Object.entries(totalBonusMaterials).map(
                                        ([name, quantity]) => {
                                          const imagePath =
                                            getMaterialImagePath(name); // 이미지 경로 가져오기
                                          return (
                                            <div
                                              key={name}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                color: "#FF69B4",
                                              }}
                                            >
                                              {imagePath && (
                                                <img
                                                  src={imagePath}
                                                  alt={name}
                                                  style={{
                                                    width: "24px",
                                                    height: "24px",
                                                  }}
                                                />
                                              )}
                                              {quantity.toLocaleString()}
                                            </div>
                                          );
                                        }
                                      )}
                                    </TableCell>
                                  </tr>
                                </React.Fragment>
                              );
                            }
                          )}
                        </tbody>
                      </Table>
                    </div>
                  ))}
                </AccordionContent>
              </div>
            ))}
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default GoldModal;
