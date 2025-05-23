import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

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
  background: white;
  color: black;
  border-radius: 12px;
  padding: 24px;
  max-height: 90vh;
  overflow-y: auto;
  min-width: 600px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Section = styled.section`
  margin-bottom: 24px;
`;

const ArkPassiveBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f6f6f6;
  padding: 12px;
  border-radius: 8px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 14px;
    color: #333;
  }
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const SkillItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
  font-size: 12px;
  text-align: center;

  img {
    width: 48px;
    height: 48px;
  }
`;

const EngravingList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const EngravingItem = styled(SkillItem)``;

const JewelListContainer = styled.div`
  display: inline-block;
  background-color: #fefefe;
  border-radius: 12px;
  padding: 12px 16px;
  border: 2px solid #ccc;
  min-width: 500px;
  margin-top: 12px;
`;

const JewelRow = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

const JewelIcon = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
`;

const JewelImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`;

const JewelLevel = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 12px;
  background: black;
  color: white;
  padding: 1px 4px;
  border-radius: 6px;
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

      setArkPassive(passive);
      setSkills(skillRes?.Skills || []);
      setEngravings(engravingRes?.Engravings || []);
    };

    fetchAll();
  }, [characterName]);

  useEffect(() => {
    const fetchAll = async () => {
      console.log("🔍 캐릭터 상세 데이터 요청 시작:", characterName);

      const passive = await fetchCharacterData(characterName, "arkpassive");
      console.log("🧿 아크패시브 응답:", passive); // ✅

      const skillRes = await fetchCharacterData(characterName, "combat-skills");
      console.log("🌀 스킬 응답:", skillRes); // ✅

      const engravingRes = await fetchCharacterData(
        characterName,
        "engravings"
      );
      console.log("🔷 각인 응답:", engravingRes); // ✅

      const gemRes = await fetchEquippedGems(characterName);
      console.log("💎 보석 응답:", gemRes); // (이미 확인한 경우 생략 가능)

      setArkPassive(passive);
      setSkills(skillRes?.Skills || []);
      setEngravings(engravingRes?.Engravings || []);
      setJewels(gemRes || []);
    };

    fetchAll();
  }, [characterName]);

  const RenderJewelList = ({ jewels }: { jewels: any[] }) => {
    const filterJewelsByName = (jewels: any[], keywords: string[]): any[] => {
      return jewels
        .filter((jewel) =>
          keywords.some((keyword) => jewel.Name.includes(keyword))
        )
        .slice(0, 8); // 한 줄에 최대 8개
    };

    const damageJewels = filterJewelsByName(jewels, ["멸화", "겁화"]);
    const cooldownJewels = filterJewelsByName(jewels, ["홍염", "작열"]);

    return (
      <JewelListContainer>
        <div style={{ fontWeight: "bold", marginBottom: "6px" }}>거래 보석</div>
        <JewelRow>
          {damageJewels.map((jewel, i) => (
            <JewelIcon key={`dmg-${i}`}>
              <JewelImage src={jewel.Icon} title={jewel.Name} />
              <JewelLevel>{jewel.Level}</JewelLevel>
            </JewelIcon>
          ))}
        </JewelRow>
        <JewelRow>
          {cooldownJewels.map((jewel, i) => (
            <JewelIcon key={`cd-${i}`}>
              <JewelImage src={jewel.Icon} title={jewel.Name} />
              <JewelLevel>{jewel.Level}</JewelLevel>
            </JewelIcon>
          ))}
        </JewelRow>
      </JewelListContainer>
    );
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Title>{characterName} 상세 정보</Title>

        <Section>
          <h3>🧿 아크패시브</h3>
          {arkPassive ? (
            <ArkPassiveBox>
              <img src={arkPassive.Icon} alt={arkPassive.ArkPassiveName} />
              <div className="info">
                <div>티어: {arkPassive.Tier}</div>
                <div>이름: {arkPassive.ArkPassiveName}</div>
                <div>레벨: {arkPassive.ArkPassiveLevel}</div>
              </div>
            </ArkPassiveBox>
          ) : (
            <p>데이터 없음</p>
          )}
        </Section>

        <Section>
          <h3>🌀 전투 스킬</h3>
          {skills.length > 0 ? (
            <SkillList>
              {skills.map((skill, i) => (
                <SkillItem key={i}>
                  <img src={skill.Icon} alt={skill.Name} />
                  <div>
                    {skill.Name} (Lv.{skill.Level})
                  </div>
                </SkillItem>
              ))}
            </SkillList>
          ) : (
            <p>스킬 정보 없음</p>
          )}
        </Section>

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

        <Section>
          <h3>💎 장착 보석</h3>
          {jewels.length > 0 ? (
            <RenderJewelList jewels={jewels} />
          ) : (
            <p>보석 정보 없음</p>
          )}
        </Section>

        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalBox>
    </Overlay>
  );
};

export default CharacterDetailModal;
