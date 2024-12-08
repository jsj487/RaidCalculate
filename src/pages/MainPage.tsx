import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { keyframes } from "styled-components";

import { FaUserPlus } from "react-icons/fa6"; // 아이콘 추가

import { useLayoutContext } from "../components/Layout"; // Context 가져오기
import RaidValues from "../components/RaidValue";
import RaidTable from "../components/RaidTable";
import Modal from "../components/Modal";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #383838; /* 추천 배경색 */

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const Button = styled.button`
  width: 100%; /* 부모 컨테이너의 너비를 따라감 */
  padding: 10px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const ServerList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const ServerButton = styled(Button)<{ selected: boolean }>`
  background: ${(props) => (props.selected ? "#0056b3" : "#007bff")};
`;

const CharacterRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap; /* 반응형: 카드가 줄 바꿈되도록 설정 */

  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 10px;
  }
`;

const CharacterCard = styled.div`
  width: 200px;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;

  @media (max-width: 768px) {
    width: 150px;
    padding: 8px;
  }
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 270px;
  object-fit: cover;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const CharacterName = styled.h3`
  font-size: 16px;
  margin-top: 10px;
`;

const CharacterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const ImageBox = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 8px;
  background-image: url(${process.env
    .PUBLIC_URL}/img/gold.png); /* 동적 경로 설정 */
  background-size: contain; /* 비율 유지하며 박스 크기에 맞춤 */
  background-repeat: no-repeat; /* 이미지 반복 방지 */
  background-position: center; /* 이미지 중앙 정렬 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddCharacterButton = styled(CharacterCard)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #383838;
  border: 2px dashed #ffffff; /* 점선 테두리 */
  cursor: pointer;

  &:hover {
    border-color: #ffffff6b; /* 호버 시 색상 변경 */
  }

  &:hover svg {
    color: #ffffff6b;
  }
`;

const PlusIcon = styled(FaUserPlus)`
  font-size: 48px; /* 아이콘 크기 */
  color: #ffffff;
  margin-bottom: 8px;
`;

const CharacterListModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 999;
`;

const CharacterListModal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: #2d2d2d;
  color: white;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
`;

const CharacterListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  background: #444;
  cursor: pointer; /* 클릭 가능하도록 커서 스타일 변경 */

  &:hover {
    background: #555;
  }
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  margin-left: 10px;
  cursor: pointer;
`;

const BoxContent = styled.div`
  font-size: 14px;
  color: #333;
