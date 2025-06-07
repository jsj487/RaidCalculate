import React, { useEffect, useMemo, useRef, useState } from "react";
import TooltipBox from "./TooltipBox";
import TooltipPortal from "./TooltipPortal";
import styled from "styled-components";
import axios from "axios";
import type { MatchedPairState } from "../../utils/Matching";

import { color } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

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
  overflow: visible;
  position: relative;
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
  width: 450px;
  position: relative;
  overflow: visible;
`;

const ScrollContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: white;
`;

const ScrollInner = styled.div`
  height: 100%;
  overflow-y: auto;
  padding-right: 16px;
  position: relative;

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
  grid-template-columns: 1fr auto auto auto;
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

const GemList = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
`;

const GemIcon = styled.img<{ $type: string }>`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background-color: black;
  border: 2px solid ${({ $type }) => ($type === "피해" ? "#ff5e57" : "#57a0ff")};
  object-fit: cover;
  position: relative;
`;

const GemLevelBadge = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: black;
  color: yellow;
  font-size: 10px;
  padding: 0 4px;
  border-radius: 6px;
  border: 1px solid #fff;
  pointer-events: none;
`;

const EmptyGem = styled.div<{ $type: string }>`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background-color: #444;
  opacity: 0.3;
  border: 2px solid ${({ $type }) => ($type === "피해" ? "#ff5e57" : "#57a0ff")};
`;

//각인 레이아웃
const CharacterInfoCard = styled.div`
  width: 360px;
  height: 698px;
  border-radius: 32px;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`;

const CharacterImageContainer = styled.div`
  position: relative;
  flex: 3;
  background-color: #000;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
  }
`;

const CharacterOverlayText = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  color: white;
  font-size: 14px;
  line-height: 26px;
`;

const OverlayNickname = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const OverlayLevel = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin-top: 4px;
`;

const ChartAndEngravingContainer = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  padding: 16px;
  justify-content: center;
`;

const RadarChartSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1.2;
`;

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
  font-size: 13px;
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
  bottom: 0px;
  right: 0px;
  background: black;
  color: yellow;
  font-size: 15px;
  padding: 1px 5px;
  border-radius: 6px;
  border: 1px solid #fff;
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

const ModalButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
`;

const AcceptButton = styled.button`
  background-color: #2c2c2c;
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
  padding: 10px 18px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  cursor: pointer;

  &:before {
    content: "✔ ";
    color: #00ff00;
  }

  &:hover {
    background-color: rgb(83, 83, 83);
  }
`;

const RejectButton = styled.button`
  background-color: #2c2c2c;
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
  padding: 10px 18px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  cursor: pointer;

  &:before {
    content: "✖ ";
    color: #ff3333;
  }

  &:hover {
    background-color: rgb(83, 83, 83);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.img`
  width: 800px;
  height: 800px;
