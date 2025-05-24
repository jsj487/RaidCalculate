import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

//공통 레이아웃
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  color: black;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const DetailLayout = styled.div`
  display: flex;
  gap: 32px;
  padding: 40px;
  justify-content: center;
`;

const InfoCard = styled.div`
  height: 650px;
  background: white;
  border-radius: 32px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScrollableInfoCard = styled(InfoCard)`
  width: 400px;
  overflow-y: auto;
  position: relative; // 부모 기준
  overflow: visible; // 내부 툴팁이 삐져나와도 보이게
`;

const ScrollContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: white;
`;

const ScrollInner = styled.div`
  height: 100%;
  overflow-y: scroll;
  padding-right: 16px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const Section = styled.section`
  margin-bottom: 24px;
`;

//아크패시브 레이아웃
const PassiveGroup = styled.div`
  margin-bottom: 24px;
`;

const PassiveTitle = styled.h4`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const PassiveList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PassiveItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }

  .text {
    font-size: 13px;
    color: #333;
  }
`;

//스킬 레이아웃
const SkillList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  list-style: none;
`;

const SkillItem = styled.li`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 16px;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const LevelText = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: #ffa726; /* 주황색 강조 */
  margin-bottom: 2px;
`;

const SkillName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #222;
  white-space: nowrap;
`;

const TripodMatrix = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: auto;
`;

const TripodRow = styled.div<{ slotCount: number }>`
  display: flex;
  gap: 6px;
  justify-content: ${({ slotCount }) => {
    if (slotCount === 1) return "center";
    if (slotCount === 2) return "center";
    return "flex-start";
  }};
`;

const Dot = styled.div<{ selected: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ selected }) => (selected ? "#5fc1ff" : "#ddd")};
`;

const RuneBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: white;
  border-radius: 8px;
  padding: 4px;
  min-width: 40px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
`;

//각인 레이아웃
const EngravingList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const EngravingItem = styled(SkillItem)``;

//보석 레이아웃
const JewelGridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #1a1a1a;
  padding: 16px;
  border-radius: 8px;
`;

const ColumnTitle = styled.div`
  font-weight: bold;
  color: white;
  font-size: 15px;
  margin-bottom: 10px;
`;

const JewelWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;

  &:hover .tooltip {
    opacity: 1;
    pointer-events: auto;
  }
`;

const JewelIcon = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
`;

const JewelLevelBadge = styled.div`
  position: absolute;
  bottom: 2px;
  right: 4px;
  background: black;
  color: yellow;
  font-size: 12px;
  padding: 1px 5px;
  border-radius: 6px;
`;

const TooltipBox = styled.div`
  position: absolute;
  z-index: 9999;
  top: -90px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: black;
  font-size: 12px;
  border-radius: 6px;
  padding: 10px;
  width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  z-index: 10;
`;

const CloseButton = styled.button`
  display: block;
  margin: 0 auto;
  padding: 10px 20px;
  font-weight: bold;
  border: none;
  background-color: #0077cc;
  color: white;
  border-radius: 8px;
  cursor: pointer;
`;

interface Props {
  characterName: string;
  onClose: () => void;
}

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://raidcalculate.onrender.com/api"
    : "http://localhost:5000/api";

// 공통 요청 함수
const fetchCharacterData = async (
  characterName: string,
  endpoint: string
): Promise<any | null> => {
  try {
    const res = await axios.get(`${BASE_URL}/characters/${endpoint}`, {
      params: { name: characterName },
    });
    return res.data;
  } catch (err) {
    console.error(`${endpoint} 데이터 요청 실패`, err);
    return null;
  }
};

//보석 요청 함수
const fetchEquippedGems = async (characterName: string): Promise<any[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/characters/gems`, {
      params: { name: characterName },
    });
    return res.data.Gems || [];
  } catch (err) {
    console.error("보석 정보 실패", err);
    return [];
  }
};

