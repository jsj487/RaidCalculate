import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import CryptoJS from "crypto-js";

import { FaUserPlus } from "react-icons/fa6"; // 아이콘 추가
import { IoIosArrowDown } from "react-icons/io";

import { useLayoutContext } from "../components/LayoutProvider"; // Context 가져오기
import TabModal from "../components/TabModal"; // TabModal 컴포넌트 가져오기
import { RaidValues } from "../components/RaidValues";
import RaidTable from "../components/RaidTable";
import Modal from "../components/Modal";
import { getMaterialImagePath } from "../utils/NameMap";

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
  background-color: #262626;
`;

const TabContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 탭을 왼쪽 정렬, 추가 버튼은 오른쪽 정렬 */
  margin-bottom: 10px;
  padding: 10px; /* 탭 박스의 내부 여백 */
  background-color: #333; /* 탭 박스 배경색 */
  border-radius: 8px; /* 테두리 둥글게 */
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px; /* 탭 간의 여백 */
  background-color: #444;
  border-radius: 8px;
  padding: 5px; /* 탭 박스 내부 여백 */
  overflow: hidden; /* 탭 내용이 박스를 넘지 않도록 */
`;

const TabButton = styled.button<{ isActive: boolean }>`
  color: ${(props) => (props.isActive ? "#fff" : "#aaa")};
  background-color: ${(props) => (props.isActive ? "#565656" : "#444")};
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* 텍스트와 닫기 버튼 사이의 간격 */
  border-radius: 4px; /* 탭의 각을 둥글게 */
  transition: background-color 0.2s ease; /* 호버 시 부드러운 전환 효과 */

  &:hover {
    background-color: ${(props) => (props.isActive ? "#565656" : "#3e3e3e")};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px 2px rgba(255, 255, 255, 0.3); /* 포커스 시 강조 효과 */
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`;

const AddTabButton = styled.button`
  background-color: #555;
  color: #fff;
  border: none;
  padding: 10px 13px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #666;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px 2px rgba(255, 255, 255, 0.3); /* 포커스 시 강조 효과 */
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 300px;
`;

const SelectedServer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})<{ isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #262626;
  color: white;
  border: 4px solid #444;
  border-bottom: 4px solid #444;
  border-radius: ${(props) => (props.isOpen ? "8px 8px 0 0" : "8px")};
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 260px;

  &:hover {
    background: #505050;
  }

  /* Arrow Icon 스타일링 */
  svg {
    font-size: 16px; /* 아이콘 크기 조정 */
    margin-left: 10px; /* 텍스트와 아이콘 간 간격 */
  }
`;

const ServerList = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isVisible",
})<{ isVisible: boolean }>`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #262626;
  border: ${(props) => (props.isVisible ? "4px solid #444" : "none")};
  border-top: none; /* 선택된 항목과 드롭다운 리스트 연결 */
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  div {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
    color: white;
    cursor: pointer;

    &:hover {
      background: #505050;
    }
  }
`;

const ServerItem = styled.li`
  list-style: none;
  padding: 10px 20px;
  color: white;
  cursor: pointer;

  &:hover {
    border-radius: 0 0 8px 8px;

    background: #505050;
  }
`;

const ArrowIcon = styled(IoIosArrowDown)<{ isOpen: boolean }>`
  transition: transform 0.3s ease-in-out;
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const CharacterRow = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  align-items: stretch; /* 모든 자식 요소의 height를 동일하게 맞춤 */
  flex-wrap: wrap;
  margin-top: 20px;
  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 10px;
  }
`;

const CharacterCard = styled.div`
  flex: 1; /* 부모 요소와 동일한 높이 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

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

const CardStyle = css`
  width: 500px;
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

const MaterialCard = styled.div`
  ${CardStyle}
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

const GoldAdjustmentBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  gap: 10px; /* 레이블과 입력 필드 간 간격 */
`;

const GoldLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

const AddCharacterButtonGoldView = styled.div`
  flex: 1; /* 부모 요소와 동일한 높이 설정 */
  border: 2px dashed #ccc;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    border-color: #aaa;
  }
`;

const AddCharacterButtonNormalView = styled.div`
  width: 100%;
  height: 100%;
  border: 2px dashed #ccc;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    border-color: #aaa;
  }
`;

const PlusIcon = styled(FaUserPlus)`
  font-size: 48px;
  color: #aaa;

  &:hover {
    color: #777;
  }
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

const MenuButton = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: 0;
  width: 30px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.8); /* 반투명 밝은 배경색 */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1100;
  border-radius: 0 5px 5px 0; /* 둥근 모서리 */

  &:hover {
    background-color: rgba(255, 255, 255, 1); /* 호버 시 더 밝게 */
  }

  img {
    width: 20px; /* 아이콘 크기 */
    transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
    transition: transform 0.3s ease;
  }

  /* 그림자 추가로 가시성 개선 */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