`;

const GoldInputBox = styled.div`
  margin: 20px 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  background: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GoldInput = styled.input`
  width: 100px;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: right;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TotalGoldBox = styled.div`
  margin: 20px 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  background: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const MainPage = () => {
  const { servers, characters, selectedServer, setSelectedServer } =
    useLayoutContext(); // Context 사용

  // 기존 상태와 동일, 토글 상태를 추가
  const [toggleStates, setToggleStates] = useState<{ [key: string]: number }>(
    () => {
      const storedStates = localStorage.getItem("toggleStates");
      return storedStates ? JSON.parse(storedStates) : {};
    }
  );

  const [goldRewards, setGoldRewards] = useState<Record<string, number>>(() => {
    const storedGoldRewards = localStorage.getItem("goldRewards");
    return storedGoldRewards ? JSON.parse(storedGoldRewards) : {};
  });

  const [modalImage, setModalImage] = useState<string | null>(null);

  const [isCharacterListModalOpen, setCharacterListModalOpen] = useState(false);

  const [consumedGold, setConsumedGold] = useState<number>(() => {
    const storedConsumedGold = localStorage.getItem("consumedGold");
    return storedConsumedGold ? parseInt(storedConsumedGold, 10) : 0;
  });
  const handleConsumedGoldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setConsumedGold(value);
  };
  useEffect(() => {
    localStorage.setItem("consumedGold", consumedGold.toString());
  }, [consumedGold]);

  const [activeCharacters, setActiveCharacters] = useState<string[]>(() => {
    const storedActiveCharacters = localStorage.getItem("activeCharacters");
    if (storedActiveCharacters) {
      return JSON.parse(storedActiveCharacters);
    }
    return [...characters]
      .sort(
        (a, b) =>
          parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
          parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
      )
      .slice(0, 6)
      .map((char) => char.CharacterName);
  });

  useEffect(() => {
    localStorage.setItem("activeCharacters", JSON.stringify(activeCharacters));
  }, [activeCharacters]);

  const sortedCharacters = [...characters].sort(
    (a, b) =>
      parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
      parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
  );

  const toggleCharacterListModal = () => {
    setCharacterListModalOpen(!isCharacterListModalOpen);
  };

  const handleCharacterToggle = (characterName: string) => {
    setActiveCharacters(
      (prev) =>
        prev.includes(characterName)
          ? prev.filter((name) => name !== characterName) // 비활성화
          : [...prev, characterName] // 활성화
    );
  };

  // Local Storage 저장
  React.useEffect(() => {
    localStorage.setItem("toggleStates", JSON.stringify(toggleStates));
  }, [toggleStates]);

  React.useEffect(() => {
    localStorage.setItem("selectedServer", selectedServer || "");
  }, [selectedServer]);

  React.useEffect(() => {
    localStorage.setItem("characters", JSON.stringify(characters));
  }, [characters]);

  React.useEffect(() => {
    localStorage.setItem("goldRewards", JSON.stringify(goldRewards));
  }, [goldRewards]);

  const handleServerSelect = (server: string) => {
    setSelectedServer(server);
  };

  const filteredCharacters = activeCharacters
    .map((activeName) =>
      characters.find((char) => char.CharacterName === activeName)
    )
    .filter((char) => char) // 유효한 캐릭터만 포함
    .sort(
      (a, b) =>
        parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
        parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
    );

  useEffect(() => {
    // activeCharacters를 ItemAvgLevel 순으로 정렬
    const sortedActiveCharacters = [...activeCharacters].sort(
      (aName, bName) => {
        const charA = characters.find((char) => char.CharacterName === aName);
        const charB = characters.find((char) => char.CharacterName === bName);

        const levelA = parseFloat(charA?.ItemAvgLevel.replace(/,/g, "") || "0");
        const levelB = parseFloat(charB?.ItemAvgLevel.replace(/,/g, "") || "0");

        return levelB - levelA; // 내림차순 정렬
      }
    );

    // 상태가 실제로 변경될 때만 업데이트
    if (
      JSON.stringify(activeCharacters) !==
      JSON.stringify(sortedActiveCharacters)
    ) {
      setActiveCharacters(sortedActiveCharacters); // 정렬된 결과로 업데이트
    }
  }, [characters]); // activeCharacters 제거

  const totalGold = Object.values(goldRewards).reduce(
    (sum, reward) => sum + reward,
    0
  );

  const handleToggle = (key: string, newState: number) => {
    setToggleStates((prevStates) => {
      const updatedStates = { ...prevStates, [key]: newState };
      return updatedStates;
    });
  };

  // 골드 보상 계산 함수
  const calculateGoldRewards = () => {
    const newGoldRewards: Record<string, number> = {};

    activeCharacters.forEach((activeName) => {
      const charIndex = characters.findIndex(
        (char) => char.CharacterName === activeName
      );

      if (charIndex !== -1) {
        const totalGold = Object.keys(toggleStates).reduce((sum, key) => {
          const [raidName, raidLevel, charName, phase] = key.split("-");
          if (charName === activeName) {
            const phaseIndex = parseInt(phase, 10);
            const raidData = RaidValues[raidName]?.[raidLevel]?.[phaseIndex];

            if (raidData) {
              if (toggleStates[key] === 1) {
                sum += raidData.clearGold;
              } else if (toggleStates[key] === 2) {
                sum += raidData.bonusGold;
              }
            }
          }
          return sum;
        }, 0);

        newGoldRewards[activeName] = totalGold;
      }
    });

    console.log("New Gold Rewards:", newGoldRewards);
    setGoldRewards(newGoldRewards);
  };

  // toggleStates 변경 시 골드 계산 실행
  useEffect(() => {
    calculateGoldRewards();
  }, [toggleStates, activeCharacters]); // 의존성 배열 추가

  useEffect(() => {
    if (isCharacterListModalOpen) {
      document.body.style.overflow = "hidden"; // 스크롤 비활성화
    } else {
      document.body.style.overflow = "auto"; // 스크롤 활성화
    }

    // Cleanup: 컴포넌트 언마운트 시 스크롤 활성화
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCharacterListModalOpen]);

  const netGold = totalGold - consumedGold;

  return (
    <Container>
      {servers.length > 0 && (
        <ServerList>
          {servers.map((server) => (
            <ServerButton
              key={server}
              selected={selectedServer === server}
              onClick={() => handleServerSelect(server)}
            >
              {server}
            </ServerButton>
          ))}
        </ServerList>
      )}

      {selectedServer && (
        <>
          <CharacterRow>
            {filteredCharacters.map((char, index) => (
              <CharacterCard key={index}>
                <CharacterImage
                  src={char?.CharacterImage || "/img/default-character.png"}
                  alt={char?.CharacterName || "No Character Selected"}
                />
                <CharacterName>
                  {char?.CharacterName || "캐릭터 선택"}
                </CharacterName>
                <p>아이템 레벨: {char?.ItemAvgLevel || "N/A"}</p>
                <p>전투 레벨: {char?.CharacterLevel || "N/A"}</p>
                <p>클래스: {char?.CharacterClassName || "N/A"}</p>
                <CharacterBox>
                  <ImageBox />
                  <BoxContent>
                    골드: {goldRewards[char.CharacterName] || 0}
                  </BoxContent>
                </CharacterBox>
              </CharacterCard>
            ))}
            <AddCharacterButton onClick={toggleCharacterListModal}>
              <PlusIcon />
            </AddCharacterButton>
          </CharacterRow>

          <GoldInputBox>
            <label htmlFor="consumedGold">소비 골드:</label>
            <GoldInput
              id="consumedGold"
              value={consumedGold}
              onChange={handleConsumedGoldChange}
            />
          </GoldInputBox>

          <TotalGoldBox>총 순이익 골드: {netGold}</TotalGoldBox>
          <RaidTable
            server={selectedServer}
            characters={filteredCharacters}
            toggleStates={toggleStates}
            setToggleStates={handleToggle}
            setGoldRewards={setGoldRewards} // MainPage의 상태를 전달
            raidValues={RaidValues}
          />
        </>
      )}

      {isCharacterListModalOpen && (
        <CharacterListModalWrapper onClick={toggleCharacterListModal}>
          <CharacterListModal onClick={(e) => e.stopPropagation()}>
            <h2>캐릭터 목록</h2>
            {sortedCharacters.map((char, index) => (
              <CharacterListItem
                key={index}
                onClick={() => handleCharacterToggle(char.CharacterName)}
              >
                <div>
                  {char.CharacterName} - {char.ItemAvgLevel}
                </div>
                <Checkbox
                  checked={activeCharacters.includes(char.CharacterName)}
                  onChange={() => handleCharacterToggle(char.CharacterName)}
                  onClick={(e) => e.stopPropagation()} // 부모의 onClick 이벤트와 겹치지 않도록 방지
                />
              </CharacterListItem>
            ))}
          </CharacterListModal>
        </CharacterListModalWrapper>
      )}

      {/* 모달 렌더링 */}
      {modalImage && (
        <Modal
          image={modalImage}
          onClose={() => setModalImage(null)} // 모달 닫기
        />
      )}
    </Container>
  );
};

export default MainPage;
