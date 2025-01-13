import React, { createContext, useContext, useEffect, useState } from "react";

type CharacterData = {
  CharacterName: string;
  ServerName: string;
  ItemAvgLevel: string;
};

interface GoldCalcContextProps {
  tabData: Record<string, any>;
  tabCounter: number;
  setTabData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setTabCounter: React.Dispatch<React.SetStateAction<number>>;
  handleSearchComplete: (data: CharacterData[], search: string) => void;
}

export const GoldCalcContext = createContext<GoldCalcContextProps | undefined>(
  undefined
);

export const GoldCalcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTabId, setCurrentTabId] = useState<number | null>(null);

  const [tabData, setTabData] = useState<Record<string, any>>({});
  const [tabCounter, setTabCounter] = useState<number>(0);

  const handleSearchComplete = (data: CharacterData[], search: string) => {
    if (!data || data.length === 0) {
      console.warn("검색 결과가 없습니다.");
      return;
    }

    const currentTabData = JSON.parse(localStorage.getItem("tabData") || "{}");

    const newTabId = tabCounter;

    const updatedTabData = {
      ...currentTabData,
      [newTabId]: {
        characters: data,
        search,
        toggleStates: {},
        goldRewards: data.reduce((acc, char) => {
          acc[char.CharacterName] = 0;
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
    };

    localStorage.setItem("tabData", JSON.stringify(updatedTabData));
    setTabData(updatedTabData);
    setCurrentTabId(newTabId);
  };

  return (
    <GoldCalcContext.Provider
      value={{
        tabData,
        tabCounter,
        setTabData,
        setTabCounter,
        handleSearchComplete,
      }}
    >
      {children}
    </GoldCalcContext.Provider>
  );
};

export const useGoldCalcContext = () => {
  const context = useContext(GoldCalcContext);
  if (!context) {
    throw new Error(
      "useGoldCalcContext must be used within a GoldCalcProvider"
    );
  }
  return context;
};
function setCurrentTabId(newTabId: number) {
  throw new Error("Function not implemented.");
}
function setTabModalOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}