`;

const MenuPanel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? "0" : "-90vw")};
  width: 90vw;
  height: 100%;
  background-color: #2d2d2d;
  transition: left 0.3s ease-in-out;
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ContentWrapper = styled.div`
  padding: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 20px; /* 버튼 간격 */
`;

const Button = styled.button`
  background-color: #3043ff; /* 기본 색상 */
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2a39d6; /* hover 시 색상 */
  }
`;

type CharacterData = {
  CharacterName: string;
  ServerName: string;
  ItemAvgLevel: string;
  CharacterLevel?: string;
  CharacterImage?: string;
};

type TabData = {
  characters: any[]; // Replace `any` with the actual type of a character if available
  search: string;
  toggleStates: Record<string, number>;
  goldRewards: Record<string, number>;
  selectedServer: string | null;
  selectedRaid: string | null; // 추가
  servers: string[];
  activeCharacters: string[];
  charAdjustments: Record<string, { consumedGold: number; extraGold: number }>;
  materialRewards: Record<string, { clear: Material[]; bonus: Material[] }>;
  isGoldView: boolean; // 추가
};

type Material = {
  name: string;
  quantity: number;
};

const GoldCalc = ({ tabId }: { tabId: number }) => {
  /** Context 데이터 */
  const { characters, selectedServer, handleSearch } = useLayoutContext();

  const [tabData, setTabData] = useState<Record<number, any>>(() => {
    const savedData = localStorage.getItem("tabData");
    return savedData ? JSON.parse(savedData) : {};
  });

  const [tabCounter, setTabCounter] = useState<number>(() => {
    const savedData = localStorage.getItem("tabData");
    const existingTabIds = savedData
      ? Object.keys(JSON.parse(savedData)).map(Number)
      : [];
    return existingTabIds.length > 0 ? Math.max(...existingTabIds) + 1 : 0; // Start from 0 if no tabs
  });

  const [currentTabId, setCurrentTabId] = useState<number>(tabId);
  const [isTabModalOpen, setTabModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("tabData", JSON.stringify(tabData));
  }, [tabData]);

  const activeTabData: TabData = tabData[currentTabId] || {
    activeCharacters: [],
    characters: [],
    toggleStates: {},
    goldRewards: {},
    materialRewards: {},
    selectedServer: null,
    servers: [],
    charAdjustments: {},
    isGoldView: true, // 기본값 추가
  };

  const updateTabData = (key: string, value: any) => {
    setTabData((prev) => ({
      ...prev,
      [currentTabId]: {
        ...prev[currentTabId],
        [key]: value,
      },
    }));
  };

  const handleServerSelect = (server: string) => {
    updateTabData("selectedServer", server);

    const newActiveCharacters = activeTabData.characters
      .filter((char: CharacterData) => char.ServerName === server)
      .sort(
        (a, b) =>
          parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
          parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
      )
      .slice(0, 6)
      .map((char) => char.CharacterName);
    updateTabData("activeCharacters", newActiveCharacters); // Update activeCharacters in tabData
    setIsDropdownVisible(false);
  };

  const handleSearchComplete = (data: CharacterData[], search: string) => {
    if (!data || data.length === 0) {
      console.warn("No characters found in search results.");
      alert("검색 결과가 없습니다. 닉네임을 다시 확인하세요.");
      return;
    }

    // Aggregate all activeCharacters across tabs
    const allActiveCharacters = Object.values(tabData).flatMap(
      (tab) => tab.activeCharacters
    );

    // Check for duplicate characters
    const duplicateCharacter = data.find((char) =>
      allActiveCharacters.includes(char.CharacterName)
    );

    if (duplicateCharacter) {
      alert(`캐릭터는 이미 다른 탭에 추가되어 있습니다.`);
      return; // Stop processing if a duplicate is found
    }

    // Create new tab data
    const newTabId = tabCounter;
    setTabData((prev) => ({
      ...prev,
      [newTabId]: {
        characters: data,
        search,
        toggleStates: {},
        goldRewards: data.reduce((acc, char) => {
          acc[char.CharacterName] = 0; // Initialize with zero gold
          return acc;
        }, {} as Record<string, number>),
        selectedServer: null,
        servers: Array.from(new Set(data.map((char) => char.ServerName))),
        activeCharacters: data
          .sort(
            (a, b) =>
              parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
              parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
          )
          .slice(0, 6)
          .map((char) => char.CharacterName),
        charAdjustments: data.reduce((acc, char) => {
          acc[char.CharacterName] = { consumedGold: 0, extraGold: 0 };
          return acc;
        }, {} as Record<string, { consumedGold: number; extraGold: number }>),
        isGoldView: true, // 기본값 추가
      },
    }));
    setCurrentTabId(newTabId);
    setTabCounter((prev) => prev + 1);
    setTabModalOpen(false);
  };

  const deleteTab = (tabId: number) => {
    setTabData((prev) => {
      if (!prev[tabId]) return prev;

      const updatedTabData = { ...prev };
      delete updatedTabData[tabId];

      const reassignedTabData: Record<number, TabData> = {};
      let newIndex = 0;

      // 순서대로 ID를 다시 할당
      Object.keys(updatedTabData)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((id) => {
          reassignedTabData[newIndex] = updatedTabData[id];
          newIndex++;
        });

      // 현재 탭 ID가 삭제된 경우 다른 탭으로 이동
      if (!reassignedTabData[currentTabId]) {
        const remainingTabIds = Object.keys(reassignedTabData).map(Number);
        setCurrentTabId(
          remainingTabIds.length > 0 ? Math.min(...remainingTabIds) : 0
        );
      }

      return reassignedTabData;
    });
  };

  /** 상태 관리 */
  const [toggleStates, setToggleStates] = useState<{ [key: string]: number }>(
    () => {
      const storedStates = localStorage.getItem("toggleStates");
      return storedStates ? JSON.parse(storedStates) : {};
    }
  );

  const [modalImage, setModalImage] = useState<string | null>(null);

  const [isCharacterListModalOpen, setCharacterListModalOpen] = useState(false);

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

  useEffect(() => {
    if (!Object.keys(tabData).length) {
      console.warn("No TabData available. Initialize with default values.");
    }
  }, [tabData]);

  /**useEffect */
  useEffect(() => {
    const savedTabId = localStorage.getItem("currentTabId");
    if (savedTabId !== null) {
      setCurrentTabId(JSON.parse(savedTabId));
    } else {
      setCurrentTabId(0); // 저장된 값이 없을 때만 초기화
    }
  }, []);

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
    if (activeTabData?.toggleStates) {
      const updatedGoldRewards = calculateGoldRewards(
        activeTabData?.toggleStates || {}
      );

      updateTabData("goldRewards", updatedGoldRewards);
    } else {
      console.warn("toggleStates is undefined or invalid.");
    }
  }, [activeTabData?.toggleStates]);

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

  /** 이벤트 핸들러 */
  const handleImageClick = (image: string) => {
    setModalImage(image);
  };

  const toggleCharacterListModal = () => {
    setCharacterListModalOpen(!isCharacterListModalOpen);
  };

  const handleCharacterToggle = (characterName: string) => {
    const updatedActiveCharacters = activeTabData.activeCharacters.includes(
      characterName
    )
      ? activeTabData.activeCharacters.filter((name) => name !== characterName)
      : [...activeTabData.activeCharacters, characterName];

    updateTabData("activeCharacters", updatedActiveCharacters); // Update activeCharacters in tabData
  };

  const handleAdjustmentChange = (
    charName: string,
    type: "consumedGold" | "extraGold",
    value: number
  ) => {
    const updatedCharAdjustments = {
      ...activeTabData.charAdjustments,
      [charName]: {
        ...(activeTabData.charAdjustments[charName] || {
          consumedGold: 0,
          extraGold: 0,
        }),
        [type]: value,
      },
    };

    updateTabData("charAdjustments", updatedCharAdjustments);
  };

  const filteredModalCharacters = (activeTabData?.characters || [])
    .filter(
      (char: CharacterData) =>
        char?.ServerName === activeTabData?.selectedServer
    )
    .sort(
      (a, b) =>
        parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
        parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
    );

  const calculateGoldRewards = (
    toggleStates: Record<string, number>
  ): Record<string, number> => {
    if (!Array.isArray(activeTabData?.activeCharacters)) {
      console.warn("activeCharacters is undefined or not an array.");
      return {};
    }

    return activeTabData.activeCharacters.reduce((acc, charName) => {
      const raidGold = Object.keys(toggleStates || {}).reduce((sum, key) => {
        const [raidName, raidLevel, charNameInKey, phase] = key.split("-");
        if (charNameInKey === charName) {
          const phaseIndex = parseInt(phase, 10);
          const raidData = Object.values(RaidValues || {}).reduce(
            (found, category) =>
              found || category?.[raidName]?.[raidLevel]?.phases?.[phaseIndex],
            undefined as { clearGold?: number; bonusGold?: number } | undefined
          );

          if (raidData) {
            if (toggleStates[key] === 1) sum += raidData.clearGold || 0;
            else if (toggleStates[key] === 2) sum += raidData.bonusGold || 0;
          }
        }
        return sum;
      }, 0);

      acc[charName] = raidGold;
      return acc;
    }, {} as Record<string, number>);
  };

  useEffect(() => {
    const updatedRewards = calculateGoldRewards(activeTabData.toggleStates);
  }, [activeTabData.toggleStates]);

  // toggleStates 변경 시 골드 계산 실행

  function formatNumberWithCommas(value: number | undefined | null): string {
    if (value == null || isNaN(Number(value))) return "0"; // undefined, null, NaN 방어
    return value.toLocaleString(); // 숫자를 ,로 구분
  }

  const totalGold = (activeTabData?.activeCharacters || []).reduce(
    (sum, charName) => {
      const raidGold = activeTabData?.goldRewards?.[charName] || 0;
      const consumedGold =
        activeTabData?.charAdjustments?.[charName]?.consumedGold || 0;
      const extraGold =
        activeTabData?.charAdjustments?.[charName]?.extraGold || 0;

      return sum + raidGold - consumedGold + extraGold;
    },
    0
  );

  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const displayedCharacters = (activeTabData?.characters || [])
    .filter(
      (char: CharacterData) =>
        (activeTabData?.activeCharacters || []).includes(char?.CharacterName) &&
        char?.ServerName === activeTabData?.selectedServer
    )
    .sort(
      (a, b) =>
        parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
        parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
    );

  // Functions for RaidTable
  const handleSetToggleStates = (key: string, newState: number) => {
    const updatedToggleStates = {
      ...activeTabData.toggleStates,
      [key]: newState,
    };

    // Update toggleStates in TabData
    updateTabData("toggleStates", updatedToggleStates);

    // Update goldRewards
    const updatedGoldRewards = calculateGoldRewards(updatedToggleStates);
    updateTabData("goldRewards", updatedGoldRewards);

    // Update materialRewards
    const updatedMaterialRewards =
      calculateMaterialRewards(updatedToggleStates);
    console.log("Updated Material Rewards:", updatedMaterialRewards);
    updateTabData("materialRewards", updatedMaterialRewards);
  };

  const handleSetGoldRewards: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  > = (newRewards) => {
    if (typeof newRewards === "function") {
      const updatedRewards = newRewards(activeTabData.goldRewards);
      updateTabData("goldRewards", updatedRewards);
    } else {
      updateTabData("goldRewards", newRewards);
    }
  };

  // Synchronize tabData with LocalStorage
  useEffect(() => {
    localStorage.setItem("tabData", JSON.stringify(tabData));
  }, [JSON.stringify(tabData)]);

  // Synchronize toggleStates with LocalStorage
  useEffect(() => {
    localStorage.setItem("toggleStates", JSON.stringify(toggleStates));
  }, [JSON.stringify(toggleStates)]);

  const resetToggleStates = () => {
    if (window.confirm("정말 모두 초기화 하시나요?")) {
      setTabData((prev) => {
        if (!prev[currentTabId]) {
          console.warn("Current tab data not found during reset.");
          return prev;
        }
        return {
          ...prev,
          [currentTabId]: {
            ...prev[currentTabId],
            toggleStates: {},
          },
        };
      });
    }
  };

  useEffect(() => {
    const updatedMaterialRewards = calculateMaterialRewards(
      activeTabData.toggleStates
    );
    updateTabData("materialRewards", updatedMaterialRewards);
  }, [activeTabData.toggleStates]);

  const resetChaToggleStates = (charName: string) => {
    setTabData((prev) => ({
      ...prev,
      [currentTabId]: {
        ...prev[currentTabId],
        toggleStates: Object.keys(prev[currentTabId].toggleStates).reduce(
          (acc, key) => {
            const [, , keyCharName] = key.split("-");
            if (keyCharName !== charName) {
              acc[key] = prev[currentTabId].toggleStates[key];
            }
            return acc;
          },
          {} as Record<string, number>
        ),
        goldRewards: {
          ...prev[currentTabId].goldRewards,
          [charName]: 0,
        },
      },
    }));
  };

  useEffect(() => {
    // If no tab is currently selected or the current tab is invalid, set the first tab as active
    if (currentTabId === null || !tabData[currentTabId]) {
      const firstTabId = Object.keys(tabData).map(Number)[0]; // Get the first tab ID
      if (firstTabId !== undefined) {
        setCurrentTabId(firstTabId); // Set the first tab as active
      }
    }
  }, [tabData, currentTabId]);

  const toggleView = () => {
    setTabData((prev) => {
      // 현재 탭 데이터가 없는 경우 그대로 반환
      if (!prev[currentTabId]) return prev;

      return {
        ...prev,
        [currentTabId]: {
          ...prev[currentTabId],
          isGoldView: !prev[currentTabId].isGoldView, // 현재 탭의 isGoldView 값을 토글
        },
      };
    });
  };

  const calculateMaterialRewards = (
    toggleStates: Record<string, number> = {} // 기본값 설정
  ): Record<string, { clear: Material[]; bonus: Material[] }> => {
    const materialRewards: Record<
      string,
      { clear: Material[]; bonus: Material[] }
    > = {};

    // toggleStates가 유효한 객체인지 확인
    if (!toggleStates || typeof toggleStates !== "object") {
      console.warn(
        "calculateMaterialRewards: 유효하지 않은 toggleStates가 전달되었습니다."
      );
      return materialRewards; // 빈 값을 반환하여 에러 방지
    }

    Object.entries(toggleStates).forEach(([key, state]) => {
      const [raidName, raidLevel, charName, phaseIndex] = key.split("-");
      if (!charName || state === 0) return;

      // RaidValues에서 해당 데이터를 가져옴
      const phase = Object.values(RaidValues || {}).flatMap((category) =>
        Object.values(category?.[raidName]?.[raidLevel]?.phases || [])
      )[parseInt(phaseIndex, 10)];

      if (!phase) return;

      // 해당 캐릭터의 초기값 생성
      if (!materialRewards[charName]) {
        materialRewards[charName] = { clear: [], bonus: [] };
      }

      // toggleStates 값에 따라 clear 또는 bonus 데이터를 추가
      if (state === 1) {
        materialRewards[charName].clear.push(...(phase.clearMaterials || []));
      } else if (state === 2) {
        materialRewards[charName].clear.push(...(phase.clearMaterials || []));
        materialRewards[charName].bonus.push(...(phase.bonusMaterials || []));
      }
    });

    return materialRewards;
  };

  // 암호화 함수
  const encryptData = (data: Record<number, any>): string => {
    const secretKey = "your-secret-key";
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  };

  // 복호화 함수
  const decryptData = (encryptedData: string): TabData => {
    const secretKey = "your-secret-key";
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const handleCopyTabData = () => {
    const encryptedData = encryptData(tabData); // 암호화
    navigator.clipboard.writeText(encryptedData).then(() => {
      alert("Tab 데이터가 클립보드에 복사되었습니다!");
    });
  };

  const handleImportTabData = () => {
    const inputData = prompt("암호화된 Tab 데이터를 붙여넣으세요:");
    if (!inputData) return;

    try {
      const decryptedData = decryptData(inputData); // 복호화
      setTabData(decryptedData); // TabData 상태 업데이트
      localStorage.setItem("tabData", JSON.stringify(decryptedData)); // LocalStorage 동기화
      alert("Tab 데이터가 성공적으로 가져와졌습니다!");
    } catch (error) {
      alert("데이터 가져오기에 실패했습니다. 입력값을 확인해주세요.");
    }
  };

  useEffect(() => {
    if (activeTabData?.toggleStates) {
      const updatedMaterialRewards = calculateMaterialRewards(
        activeTabData.toggleStates
      );
      updateTabData("materialRewards", updatedMaterialRewards);
    }
  }, [activeTabData?.toggleStates]);

  const openSearchModal = () => {
    console.log("openSearchModal triggered");
    setTabModalOpen(true); // Open the modal for searching
  };

  useEffect(() => {
    console.log("isTabModalOpen state:", isTabModalOpen);
  }, [isTabModalOpen]);

  return (
    <Container>
      <TabContainerWrapper>
        <TabContainer>
          {Object.keys(tabData)
            .map(Number)
            .filter((tabId) => tabData[tabId]?.characters?.length > 0) // Only render tabs with valid characters
            .sort((a, b) => a - b)
            .map((tabId) => (
              <TabButton
                key={tabId}
                isActive={currentTabId === tabId}
                onClick={() => setCurrentTabId(tabId)}
              >
                {tabData[tabId]?.search || `Tab ${tabId}`}
                <CloseButton
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTab(tabId);
                  }}
                >
                  &times; {/* X icon */}
                </CloseButton>
              </TabButton>
            ))}
        </TabContainer>
        <AddTabButton onClick={openSearchModal}>+</AddTabButton>

        {/* New Toggle Button Placement */}
        <div
          style={{
            position: "absolute", // Position it relative to the container
            right: "50px", // Distance from the right edge
            top: "16%", // Vertically center it
            transform: "translateY(-50%)", // Adjust for perfect centering
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px", // Space between text and toggle
            color: tabData[currentTabId]?.isGoldView ? "#565656" : "#fff",
          }}
        >
          <div
            style={{
              margin: "10px 0px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#fff", fontWeight: "bold" }}>
              {tabData[currentTabId]?.isGoldView ? "골드 보기" : "재료 보기"}
            </span>
            <div
              onClick={toggleView} // Keeps your existing functionality
              style={{
                marginLeft: "20px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: tabData[currentTabId]?.isGoldView
                  ? "flex-start"
                  : "flex-end",
                width: "60px", // Adjust width as needed
                height: "30px", // Adjust height as needed
                backgroundColor: tabData[currentTabId]?.isGoldView
                  ? "#565656"
                  : "#fff",
                borderRadius: "15px", // Ensures a pill shape
                cursor: "pointer",
                position: "relative",
                transition:
                  "background-color 0.3s ease, justify-content 0.3s ease",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: tabData[currentTabId]?.isGoldView ? "5px" : "30px", // Adjust knob position
                  top: "5px",
                  width: "20px", // Adjust knob size
                  height: "20px",
                  backgroundColor: tabData[currentTabId]?.isGoldView
                    ? "#fff"
                    : "#565656",
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  transition: "left 0.3s ease",
                }}
              />
            </div>
          </div>
          <ButtonWrapper>
            <Button onClick={handleCopyTabData}>Tab 데이터 복사</Button>
            <Button onClick={handleImportTabData}>Tab 데이터 가져오기</Button>
          </ButtonWrapper>
        </div>
      </TabContainerWrapper>

      <DropdownContainer>
        <SelectedServer onClick={toggleDropdown} isOpen={isDropdownVisible}>
          <span>
            {activeTabData.selectedServer
              ? activeTabData.selectedServer
              : "서버를 선택 해 주세요..."}
          </span>
          <ArrowIcon isOpen={isDropdownVisible} />
        </SelectedServer>

        <ServerList isVisible={isDropdownVisible}>
          {(activeTabData?.servers || []).length > 0 ? (
            activeTabData.servers
              .filter(
                (server) =>
                  typeof server === "string" &&
                  server !== activeTabData?.selectedServer
              )
              .map((server) => (
                <ServerItem
                  key={server}
                  onClick={() => handleServerSelect(server)}
                >
                  {server}
                </ServerItem>
              ))
          ) : (
            <p>No servers available</p>
          )}
        </ServerList>
      </DropdownContainer>

      {activeTabData.selectedServer && displayedCharacters.length > 0 && (
        <>
          {(tabData[currentTabId]?.isGoldView ?? true) && (
            <CharacterRow>
              {displayedCharacters.map(
                (
                  char: {
                    CharacterImage: any;
                    CharacterName: string;
                    ItemAvgLevel: any;
                    CharacterLevel: any;
                  },
                  index: React.Key | null | undefined
                ) => (
                  <CharacterCard key={index}>
                    <CharacterImage
                      src={char?.CharacterImage || "/img/default-character.png"}
                      alt={char?.CharacterName || "No Character Selected"}
                      onClick={() =>
                        handleImageClick(char?.CharacterImage || "")
                      }
                    />
                    <CharacterName>
                      {char?.CharacterName || "No Name"}
                    </CharacterName>
                    <p>
                      <strong>아이템 레벨:</strong>{" "}
                      {char?.ItemAvgLevel || "N/A"}
                    </p>
                    <p>
                      <strong>전투 레벨:</strong>{" "}
                      {char?.CharacterLevel || "N/A"}
                    </p>

                    <GoldAdjustmentBox>
                      <GoldLabel htmlFor={`extraGold-${char.CharacterName}`}>
                        추가골드
                      </GoldLabel>
                      <GoldInput
                        id={`extraGold-${char.CharacterName}`}
                        value={formatNumberWithCommas(
                          activeTabData.charAdjustments[char.CharacterName]
                            ?.extraGold || 0
                        )}
                        onChange={(e) => {
                          const value = parseInt(
                            e.target.value.replace(/,/g, ""),
                            10
                          );
                          handleAdjustmentChange(
                            char.CharacterName,
                            "extraGold",
                            isNaN(value) ? 0 : value
                          );
                        }}
                      />
                    </GoldAdjustmentBox>

                    <GoldAdjustmentBox>
                      <GoldLabel htmlFor={`consumedGold-${char.CharacterName}`}>
                        소비골드
                      </GoldLabel>
                      <GoldInput
                        id={`consumedGold-${char.CharacterName}`}
                        value={formatNumberWithCommas(
                          activeTabData.charAdjustments[char.CharacterName]
                            ?.consumedGold || 0
                        )}
                        onChange={(e) => {
                          const value = parseInt(
                            e.target.value.replace(/,/g, ""),
                            10
                          );
                          handleAdjustmentChange(
                            char.CharacterName,
                            "consumedGold",
                            isNaN(value) ? 0 : value
                          );
                        }}
                      />
                    </GoldAdjustmentBox>

                    <CharacterBox>
                      <ImageBox />
                      <BoxContent>
                        골드:{" "}
                        <strong>
                          {formatNumberWithCommas(
                            (activeTabData.goldRewards[char.CharacterName] ||
                              0) -
                              (activeTabData.charAdjustments[char.CharacterName]
                                ?.consumedGold || 0) +
                              (activeTabData.charAdjustments[char.CharacterName]
                                ?.extraGold || 0)
                          )}
                        </strong>
                      </BoxContent>
                      {/* Other UI elements */}
                    </CharacterBox>
                  </CharacterCard>
                )
              )}
              <AddCharacterButtonGoldView onClick={toggleCharacterListModal}>
                <PlusIcon />
              </AddCharacterButtonGoldView>
            </CharacterRow>
          )}

          {!(tabData[currentTabId]?.isGoldView ?? true) && (
            <CharacterRow>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)", // 한 행에 3개의 열
                  gap: "20px", // 각 카드 간의 간격
                  padding: "20px", // 전체 레이아웃의 내부 여백
                }}
              >
                {displayedCharacters.map((char, index) => (
                  <MaterialCard
                    key={index}
                    style={{
                      display: "flex",
                      gap: "20px",
                      padding: "20px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Left Section: Image and Character Name */}
                    <div
                      style={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <CharacterImage
                        src={
                          char?.CharacterImage || "/img/default-character.png"
                        }
                        alt={char?.CharacterName || "No Character Selected"}
                        onClick={() =>
                          handleImageClick(char?.CharacterImage || "")
                        }
                        style={{
                          width: "240px",
                          height: "240px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginBottom: "10px",
                        }}
                      />
                      <CharacterName
                        style={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        {char?.CharacterName || "No Name"}
                        <p>
                          <strong>아이템 레벨:</strong>{" "}
                          {char?.ItemAvgLevel || "N/A"}
                        </p>
                      </CharacterName>
                    </div>

                    {/* Right Section: Raid Materials and Gold Adjustments */}
                    <div
                      style={{
                        flex: "2",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Materials Section */}
                      <div>
                        <h4 style={{ marginBottom: "10px" }}>획득 재화:</h4>
                        <ul
                          style={{
                            margin: "0",
                            padding: "20px",
                            listStyle: "none",
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                            backgroundColor: "#f7f7f7",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {(() => {
                            // Combine clearMaterials and bonusMaterials
                            const materials = [
                              ...(activeTabData.materialRewards?.[
                                char.CharacterName
                              ]?.clear || []),
                              ...(activeTabData.materialRewards?.[
                                char.CharacterName
                              ]?.bonus || []),
                            ];

                            // Aggregate materials by name
                            const aggregatedMaterials = materials.reduce(
                              (acc, material) => {
                                const existingMaterial = acc.find(
                                  (m) => m.name === material.name
                                );
                                if (existingMaterial) {
                                  existingMaterial.quantity +=
                                    material.quantity;
                                } else {
                                  acc.push({ ...material });
                                }
                                return acc;
                              },
                              [] as { name: string; quantity: number }[]
                            );

                            return aggregatedMaterials.map((material, i) => {
                              const imagePath = getMaterialImagePath(
                                material.name
                              ); // Fetch image path
                              return (
                                <li
                                  key={i}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "10px",
                                    border: "1px solid #eee",
                                    borderRadius: "8px",
                                    backgroundColor: "#f9f9f9",
                                    flex: "1 1 calc(50% - 10px)",
                                  }}
                                >
                                  {/* Material Image */}
                                  {imagePath && (
                                    <img
                                      src={imagePath}
                                      alt={material.name}
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "4px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                  {/* Material Name and Quantity */}
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <strong style={{ fontSize: "14px" }}>
                                      {material.name}
                                    </strong>
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "#555",
                                      }}
                                    >
                                      수량: {material.quantity.toLocaleString()}
                                    </span>
                                  </div>
                                </li>
                              );
                            });
                          })()}
                        </ul>
                      </div>

                      {/* Gold Adjustments */}
                      <div style={{ marginTop: "20px" }}>
                        <GoldAdjustmentBox>
                          <GoldLabel
                            htmlFor={`extraGold-${char.CharacterName}`}
                          >
                            추가골드
                          </GoldLabel>
                          <GoldInput
                            id={`extraGold-${char.CharacterName}`}
                            value={formatNumberWithCommas(
                              activeTabData.charAdjustments[char.CharacterName]
                                ?.extraGold || 0
                            )}
                            onChange={(e) => {
                              const value = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              );
                              handleAdjustmentChange(
                                char.CharacterName,
                                "extraGold",
                                isNaN(value) ? 0 : value
                              );
                            }}
                          />
                        </GoldAdjustmentBox>

                        <GoldAdjustmentBox>
                          <GoldLabel
                            htmlFor={`consumedGold-${char.CharacterName}`}
                          >
                            소비골드
                          </GoldLabel>
                          <GoldInput
                            id={`consumedGold-${char.CharacterName}`}
                            value={formatNumberWithCommas(
                              activeTabData.charAdjustments[char.CharacterName]
                                ?.consumedGold || 0
                            )}
                            onChange={(e) => {
                              const value = parseInt(
                                e.target.value.replace(/,/g, ""),
                                10
                              );
                              handleAdjustmentChange(
                                char.CharacterName,
                                "consumedGold",
                                isNaN(value) ? 0 : value
                              );
                            }}
                          />
                        </GoldAdjustmentBox>
                        <CharacterBox>
                          <ImageBox />
                          <BoxContent>
                            골드:{" "}
                            <strong>
                              {formatNumberWithCommas(
                                (activeTabData.goldRewards[
                                  char.CharacterName
                                ] || 0) -
                                  (activeTabData.charAdjustments[
                                    char.CharacterName
                                  ]?.consumedGold || 0) +
                                  (activeTabData.charAdjustments[
                                    char.CharacterName
                                  ]?.extraGold || 0)
                              )}
                            </strong>
                          </BoxContent>
                        </CharacterBox>
                      </div>
                    </div>
                  </MaterialCard>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AddCharacterButtonNormalView
                    onClick={toggleCharacterListModal}
                    style={{
                      width: "540px", // CharacterCard와 동일한 너비
                      height: "400px", // CharacterCard와 동일한 높이
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "2px dashed #ddd", // 스타일 유지
                      backgroundColor: "transparent", // 투명 배경
                      margin: "0 auto", // 가운데 정렬
                    }}
                  >
                    <PlusIcon />
                  </AddCharacterButtonNormalView>
                </div>
              </div>
            </CharacterRow>
          )}

          <TotalGoldBox>
            총 순이익 골드: {formatNumberWithCommas(totalGold)}
          </TotalGoldBox>
        </>
      )}

      {/* 사이드 메뉴 열기 버튼 */}
      <MenuButton onClick={toggleMenu} isOpen={isMenuOpen}>
        <img
          src={`${process.env.PUBLIC_URL}/img/expand_arrow.png`}
          alt="toggle menu"
        />
      </MenuButton>

      {/* 메뉴 패널 */}
      <MenuPanel isOpen={isMenuOpen}>
        <ContentWrapper>
          <RaidTable
            setToggleStates={handleSetToggleStates}
            setGoldRewards={(rewards) => handleSetGoldRewards(rewards)}
            characters={(activeTabData?.activeCharacters || []).map(
              (charName) =>
                activeTabData?.characters?.find(
                  (char) => char?.CharacterName === charName
                )
            )}
            toggleStates={activeTabData?.toggleStates || {}}
            resetToggleStates={resetToggleStates}
            resetChaToggleStates={resetChaToggleStates} // Function with parameter
            goldRewards={activeTabData?.goldRewards || {}}
            raidValues={RaidValues}
            materialRewards={activeTabData?.materialRewards || {}} // 추가
          />
        </ContentWrapper>
      </MenuPanel>

      {/* 화면 덮는 오버레이 */}
      <Overlay isOpen={isMenuOpen} onClick={toggleMenu} />

      {isCharacterListModalOpen && (
        <CharacterListModalWrapper onClick={toggleCharacterListModal}>
          <CharacterListModal onClick={(e) => e.stopPropagation()}>
            <h2>Character List</h2>
            {filteredModalCharacters.length > 0 ? (
              filteredModalCharacters.map((char, index) => (
                <CharacterListItem
                  key={index}
                  onClick={() => handleCharacterToggle(char.CharacterName)}
                >
                  <div>
                    {char.CharacterName} - {char.ItemAvgLevel}
                  </div>
                  <Checkbox
                    checked={activeTabData.activeCharacters.includes(
                      char.CharacterName
                    )}
                    onChange={() => handleCharacterToggle(char.CharacterName)}
                    onClick={(e) => e.stopPropagation()} // Prevent parent click
                  />
                </CharacterListItem>
              ))
            ) : (
              <p>No characters available for the selected server.</p>
            )}
          </CharacterListModal>
        </CharacterListModalWrapper>
      )}

      {isTabModalOpen && (
        <TabModal
          isOpen={isTabModalOpen}
          onClose={() => setTabModalOpen(false)}
          onSearchComplete={handleSearchComplete}
        />
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

export default GoldCalc;