`;

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

interface CharacterDetailModalProps {
  characterName?: string;
  matchedPair: MatchedPairState | null;
  isMatchedView?: boolean;
  waitingForOther?: boolean;
  loading?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onClose: () => void;
}

const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  matchedPair,
  characterName,
  onClose,
  onAccept,
  onReject,
  loading,
  isMatchedView,
  waitingForOther,
}) => {
  const [arkPassive, setArkPassive] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [engravings, setEngravings] = useState<any[]>([]);
  const [engravingData, setEngravingData] = useState<any>(null);
  const [jewels, setJewels] = useState<any[]>([]);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [hoveredTooltip, setHoveredTooltip] = useState<React.ReactNode | null>(
    null
  );
  const [profile, setProfile] = useState<any>(null);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!characterName) return;

    const fetchAll = async () => {
      const passive = await fetchCharacterData(characterName, "arkpassive");
      const skillRes = await fetchCharacterData(characterName, "combat-skills");
      const engravingRes = await fetchCharacterData(
        characterName,
        "engravings"
      );

      const gemRes = await fetchEquippedGems(characterName);
      const profile = await fetchCharacterData(characterName, "profiles");

      if (Array.isArray(skillRes)) {
        setSkills(skillRes);
      } else {
        setSkills([]);
      }
      setProfile(profile);
      setArkPassive(passive);
      setEngravingData(engravingRes);
      setEngravings(engravingRes?.Engravings || []);
      setJewels(gemRes || []);
    };

    fetchAll();
  }, [characterName]);

  const JewelGrid = ({ jewels }: { jewels: any[] }) => {
    const damageJewels = jewels
      .filter((j) => ["멸화", "겁화"].some((k) => j.Name.includes(k)))
      .sort((a, b) => {
        const getPriority = (name: string) =>
          name.includes("겁화") ? 0 : name.includes("멸화") ? 1 : 99;

        const priorityA = getPriority(a.Name);
        const priorityB = getPriority(b.Name);

        if (priorityA !== priorityB) return priorityA - priorityB;
        return parseInt(b.Level) - parseInt(a.Level); // 레벨 내림차순
      });

    const cooldownJewels = jewels
      .filter((j) => ["작열", "홍염"].some((k) => j.Name.includes(k)))
      .sort((a, b) => {
        const getPriority = (name: string) =>
          name.includes("작열") ? 0 : name.includes("홍염") ? 1 : 99;

        const priorityA = getPriority(a.Name);
        const priorityB = getPriority(b.Name);

        if (priorityA !== priorityB) return priorityA - priorityB;
        return parseInt(b.Level) - parseInt(a.Level);
      });

    const renderJewel = (jewel: any, i: number) => {
      const level = jewel.Level;

      const parseTooltip = (tooltip: any) => {
        try {
          const parsed =
            typeof tooltip === "string" ? JSON.parse(tooltip) : tooltip;

          const jewelNameMatch = parsed?.Element_000?.value?.match(
            /<FONT[^>]*>(.*?)<\/FONT>/
          );
          const jewelName = jewelNameMatch?.[1]?.trim() || "보석";

          const rawEffect = parsed?.Element_006?.value?.Element_001 || "";
          const html = rawEffect.replace(/<BR>/gi, "\n");
          const div = document.createElement("div");
          div.innerHTML = html;

          const lines =
            div.textContent
              ?.split("\n")
              .map((line) => line.trim())
              .filter(Boolean) || [];

          const skillText =
            lines.find(
              (line) =>
                line.includes("피해") || line.includes("재사용 대기시간")
            ) || "";

          const baseLine =
            lines.find((line) => line.includes("기본 공격력")) || "";

          // "포 카드" 추출 (가장 앞의 <FONT> 텍스트)
          const skillNameMatch = rawEffect.match(/<FONT[^>]*>([^<]+)<\/FONT>/);
          const coloredSkill = skillNameMatch?.[1]?.trim() || "";

          // 앞뒤 구분해서 분리 (강제적이고 안전하게)
          const prefix = skillText.split(coloredSkill)[0] ?? "";
          const suffix = skillText.split(coloredSkill)[1] ?? "";

          return {
            title: `${jewelName}의 보석`,
            prefix,
            coloredSkill,
            suffix,
            base: baseLine,
          };
        } catch (err) {
          console.warn("툴팁 파싱 실패", err);
          return {
            title: "보석",
            prefix: "",
            coloredSkill: "",
            suffix: "",
            base: "",
          };
        }
      };

      const data = parseTooltip(jewel.Tooltip);

      return (
        <JewelWrapper
          key={i}
          style={{ background: getGradeBackground(jewel.Grade) }}
          onMouseEnter={(e) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            if (tooltipTimeoutRef.current)
              clearTimeout(tooltipTimeoutRef.current);

            setHoveredRect(rect);
            setHoveredTooltip(
              <TooltipBox>
                <strong>{data.title}</strong>
                <div style={{ marginTop: 4 }}>
                  {data.prefix}
                  <span style={{ color: "#5fc1ff" }}>{data.coloredSkill}</span>
                  {data.suffix}
                </div>
                {data.base && (
                  <div style={{ color: "#ffa726", marginTop: 4 }}>
                    {data.base}
                  </div>
                )}
              </TooltipBox>
            );
          }}
          onMouseLeave={() => {
            tooltipTimeoutRef.current = setTimeout(() => {
              setHoveredRect(null);
              setHoveredTooltip(null);
            }, 100);
          }}
        >
          <JewelIcon src={jewel.Icon} />
          <JewelLevelBadge>{level}</JewelLevelBadge>
        </JewelWrapper>
      );
    };

    return (
      <JewelGridWrapper>
        <Column>
          <ColumnTitle>겁화</ColumnTitle>
          {damageJewels.map(renderJewel)}
        </Column>
        <Column>
          <ColumnTitle>작열</ColumnTitle>
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

  // 공통된 스킬명 파서
  const extractSkillName = (tooltip: any): string | null => {
    try {
      const parsed =
        typeof tooltip === "string" ? JSON.parse(tooltip) : tooltip;

      const rawEffect = parsed?.Element_006?.value?.Element_001 || "";
      const html = rawEffect.replace(/<BR>/gi, "\n");
      const div = document.createElement("div");
      div.innerHTML = html;

      const lines = div.textContent?.split("\n") || [];
      const skillLine =
        lines.find(
          (line) => line.includes("피해") || line.includes("재사용 대기시간")
        ) || "";

      // HTML 파싱 대신 텍스트 기반 정규식으로 수정
      const match = skillLine.match(
        /(\[.*?\])?\s*(.*?)\s(피해|재사용 대기시간)/
      );
      const skillName = match?.[2]?.trim();

      return skillName || null;
    } catch {
      return null;
    }
  };

  const gemMap = useMemo(() => {
    const map: Record<
      string,
      { type: "피해" | "재사용"; icon: string; level: string }[]
    > = {};

    jewels.forEach((jewel) => {
      const skillName = extractSkillName(jewel.Tooltip);
      const type =
        jewel.Name.includes("멸화") || jewel.Name.includes("겁화")
          ? "피해"
          : jewel.Name.includes("작열") || jewel.Name.includes("홍염")
          ? "재사용"
          : null;

      if (!skillName || !type) return;

      const parsed =
        typeof jewel.Tooltip === "string"
          ? JSON.parse(jewel.Tooltip)
          : jewel.Tooltip;

      const iconUrl =
        parsed?.Element_001?.value?.slotData?.iconPath || jewel.Icon;

      const level =
        parsed?.Element_004?.value?.match(/\d+/)?.[0] || jewel.Level || "?";

      if (!map[skillName]) map[skillName] = [];

      map[skillName].push({
        type,
        icon: iconUrl,
        level: level,
      });
    });

    return map;
  }, [jewels]);

  const extraGems = useMemo(() => {
    const skillNames = new Set(skills.map((s) => s.Name));

    return jewels.filter((jewel) => {
      const skillName = extractSkillName(jewel.Tooltip);
      return skillName && !skillNames.has(skillName);
    });
  }, [jewels, skills]);

  const radarData = useMemo(() => {
    if (!Array.isArray(engravingData?.ArkPassiveEffects)) return [];

    return engravingData.ArkPassiveEffects.map((e: any) => ({
      subject: e.Name,
      value: e.Level,
      grade: e.Grade || "기타",
    }));
  }, [engravingData]);

  const renderPolarLabel = (props: any) => {
    const { payload, x, y, textAnchor } = props;
    const subject = payload?.value;

    const matched = radarData.find(
      (d: { subject: any }) => d.subject === subject
    );
    const grade = matched?.grade || "기타";

    const color =
      grade === "유물"
        ? "#FF7A00"
        : grade === "전설"
        ? "#FFB200"
        : grade === "영웅"
        ? "#A772FF"
        : "#888";

    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill={color}
        fontSize={12}
        fontWeight="bold"
      >
        {subject}
      </text>
    );
  };

  useEffect(() => {
    if (!characterName) return;
    const fetchAll = async () => {
      const passive = await fetchCharacterData(characterName, "arkpassive");

      const skillRes = await fetchCharacterData(characterName, "combat-skills");

      const engravingRes = await fetchCharacterData(
        characterName,
        "engravings"
      );

      const gemRes = await fetchEquippedGems(characterName);

      // 이후 상태 반영
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

  // 💡 모달에서 matchedPair prop으로 전달받았다고 가정
  const opponent = matchedPair?.opponent ?? null;
  const myStatus = matchedPair?.status.myStatus ?? "pending";
  const otherStatus = matchedPair?.status.otherStatus ?? "pending";

  const isWaiting = myStatus === "accepted" && otherStatus === "pending";
  const isMatched = myStatus === "accepted" && otherStatus === "accepted";
  const isRejected = myStatus === "pending" && otherStatus === "rejected";

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <DetailLayout>
          {/*각인*/}
          <CharacterInfoCard>
            <CharacterImageContainer>
              {profile?.CharacterImage && (
                <img src={profile.CharacterImage} alt="캐릭터 이미지" />
              )}

              {profile && (
                <CharacterOverlayText>
                  Lv. {profile.CharacterLevel} {profile.CharacterClassName} @
                  {profile.ServerName}
                  <OverlayNickname>{profile.CharacterName}</OverlayNickname>
                  <OverlayLevel>{profile.ItemAvgLevel}</OverlayLevel>
                </CharacterOverlayText>
              )}
            </CharacterImageContainer>

            <ChartAndEngravingContainer>
              {radarData.length > 0 && (
                <RadarChartSection>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={renderPolarLabel}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 4]} />
                      <Radar
                        name="각인"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </RadarChartSection>
              )}
            </ChartAndEngravingContainer>
          </CharacterInfoCard>

          {/*아크패시브*/}
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

          {/*보석*/}
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
                      .filter((skill: any) => {
                        const gems = gemMap[skill.Name] || [];
                        return (
                          skill.Level >= 2 || skill.Rune || gems.length > 0
                        );
                      })
                      .sort((a: any, b: any) => b.Level - a.Level)
                      .map((skill: any, i: number) => {
                        const gems = gemMap[skill.Name] || [];
                        const damageGem = gems.find((g) => g.type === "피해");
                        const cooldownGem = gems.find(
                          (g) => g.type === "재사용"
                        );

                        return (
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
                            <GemList>
                              {damageGem ? (
                                <div style={{ position: "relative" }}>
                                  <GemIcon
                                    src={damageGem.icon}
                                    alt="피해"
                                    $type="피해"
                                  />
                                  <GemLevelBadge>
                                    {damageGem.level}
                                  </GemLevelBadge>
                                </div>
                              ) : (
                                <EmptyGem $type="피해" />
                              )}

                              {cooldownGem ? (
                                <div style={{ position: "relative" }}>
                                  <GemIcon
                                    src={cooldownGem.icon}
                                    alt="재사용"
                                    $type="재사용"
                                  />
                                  <GemLevelBadge>
                                    {cooldownGem.level}
                                  </GemLevelBadge>
                                </div>
                              ) : (
                                <EmptyGem $type="재사용" />
                              )}
                            </GemList>
                          </SkillItem>
                        );
                      })}
                  </SkillList>

                  {extraGems.map((jewel, i) => {
                    const parsed =
                      typeof jewel.Tooltip === "string"
                        ? JSON.parse(jewel.Tooltip)
                        : jewel.Tooltip;

                    const iconUrl =
                      parsed?.Element_001?.value?.slotData?.iconPath;

                    const raw = parsed?.Element_006?.value?.Element_001 || "";
                    const div = document.createElement("div");
                    div.innerHTML = raw.replace(/<BR>/gi, "\n");
                    const nameMatch = jewel.Name.match(
                      /<FONT[^>]*>(.*?)<\/FONT>/
                    );
                    const cleanName = nameMatch?.[1]?.trim() || "이름 없음";
                    const lines = div.textContent?.split("\n") || [];
                    const title =
                      lines.find(
                        (l) =>
                          l.includes("피해") || l.includes("재사용 대기시간")
                      ) || "기타 보석";

                    return (
                      <SkillItem
                        key={i}
                        style={{ background: getGradeBackground(jewel.Grade) }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <img src={iconUrl} alt="기타 보석" />
                          <TextBlock>
                            <LevelText>{cleanName}</LevelText>
                            <SkillName style={{ color: "white" }}>
                              {title}
                            </SkillName>
                          </TextBlock>
                        </div>

                        <TripodMatrix>
                          <div style={{ height: 32 }} />
                        </TripodMatrix>

                        <RuneBox>
                          <div style={{ height: 32 }} />
                          <div>&nbsp;</div>
                        </RuneBox>
                      </SkillItem>
                    );
                  })}
                </Section>
              </ScrollInner>
            </ScrollContainer>
          </ScrollableInfoCard>
        </DetailLayout>
        {isMatchedView ? (
          <ModalButtonRow>
            <AcceptButton onClick={onAccept}>수락</AcceptButton>
            <RejectButton onClick={onReject}>거절</RejectButton>
          </ModalButtonRow>
        ) : (
          <CloseButton onClick={onClose}>닫기</CloseButton>
        )}

        {isMatchedView &&
          matchedPair?.status.myStatus === "accepted" &&
          matchedPair?.status.otherStatus === "pending" && (
            <LoadingOverlay>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <LoadingSpinner
                  src={`${process.env.PUBLIC_URL}/img/loading.gif`}
                />
                <div
                  style={{
                    marginTop: "20px",
                    fontSize: "24px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  상대방을 기다리는 중입니다...
                </div>
              </div>
            </LoadingOverlay>
          )}
      </ModalBox>
      {hoveredRect && hoveredTooltip && (
        <TooltipPortal targetRect={hoveredRect}>{hoveredTooltip}</TooltipPortal>
      )}
    </Overlay>
  );
};

export default CharacterDetailModal;
