import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { keyframes } from "styled-components";

import { FaUserPlus } from "react-icons/fa6"; // 아이콘 추가
import { IoIosArrowDown } from "react-icons/io";

import { useLayoutContext } from "../components/LayoutProvider"; // Context 가져오기
import SearchBar from "../components/SearchBar";
import TabModal from "../components/TabModal"; // TabModal 컴포넌트 가져오기
import { RaidValues } from "../components/RaidValues";
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
  background-color: #383838;
`;

const TabContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Align tabs to the left and + button to the right */
  margin-bottom: 10px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 5px; /* Add spacing between tabs */
  background-color: #444;
  border-radius: 8px;
  overflow: hidden; /* Prevent overflow of tab content */
`;

const TabButton = styled.button<{ isActive: boolean }>`
  color: ${(props) => (props.isActive ? "#fff" : "#aaa")};
  background-color: ${(props) => (props.isActive ? "#565656" : "#444")};
  border: none;
  padding: 10px 20px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px; /* Space between text and X button */

  &:hover {
    background-color: ${(props) => (props.isActive ? "#565656" : "#3e3e3e")};
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
`;

const AddTabButton = styled.button`
  background-color: #565656;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-left: 10px;

  &:hover {
    background-color: #3e3e3e;
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
  background: #383838;
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
  background: #383838;
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
  servers: string[];
  activeCharacters: string[];
  charAdjustments: Record<string, { consumedGold: number; extraGold: number }>;
};

const GoldCalc = ({ tabId }: { tabId: number }) => {
  /** Context 데이터 */
  const { characters, selectedServer, handleSearch } = useLayoutContext();

  useEffect(() => {
    const storedTabData = JSON.parse(localStorage.getItem("TabData") || "{}");
    setTabData(storedTabData); // 상태 업데이트
  }, []);

  const [tabData, setTabData] = useState<Record<number, any>>(() => {
    const savedData = localStorage.getItem("tabData");
    const parsedData = savedData ? JSON.parse(savedData) : {};
    return Object.keys(parsedData).length ? parsedData : {};
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

  useEffect(() => {
    const savedTabData = localStorage.getItem("tabData");
    if (savedTabData) {
      setTabData(JSON.parse(savedTabData));
    }
  }, []);

  const activeTabData: TabData = tabData[currentTabId] || {
    activeCharacters: [],
    characters: [],
    toggleStates: {},
    goldRewards: {},
    selectedServer: null,
    servers: [],
    charAdjustments: {},
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
      },
    }));
    setCurrentTabId(newTabId);
    setTabCounter((prev) => prev + 1);
    setTabModalOpen(false);
  };

  const openSearchModal = () => {
    setTabModalOpen(true); // Open the modal for searching
  };

  const deleteTab = (tabId: number) => {
    setTabData((prev) => {
      const updatedTabData = { ...prev };
      delete updatedTabData[tabId];

      // Reassign tab IDs to keep them sequential
      const reassignedTabData: Record<number, TabData> = {};
      Object.keys(updatedTabData)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((id, index) => {
          reassignedTabData[index + 1] = updatedTabData[id];
        });

      // Adjust currentTabId if needed
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

  const [charAdjustments, setCharAdjustments] = useState<
    Record<string, { consumedGold: number; extraGold: number }>
  >(() => {
    const initialState = characters.reduce((acc, char) => {
      acc[char.CharacterName] = { consumedGold: 0, extraGold: 0 };
      return acc;
    }, {} as Record<string, { consumedGold: number; extraGold: number }>);
    const storedAdjustments = localStorage.getItem("charAdjustments");
    return storedAdjustments ? JSON.parse(storedAdjustments) : initialState;
  });

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
    if (activeTabData?.toggleStates) {
      console.log("Recalculating goldRewards for TabData...");
      const updatedGoldRewards = calculateGoldRewards(
        activeTabData?.toggleStates || {}
      );
      console.log("Updated Gold Rewards:", updatedGoldRewards);

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

    console.log("Updated charAdjustments:", updatedCharAdjustments);
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
    console.log("Toggle States Changed:", activeTabData.toggleStates);
    const updatedRewards = calculateGoldRewards(activeTabData.toggleStates);
    console.log("Recalculated Gold Rewards:", updatedRewards);
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

    // Calculate and update goldRewards based on new toggleStates
    const updatedGoldRewards = calculateGoldRewards(updatedToggleStates);
    updateTabData("goldRewards", updatedGoldRewards);

    console.log("Updated Toggle States:", updatedToggleStates);
    console.log("Updated Gold Rewards:", updatedGoldRewards);
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
      </TabContainerWrapper>

      {/* Tab Modal for Adding Accounts */}
      <TabModal
        isOpen={isTabModalOpen}
        onClose={() => setTabModalOpen(false)}
        onSearchComplete={(data, search) => handleSearchComplete(data, search)}
      />

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
                    onClick={() => handleImageClick(char?.CharacterImage || "")}
                  />
                  <CharacterName>
                    {char?.CharacterName || "No Name"}
                  </CharacterName>
                  <p>
                    <strong>아이템 레벨:</strong> {char?.ItemAvgLevel || "N/A"}
                  </p>
                  <p>
                    <strong>전투 레벨:</strong> {char?.CharacterLevel || "N/A"}
                  </p>

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

                  <CharacterBox>
                    <ImageBox />
                    <BoxContent>
                      골드:{" "}
                      <strong>
                        {formatNumberWithCommas(
                          (activeTabData.goldRewards[char.CharacterName] || 0) -
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
            <AddCharacterButton onClick={toggleCharacterListModal}>
              <PlusIcon />
            </AddCharacterButton>
          </CharacterRow>

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