const CharacterDetailModal: React.FC<Props> = ({ characterName, onClose }) => {
  const [arkPassive, setArkPassive] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [engravings, setEngravings] = useState<any[]>([]);
  const [jewels, setJewels] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const passive = await fetchCharacterData(characterName, "arkpassive");
      const skillRes = await fetchCharacterData(characterName, "combat-skills");
      const engravingRes = await fetchCharacterData(
        characterName,
        "engravings"
      );
      const gemRes = await fetchEquippedGems(characterName);

      // case 2: 배열 형태 (그냥 바로 할당)
      if (Array.isArray(skillRes)) {
        setSkills(skillRes);
      } else {
        setSkills([]);
      }

      setArkPassive(passive);
      setEngravings(engravingRes?.Engravings || []);
      setJewels(gemRes || []);
    };

    fetchAll();
  }, [characterName]);

  const JewelGrid = ({ jewels }: { jewels: any[] }) => {
    const sorted = [...jewels].sort(
      (a, b) => parseInt(b.Level) - parseInt(a.Level)
    );

    const damageJewels = sorted
      .filter((j) => ["멸화", "겁화"].some((k) => j.Name.includes(k)))
      .slice(0, 8);
    const cooldownJewels = sorted
      .filter((j) => ["홍염", "작열"].some((k) => j.Name.includes(k)))
      .slice(0, 8);

    const renderJewel = (jewel: any, i: number) => {
      const level = jewel.Level;
      const tooltipMatch = jewel.Tooltip?.match(
        /(.*?)(피해|재사용 대기시간.*?)<br\/>.*?(기본 공격력.*?)<\/div>/i
      );

      const parseTooltip = (tooltip: string) => {
        const jewelNameMatch = tooltip.match(/레벨\s(.+?)<\/FONT>/);
        const jewelName = jewelNameMatch?.[1]?.trim() || "보석";

        const skillMatch = tooltip.match(/>(.*?)\s피해|재사용 대기시간/);
        const skillName = skillMatch?.[1]?.trim() || "";

        const baseAtkMatch = tooltip.match(/기본 공격력.*?([\d.]+)%/);
        const baseAttack = baseAtkMatch
          ? `기본 공격력 ${baseAtkMatch[1]}% 증가`
          : "";

        return {
          title: jewelName,
          skill: skillName,
          base: baseAttack,
        };
      };

      const data = parseTooltip(jewel.Tooltip);

      return (
        <JewelWrapper
          key={i}
          style={{ background: getGradeBackground(jewel.Grade) }}
        >
          <TooltipBox>
            <strong>{data.title}</strong>
            <div style={{ marginTop: 4 }}>{data.skill}</div>
            {data.base && (
              <div style={{ color: "#ffa726", marginTop: 4 }}>{data.base}</div>
            )}
          </TooltipBox>

          <JewelIcon src={jewel.Icon} />
          <JewelLevelBadge>{level}</JewelLevelBadge>
        </JewelWrapper>
      );
    };

    return (
      <JewelGridWrapper>
        <Column>
          <ColumnTitle>피해</ColumnTitle>
          {damageJewels.map(renderJewel)}
        </Column>
        <Column>
          <ColumnTitle>재사용 대기시간</ColumnTitle>
          {cooldownJewels.map(renderJewel)}
        </Column>
      </JewelGridWrapper>
    );
  };

  const getGradeBackground = (grade: string): string => {
    switch (grade) {
      case "일반":
        return "linear-gradient(135deg, #232323, #575757)";
      case "고급":
        return "linear-gradient(135deg, #261331, #480d5d)";
      case "희귀":
        return "linear-gradient(135deg, #111f2c, #113d5d)";
      case "영웅":
        return "linear-gradient(135deg, #261331, #480d5d)";
      case "전설":
        return "linear-gradient(135deg, #362003, #9e5f04)";
      case "유물":
        return "linear-gradient(135deg, #341a09, #a24006)";
      case "고대":
        return "linear-gradient(135deg, #3d3325, #dcc999)";
      case "에스더":
        return "linear-gradient(135deg, #0c2e2c, #2faba8)";
      default:
        return "linear-gradient(135deg, #444, #777)"; // fallback
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <DetailLayout>
          <InfoCard>
            <Section>
              <h3>🔷 각인</h3>
              {engravings.length > 0 ? (
                <EngravingList>
                  {engravings.map((e, i) => (
                    <EngravingItem key={i}>
                      <img src={e.Icon} alt={e.Name} />
                      <div>
                        {e.Name} (Lv.{e.Level})
                      </div>
                    </EngravingItem>
                  ))}
                </EngravingList>
              ) : (
                <p>각인 정보 없음</p>
              )}
            </Section>
          </InfoCard>

          <ScrollableInfoCard style={{ width: "300px" }}>
            <ScrollContainer>
              <ScrollInner>
                <Section>
                  {["진화", "깨달음", "도약"].map((type) => {
                    const matched = arkPassive?.Effects?.filter(
                      (effect: { Name: string }) => effect.Name === type
                    );
                    return (
                      matched &&
                      matched.length > 0 && (
                        <PassiveGroup key={type}>
                          <PassiveTitle>{type}</PassiveTitle>
                          <PassiveList>
                            {matched.map(
                              (
                                effect: {
                                  Description: {
                                    match: (arg0: RegExp) => string[];
                                  };
                                  Icon: string | undefined;
                                },
                                idx: React.Key | null | undefined
                              ) => {
                                const tier =
                                  effect.Description?.match(/(\d)티어/)?.[1] ??
                                  "-";
                                const nameMatch = effect.Description?.match(
                                  /<\/FONT>\s*\d티어\s*<FONT[^>]*>([^<]+)/
                                );
                                const passiveName =
                                  nameMatch?.[1] ?? "이름 없음";

                                return (
                                  <PassiveItem key={idx}>
                                    <img src={effect.Icon} alt={passiveName} />
                                    <div className="text">
                                      {tier}티어
                                      <LevelText>{passiveName}</LevelText>
                                    </div>
                                  </PassiveItem>
                                );
                              }
                            )}
                          </PassiveList>
                        </PassiveGroup>
                      )
                    );
                  })}
                </Section>
              </ScrollInner>
            </ScrollContainer>
          </ScrollableInfoCard>

          {/*아크패시브, 각인, 보석*/}
          <ScrollableInfoCard style={{ width: "300px" }}>
            <ScrollContainer>
              <ScrollInner>
                <Section>
                  <h3>💎 장착 보석</h3>
                  {jewels.length > 0 ? (
                    <JewelGrid jewels={jewels} />
                  ) : (
                    <p>보석 정보 없음</p>
                  )}
                </Section>
              </ScrollInner>
            </ScrollContainer>
          </ScrollableInfoCard>

          {/*스킬*/}
          <ScrollableInfoCard>
            <ScrollContainer>
              <ScrollInner>
                <Section>
                  <h3>🌀 전투 스킬</h3>
                  <SkillList>
                    {skills
                      .filter((skill: any) => skill.Level >= 2 || skill.Rune)
                      .sort((a: any, b: any) => b.Level - a.Level)
                      .map((skill: any, i: number) => (
                        <SkillItem key={i}>
                          {/* 아이콘 + 텍스트 */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <img src={skill.Icon} alt={skill.Name} />
                            <TextBlock>
                              <LevelText>Lv.{skill.Level}</LevelText>
                              <SkillName>{skill.Name}</SkillName>
                            </TextBlock>
                          </div>

                          {/* 트라이포드 */}
                          <TripodMatrix>
                            {[0, 1, 2].map((tier) => {
                              const tierTripods =
                                skill.Tripods?.filter(
                                  (t: any) => t.Tier === tier
                                ) || [];
                              const sortedSlots = [...tierTripods].sort(
                                (a, b) => a.Slot - b.Slot
                              );
                              return (
                                <TripodRow
                                  key={tier}
                                  slotCount={sortedSlots.length}
                                >
                                  {sortedSlots.map((tripod, idx) => (
                                    <Dot
                                      key={idx}
                                      selected={tripod.IsSelected}
                                    />
                                  ))}
                                </TripodRow>
                              );
                            })}
                          </TripodMatrix>

                          {/* 룬 */}
                          <RuneBox
                            style={{
                              background: skill.Rune
                                ? getGradeBackground(skill.Rune.Grade)
                                : "linear-gradient(135deg, #444, #777)",
                            }}
                          >
                            {skill.Rune ? (
                              <>
                                <img
                                  src={skill.Rune.Icon}
                                  alt={skill.Rune.Name}
                                />
                                <div>{skill.Rune.Name}</div>
                              </>
                            ) : (
                              <>
                                <div style={{ height: 32 }} />
                                <div>&nbsp;</div>
                              </>
                            )}
                          </RuneBox>
                        </SkillItem>
                      ))}
                  </SkillList>
                </Section>
              </ScrollInner>
            </ScrollContainer>
          </ScrollableInfoCard>
        </DetailLayout>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalBox>
    </Overlay>
  );
};

export default CharacterDetailModal;
