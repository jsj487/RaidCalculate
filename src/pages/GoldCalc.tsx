import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { keyframes } from "styled-components";

import { FaUserPlus } from "react-icons/fa6"; // 아이콘 추가
import { IoIosArrowDown } from "react-icons/io";

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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #383838; /* 추천 배경색 */

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const ServerListContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ServerList = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isCollapsed",
})<{ isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-height: ${(props) => (props.isCollapsed ? "0px" : "300px")};
  overflow: hidden;
  transition: max-height 0.6s ease-in-out;
`;

const ServerButton = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => (props.selected ? "#444" : "#383838")};
  color: white;
  border: 2px solid ${(props) => (props.selected ? "#dedede" : "#444")};
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #505050;
    transform: translateY(-2px);
  }

  &:active {
    background: #2d2d2d;
    transform: translateY(0);
  }

  span {
    font-size: 16px;
  }
`;

const CharacterCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #ccc; /* 텍스트 색상 */

  .character-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-image: url(${process.env
      .PUBLIC_URL}/img/character.png); /* 이미지 경로 */
    background-size: cover; /* 이미지를 박스에 맞춤 */
    background-position: center; /* 중앙 정렬 */
  }

  .character-count {
    display: flex;
    align-items: center; /* 숫자와 아이콘 수직 정렬 */
    justify-content: center; /* 숫자와 아이콘 수평 정렬 */
    min-width: 20px; /* 숫자의 최소 너비를 지정 */
    text-align: center; /* 숫자 가운데 정렬 */
  }
`;

const ToggleButton = styled.button<{ rotation: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.6s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #003f8a;
  }

  svg {
    font-size: 24px;
    transition: transform 0.6s ease-in-out; /* 회전 애니메이션 */
    transform: rotate(${(props) => props.rotation}deg); /* 누적 회전 */
  }
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
  cursor: pointer;

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
  transition: all 0.3s;

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
  transition: all 0.3s;
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
  animation: ${slideIn} 0.5s ease-out;
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

const GoldBoxContainer = styled.div`
  display: flex;
  gap: 20px; /* 두 박스 간 간격 */
  margin: 20px 0;
`;

const GoldBox = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  background: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px; /* 레이블과 입력 필드 간 간격 */
  justify-content: space-between; /* 레이블과 입력 필드 정렬 */
  width: fit-content;
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

const RaidTableTriggerArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 20px; /* 감지 영역 너비 */
  height: 100vh; /* 화면 전체 높이 */
  z-index: 1000;
  background: transparent; /* 보이지 않게 설정 */
  cursor: pointer;
`;

const RaidTableModalWrapper = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: ${(props) => (props.isVisible ? "0" : "-90vw")}; /* 보여질 때 위치 */
  width: 90vw; /* 레이드 테이블 너비 */
  height: 100vh;
  background-color: #2d2d2d;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 999; /* 트리거 영역보다 낮음 */
  transition: left 0.6s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow-y: hidden; /* 스크롤 숨김 */
  padding: 20px;
`;

const MainPage = () => {
  /** Context 데이터 */
  const { servers, characters, selectedServer, setSelectedServer } =
    useLayoutContext();

  /** 상태 관리 */
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
  const [extraGold, setExtraGold] = useState<number>(() => {
    const storedExtraGold = localStorage.getItem("extraGold");
    return storedExtraGold ? parseInt(storedExtraGold, 10) : 0;
  });

  const [isServerListVisible, setIsServerListVisible] = useState(true); // 서버 리스트 보이기 상태
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 상태 관리
  const [rotation, setRotation] = useState(0);

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

  const [isRaidTableVisible, setIsRaidTableVisible] = useState(false);

  useEffect(() => {
    if (isRaidTableVisible) {
      // 페이지 스크롤 비활성화
      document.body.style.overflow = "hidden";
    } else {
      // 페이지 스크롤 활성화
      document.body.style.overflow = "auto";
    }

    // 컴포넌트가 언마운트될 때 페이지 스크롤 활성화
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isRaidTableVisible]);

  const toggleRaidTable = () => {
    setIsRaidTableVisible((prev) => !prev);
  };

  /**useEffect */
  useEffect(() => {
    localStorage.setItem("consumedGold", consumedGold.toString());
  }, [consumedGold]);
  useEffect(() => {
    localStorage.setItem("extraGold", extraGold.toString());
  }, [extraGold]);

  useEffect(() => {
    localStorage.setItem("activeCharacters", JSON.stringify(activeCharacters));
  }, [activeCharacters]);
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
  useEffect(() => {
    if (selectedServer) {
      const newActiveCharacters = characters
        .filter((char) => char.ServerName === selectedServer)
        .sort(
          (a, b) =>
            parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
            parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
        )
        .slice(0, 6)
        .map((char) => char.CharacterName);

      setActiveCharacters(newActiveCharacters);
    }
  }, [selectedServer, characters]);

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

  const totalGold = Object.values(goldRewards).reduce(
    (sum, reward) => sum + reward,
    0
  );

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

  /** 이벤트 핸들러 */
  const handleImageClick = (image: string) => {
    setModalImage(image);
  };

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

  const handleServerSelect = (server: string) => {
    setSelectedServer(server);
    setIsServerListVisible(false); // 리스트 접기
    setIsAnimating(true); // 애니메이션 시작

    // 서버 변경 시 해당 서버의 캐릭터로 활성 캐릭터 초기화
    const newActiveCharacters = characters
      .filter((char) => char.ServerName === server)
      .sort(
        (a, b) =>
          parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
          parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
      )
      .slice(0, 6)
      .map((char) => char.CharacterName);

    setActiveCharacters(newActiveCharacters);
  };

  const handleToggle = (key: string, newState: number) => {
    setToggleStates((prevStates) => {
      const updatedStates = { ...prevStates, [key]: newState };
      return updatedStates;
    });
  };

  const handleToggleServerList = () => {
    setIsCollapsed((prev) => !prev); // 상태 토글
    setRotation((prev) => prev + 180); // 시계 방향으로 180도씩 증가
  };

  /** 필터링 및 계산 */
  const filteredCharacters = characters
    .filter((char) => char.ServerName === selectedServer) // 선택된 서버의 캐릭터만 필터링
    .sort(
      (a, b) =>
        parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
        parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
    )
    .filter((char) => activeCharacters.includes(char.CharacterName)); // 활성 캐릭터 필터링

  const filteredModalCharacters = characters
    .filter((char) => char.ServerName === selectedServer) // 선택된 서버의 캐릭터만 필터링
    .sort(
      (a, b) =>
        parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
        parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
    );

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

    setGoldRewards(newGoldRewards);
  };

  // toggleStates 변경 시 골드 계산 실행

  const netGold = totalGold - consumedGold + extraGold;

  const serverCharacterCounts = servers.reduce((acc, server) => {
    acc[server] = characters.filter(
      (char) => char.ServerName === server
    ).length;
    return acc;
  }, {} as { [key: string]: number });

  const handleMouseEnter = () => {
    setIsRaidTableVisible(true); // 마우스가 감지 영역에 들어오면 표시
  };

  const handleMouseLeave = () => {
    setIsRaidTableVisible(false); // 마우스가 테이블 영역을 벗어나면 숨김
  };

  return (
    <Container>
      <ServerListContainer>
        {/* 선택된 서버 */}
        {selectedServer && (
          <ServerButton
            key={selectedServer}
            selected={true}
            onClick={handleToggleServerList}
          >
            <span>{selectedServer}</span>
            <CharacterCount>
              <div className="character-icon"></div>
              <div className="character-count">
                {serverCharacterCounts[selectedServer] || 0}
              </div>
            </CharacterCount>
          </ServerButton>
        )}

        {/* 서버 리스트 */}
        <ServerList isCollapsed={isCollapsed}>
          {servers
            .filter((server) => server !== selectedServer) // 선택된 서버 제외
            .map((server) => (
              <ServerButton
                key={server}
                selected={false}
                onClick={() => handleServerSelect(server)}
              >
                <span>{server}</span>
                <CharacterCount>
                  <div className="character-icon"></div>
                  <div className="character-count">
                    {serverCharacterCounts[server] || 0}
                  </div>
                </CharacterCount>
              </ServerButton>
            ))}
        </ServerList>

        {/* 펼치기/접기 버튼 */}
        <ToggleButton onClick={handleToggleServerList} rotation={rotation}>
          <IoIosArrowDown />
        </ToggleButton>
      </ServerListContainer>

      {selectedServer && (
        <>
          <CharacterRow>
            {filteredCharacters.map((char, index) => (
              <CharacterCard key={index}>
                <CharacterImage
                  src={char?.CharacterImage || "/img/default-character.png"}
                  alt={char?.CharacterName || "No Character Selected"}
                  onClick={() => handleImageClick(char?.CharacterImage || "")}
                />
                <CharacterName>
                  {char?.CharacterName || "캐릭터 선택"}
                </CharacterName>
                <p>
                  <strong>아이템 레벨: </strong>
                  {char?.ItemAvgLevel || "N/A"}
                </p>
                <p>
                  <strong>전투 레벨: </strong>
                  {char?.CharacterLevel || "N/A"}
                </p>
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

          <GoldBoxContainer>
            <GoldBox>
              <label htmlFor="consumedGold">소비 골드:</label>
              <GoldInput
                id="consumedGold"
                value={consumedGold}
                onChange={(e) =>
                  setConsumedGold(parseInt(e.target.value, 10) || 0)
                }
              />
            </GoldBox>

            <GoldBox>
              <label htmlFor="extraGold">추가 골드:</label>
              <GoldInput
                id="extraGold"
                value={extraGold}
                onChange={(e) =>
                  setExtraGold(parseInt(e.target.value, 10) || 0)
                }
              />
            </GoldBox>
          </GoldBoxContainer>

          <TotalGoldBox>총 순이익 골드: {netGold}</TotalGoldBox>
        </>
      )}

      <RaidTableTriggerArea onMouseEnter={handleMouseEnter} />

      {/* 레이드 테이블 */}
      <RaidTableModalWrapper
        isVisible={isRaidTableVisible}
        onMouseLeave={handleMouseLeave}
      >
        <RaidTable
          server={selectedServer}
          characters={filteredCharacters}
          toggleStates={toggleStates}
          setToggleStates={handleToggle}
          setGoldRewards={setGoldRewards}
          raidValues={RaidValues}
        />
      </RaidTableModalWrapper>

      {isCharacterListModalOpen && (
        <CharacterListModalWrapper onClick={toggleCharacterListModal}>
          <CharacterListModal onClick={(e) => e.stopPropagation()}>
            <h2>캐릭터 목록</h2>
            {filteredModalCharacters.map((char, index) => (
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
