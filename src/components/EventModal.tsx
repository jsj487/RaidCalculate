import { useEffect, useState } from "react";
import styled from "styled-components";
import { EventType } from "../pages/Schedule";
import { db } from "../utils/FireBase"; // Firestore 연결
import { doc, getDoc, updateDoc, getDocFromServer } from "firebase/firestore";
import { ClassIcon, ClassImage } from "../utils/NameMap";
import axios from "axios";
import React from "react";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://raidcalculate.onrender.com/api"
    : "http://localhost:5000/api";

const CharacterClassIcon = styled.img`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 32px; /* 🔹 아이콘 크기 조정 */
  height: 32px;
  z-index: 10;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.6)); /* 🔹 강조 효과 */
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
`;

const ModalContent = styled.div`
  background-color: #0c0c0c;
  padding: 20px;
  border-radius: 10px;
  min-width: 600px;
  width: auto; /* 🔹 참가자 수에 맞게 자동 조정 */
  max-width: 90vw; /* 🔹 화면 크기를 넘지 않도록 설정 */
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
  justify-content: space-between;
`;

const CharacterActionButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;

const ParticipantsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 60px; /* 🔹 파티 간 간격 */
  justify-content: center;
  margin-top: 20px;
`;

const PartyContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 🔹 2x2 그리드 (4명 배치) */
  gap: 20px;
`;

const ParticipantCard = styled.div<{ rowIndex: number }>`
  position: relative;
  width: 180px;
  height: 320px;
  overflow: hidden;
  background: #2a2a2a;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;

  /* 🔹 상단 or 하단 그라데이션 띠 추가 */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 12px; /* 띠의 높이 */
    background: linear-gradient(
      to right,
      rgba(231, 128, 11, 0.7),
      rgb(253, 253, 253),
      rgba(231, 128, 11, 0.7)
    ); /* 금색 그라데이션 */
    ${({ rowIndex }) => (rowIndex < 2 ? "top: 0;" : "bottom: 0;")}
  }
`;

const PartyBadge = styled.div`
  position: absolute;
  bottom: 50%; /* 파티 중앙 아래 배치 */
  left: 50%;
  transform: translate(-50%, 50%); /* 정확한 중앙 배치 */
  text-align: center;
  font-size: 28px; /* 숫자 크기 증가 */
  font-weight: bold;
  color: white;
  background: linear-gradient(
    to bottom,
    #b37a30,
    #d4a373
  ); /* 밝은 금색 → 어두운 금색 */
  border: 3px solid #5a3e1b; /* 어두운 갈색 테두리 */
  border-radius: 8px;
  padding: 15px 10px;
  width: 50px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 5; /* 캐릭터 카드 위로 배치 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5); /* 그림자 효과 */

  span {
    font-size: 16px;
    font-weight: bold;
    color: white;
    text-shadow: -1px -1px 0 #b37a30, 1px -1px 0 #b37a30, -1px 1px 0 #b37a30,
      1px 1px 0 #b37a30; /* 주황색 테두리 효과 */
  }
`;

const ParticipantImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ParticipantInfo = styled.div`
  position: absolute;
  bottom: 60px;
  width: 90%;
  left: 5%;
  background: rgba(0, 0, 0, 0.45);
  color: white;
  padding: 10px 0;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 6px;
  width: 4px;
  height: 4px;
  background: rgba(0, 0, 0, 0.45);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    color: grey;
  }
`;

const ClassName = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #ffcc00;
`;

const ParticipantName = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
`;

const JoinButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #0073e6; /* 🔹 차분한 블루 계열 */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  margin-top: 15px;
  transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;

  &:hover {
    background: #005bb5; /* 🔹 hover 시 더 어두운 블루 */
    transform: scale(1.01);
  }

  &:active {
    background: #004999; /* 🔹 클릭 시 더 깊은 블루 */
    transform: scale(0.98);
  }
`;

const CloseButton = styled.button`
  flex: 1;
  padding: 12px;
  background: red; /* 🔹 진한 레드 */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  margin-top: 15px;
  transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;

  &:hover {
    background: #b71c1c; /* 🔹 hover 시 더 어두운 레드 */
    transform: scale(1.01);
  }

  &:active {
    background: #8e0000; /* 🔹 클릭 시 더 깊은 레드 */
    transform: scale(0.98);
  }
`;

const EventTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #fff; /* 🔹 노란색 강조 */
  margin-bottom: 4px;
`;

const EventDetails = styled.p`
  font-size: 16px;
  font-weight: normal;
  color: #94c1d3;
  text-align: center;
  margin: 2px 0;
`;

const EventContainer = styled.div`
  padding: 10px 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const CharacterSelectionContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 10px);
  max-width: 95%;
  background: #1e1e1e;
  color: white;
  padding: 20px;
  transition: bottom 0.3s ease-in-out;
  text-align: center;
  z-index: 100001;
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.5);
`;

const ServerContainer = styled.div`
  padding-bottom: 20px;
  border-bottom: 1px solid #444;
`;

const ServerList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
`;

const ServerButton = styled.button<{ isSelected: boolean }>`
  padding: 10px 15px;
  border: none;
  background: ${({ isSelected }) =>
    isSelected ? "#0073e6" : "#2d2d2d"}; /* 🔹 선택된 서버 강조 */
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.3s;

  &:hover {
    background: ${({ isSelected }) => (isSelected ? "#005bb5" : "#444")};
  }
`;

const CharacterContainer = styled.div`
  display: block;
  margin-top: 20px;
`;

const CharacterListWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 20px; /* 🔹 카드 간 간격 */
  padding: 0; /* 🔹 좌우 padding 균등 적용 */
  width: 100%;
`;

const CharacterList = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  justify-content: flex-start;
  max-height: 350px;
  overflow-x: auto;
  padding: 10px 0px;
  width: 100%;
  margin: 0 auto; /* 🔹 가운데 정렬 */
  align-items: stretch;
  scroll-padding: 20px;

  /* 🔹 스크롤바 디자인 수정 */
  &::-webkit-scrollbar {
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 10px;
    border: 2px solid #333;
  }

  &::-webkit-scrollbar-track {
    background-color: #222;
  }
`;

const CharacterCard = styled.div<{ isSelected: boolean }>`
  position: relative;
  width: 180px; /* 🔹 크기 조정 */
  height: 320px; /* 🔹 높이 증가 */
  min-width: 180px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  margin-right: 20px; /* 🔹 마지막 카드 여유 공간 확보 */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out,
    outline 0.2s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: ${({ isSelected }) =>
    isSelected ? "#FFD700" : "#2a2a2a"}; /* 🔹 선택된 캐릭터 강조 */

  outline: ${({ isSelected }) =>
    isSelected ? "3px solid white" : "none"}; /* ✅ 테두리 대신 outline 사용 */

  &:last-child {
    margin-right: 100px; /* 🔹 마지막 캐릭터 카드가 잘리지 않도록 */
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(255, 255, 255, 0.3); /* 🔹 hover 시 밝은 효과 */
  }
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 🔹 이미지가 꽉 차도록 */
  object-position: top center; /* 🔹 중앙을 기준으로 자르기 */
`;

const CharacterInfoOverlay = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  background: rgba(0, 0, 0, 0.7); /* 🔹 어두운 반투명 배경 */
  color: white;
  padding: 10px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  opacity: 0.9; /* 🔹 전체적으로 살짝 투명한 느낌 추가 */
  transition: opacity 0.2s ease-in-out; /* 🔹 부드러운 효과 */
`;

const CharacterName = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`;

const CharacterItemLevel = styled.p`
  font-size: 14px;
  margin: 2px 0 0;
  color: #ddd;
`;

const OrderSelector = styled.select<{ position: number }>`
  position: absolute;
  ${({ position }) =>
    position < 2 ? "bottom: 10px;" : "top: 10px;"} /* ✅ 하단 또는 상단 배치 */
  ${({ position }) =>
    position % 2 === 0
      ? "left: 10px;"
      : "right: 10px;"} /* ✅ 좌측 또는 우측 배치 */
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
`;
type Participant = {
  CharacterClassName: string;
  CharacterName: string;
  CharacterImage: string;
};

export const EventModal = ({
  event,
  scheduleId,
  onClose,
}: {
  event: EventType;
  scheduleId: string;
  onClose: () => void;
}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  const [isLeader, setIsLeader] = useState(false);
  const [isSelectingCharacter, setIsSelectingCharacter] = useState(false); // 🔹 캐릭터 선택 UI 활성화 여부
  const [loading, setLoading] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  const nickname = localStorage.getItem("nickname") || "";

  useEffect(() => {
    if (event?.leader && localStorage.getItem("nickname") === event.leader) {
      setIsLeader(true);
    } else {
      setIsLeader(false);
    }
  }, [event]);

  useEffect(() => {
    console.log("Updated participants:", participants);
  }, [participants]);

  useEffect(() => {
    if (event.participants && Array.isArray(event.participants)) {
      if (typeof event.participants[0] === "string") {
        console.log(
          "🔹 `event.participants` 값 유지됨 - Firestore 최신 데이터 적용 필요!"
        );
        return;
      }

      console.log(
        "✅ Firestore에서 불러온 참가자 데이터 유지:",
        event.participants
      );
    }
  }, [event]); // 🔹 `event` 변경 시 실행됨

  useEffect(() => {
    if (nickname) {
      handleSearch(nickname);
    }
  }, [nickname]);

  useEffect(() => {
    if (!event) return; // ✅ 이벤트가 없을 경우 실행하지 않음

    const fetchUpdatedParticipants = async () => {
      try {
        console.log(
          "📢 Modal이 다시 열렸을 때 Firestore에서 최신 데이터 가져오기:",
          scheduleId,
          "event:",
          event.date,
          event.title
        );

        const scheduleRef = doc(db, "schedules", scheduleId);
        const scheduleSnap = await getDocFromServer(scheduleRef);

        if (!scheduleSnap.exists()) {
          console.error("❌ Schedule not found in Firestore.");
          return;
        }

        const scheduleData = scheduleSnap.data();
        const eventData = scheduleData.events.find(
          (e: { date: string; title: string }) =>
            e.date === event.date && e.title === event.title
        );

        if (!eventData) {
          console.error("❌ Event not found in schedule.");
          return;
        }

        console.log(
          "🔹 Firestore에서 가져온 최신 참가자 데이터:",
          eventData.participants
        );
        setParticipants(eventData.participants || []);
      } catch (error) {
        console.error("❌ 참가자 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchUpdatedParticipants();
  }, [onClose]); // 🔹 Modal을 닫았다가 다시 열 때 Firestore 데이터 강제 업데이트

  // 참가자 목록을 두 개의 컬럼으로 정렬하는 로직

  const formattedParticipants = participants.reduce((acc, p, index) => {
    const groupIndex = Math.floor(index / 4); // 4개 단위로 그룹 생성
    acc[groupIndex] = acc[groupIndex] || [];
    acc[groupIndex].push(p);
    return acc;
  }, [] as Participant[][]);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/characters/siblings`, {
        params: { name: searchQuery },
      });

      const data = response.data;

      if (!Array.isArray(data) || data.length === 0) {
        console.error("캐릭터 검색 실패: 결과 없음");
        setCharacters([]); // 🔹 빈 배열로 설정하여 오류 방지
        return;
      }

      // 🔹 캐릭터 리스트를 `ItemLevel` 기준으로 정렬 (참가자 리스트에는 영향 없음)
      const sortedCharacters = [...data].sort(
        (a: any, b: any) =>
          parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
          parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
      );

      console.log(
        "🔍 정렬된 캐릭터 리스트 (참가자 리스트에는 영향 없음):",
        sortedCharacters
      );

      // 🔥 참가자 리스트는 Firestore 원본을 유지해야 하므로 변경하지 않음
      setCharacters(sortedCharacters);
    } catch (error) {
      console.error("캐릭터 검색 실패:", error);
      setCharacters([]); // 🔹 오류 발생 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!selectedCharacter) {
      alert("참가할 캐릭터를 선택해주세요!");
      return;
    }

    // 선택된 캐릭터 정보 가져오기
    const selectedCharacterData = characters.find(
      (char) => char.CharacterName === selectedCharacter
    );

    if (!selectedCharacterData) {
      alert("캐릭터 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const scheduleRef = doc(db, "schedules", scheduleId);
      const scheduleSnap = await getDoc(scheduleRef);

      if (!scheduleSnap.exists()) {
        alert("해당 스케줄을 찾을 수 없습니다.");
        return;
      }

      const scheduleData = scheduleSnap.data();

      // 🔹 `eventId`를 사용하여 정확한 이벤트 찾기
      const eventIndex = scheduleData.events.findIndex(
        (e: any) => e.eventId === event.eventId
      );

      if (eventIndex === -1) {
        alert("해당 이벤트를 찾을 수 없습니다.");
        return;
      }

      // ✅ 참가자 목록 업데이트
      const updatedParticipants = [
        ...(scheduleData.events[eventIndex].participants || []),
        {
          CharacterClassName: selectedCharacterData.CharacterClassName,
          CharacterName: selectedCharacterData.CharacterName,
          CharacterImage:
            selectedCharacterData.CharacterImage ||
            "/img/default-character.png",
        },
      ];

      const updatedEvents = [...scheduleData.events];
      updatedEvents[eventIndex].participants = updatedParticipants;

      await updateDoc(scheduleRef, { events: updatedEvents });

      alert(
        `${selectedCharacterData.CharacterName} 캐릭터가 일정에 참가했습니다!`
      );

      // Firestore에서 최신 데이터 가져오기
      setParticipants(updatedEvents[eventIndex].participants);
    } catch (error) {
      console.error("❌ 참가 실패:", error);
      alert("이벤트 참가 중 오류가 발생했습니다.");
    }
  };

  const moveParticipantTo = (fromIndex: number, toIndex: number) => {
    const updatedParticipants = [...participants];

    // 🔹 두 위치의 참가자 교환
    [updatedParticipants[fromIndex], updatedParticipants[toIndex]] = [
      updatedParticipants[toIndex],
      updatedParticipants[fromIndex],
    ];

    setParticipants(updatedParticipants);

    // DB에 업데이트 적용
    updateParticipantsInDB(updatedParticipants);
  };

  const updateParticipantsInDB = async (updatedParticipants: Participant[]) => {
    if (!event?.date || !event?.title || !scheduleId) {
      console.error(
        "⚠️ Event date, title, or Schedule ID is missing!",
        event.date,
        event.title,
        scheduleId
      );
      return;
    }

    try {
      const requestBody = {
        scheduleId: scheduleId,
        date: event.date,
        title: event.title,
        participants: updatedParticipants,
      };

      console.log(
        "📢 Sending request to /api/participants/update with data:",
        requestBody
      );

      const response = await fetch(
        "http://localhost:5000/api/participants/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      if (data.success) {
        console.log("✅ Participants updated successfully in DB.");
        console.log("🔹 Updated Participants:", updatedParticipants);
      } else {
        console.error("❌ Failed to update participants:", data.error);
      }
    } catch (error) {
      console.error("❌ Error updating participants in DB:", error);
    }
  };

  useEffect(() => {
    const fetchUpdatedParticipants = async () => {
      try {
        console.log(
          "📢 Firestore에서 참가자 데이터 가져오기:",
          scheduleId,
          "eventId:",
          event.eventId
        );

        const scheduleRef = doc(db, "schedules", scheduleId);
        const scheduleSnap = await getDocFromServer(scheduleRef);

        if (!scheduleSnap.exists()) {
          console.error("❌ Firestore에서 해당 스케줄을 찾을 수 없음.");
          return;
        }

        const scheduleData = scheduleSnap.data();
        const eventData = scheduleData.events.find(
          (e: { eventId: string }) => e.eventId === event.eventId
        );

        if (!eventData) {
          console.error("❌ Firestore에서 해당 이벤트를 찾을 수 없음.");
          return;
        }

        console.log(
          "🔹 Firestore에서 불러온 참가자 리스트:",
          eventData.participants
        );

        // 🔥 Firestore 데이터를 그대로 유지
        setParticipants(eventData.participants || []);
      } catch (error) {
        console.error("❌ 참가자 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchUpdatedParticipants();
  }, [event]); // 🔹 `eventId` 변경 시 실행됨

  const handleRemoveParticipant = async (characterName: string) => {
    if (!isLeader) {
      alert("대장만 참가자를 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm(`${characterName}님을 참가자에서 제거하시겠습니까?`)) {
      return;
    }

    if (!event?.eventId) {
      console.error("❌ 이벤트 정보가 없습니다.");
      alert("이벤트 정보를 불러오지 못했습니다.");
      return;
    }

    try {
      const scheduleRef = doc(db, "schedules", scheduleId);
      const scheduleSnap = await getDoc(scheduleRef);

      if (!scheduleSnap.exists()) {
        alert("해당 스케줄을 찾을 수 없습니다.");
        return;
      }

      const scheduleData = scheduleSnap.data();

      // 🔹 `event?.eventId`를 사용하여 안전하게 참조
      const eventIndex = scheduleData.events.findIndex(
        (e: any) => e.eventId === event?.eventId
      );

      if (eventIndex === -1) {
        alert("해당 이벤트를 찾을 수 없습니다.");
        return;
      }

      const updatedEvents = [...scheduleData.events];
      const targetEvent = updatedEvents[eventIndex];

      // 🔹 참가자 제거
      targetEvent.participants = targetEvent.participants.filter(
        (p: Participant) => p.CharacterName !== characterName
      );

      await updateDoc(scheduleRef, { events: updatedEvents });

      alert(`${characterName}님이 참가자 목록에서 삭제되었습니다.`);
      setParticipants(targetEvent.participants);
    } catch (error) {
      console.error("❌ 참가자 삭제 중 오류 발생:", error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <EventContainer>
          <EventTitle>
            [{event.level}]{" "}
            <span style={{ color: "#ffcc00" }}>{event.raid}</span>
            <span> 파티 모집 상세 정보</span>
          </EventTitle>
          <EventDetails>
            [{event.date}]{" "}
            <span style={{ color: "#ffffff", fontWeight: "bold" }}>
              {event.title}
            </span>
          </EventDetails>
        </EventContainer>

        {/* 참가자 목록 */}
        {participants.length > 0 ? (
          <ParticipantsGrid>
            {formattedParticipants.map((group, groupIndex) => (
              <PartyContainer key={`group-${groupIndex}`}>
                {group.map((p, rowIndex) => {
                  const positionNumber = groupIndex * 4 + rowIndex + 1; // ✅ 전체 자리 번호 계산

                  return (
                    <ParticipantCard
                      key={`group-${groupIndex}-row-${rowIndex}`}
                      rowIndex={rowIndex}
                    >
                      <ParticipantImage
                        src={p.CharacterImage || "/img/default-character.png"}
                        alt={p.CharacterName}
                      />
                      <ParticipantInfo>
                        {/* 🔹 참가자 직업 아이콘 추가 (좌측 상단) */}
                        {ClassIcon[p.CharacterClassName] && (
                          <CharacterClassIcon
                            src={ClassIcon[p.CharacterClassName]}
                            alt={p.CharacterClassName}
                          />
                        )}

                        {/* 🔹 대장(Leader)만 삭제 버튼 표시 */}
                        {isLeader && (
                          <DeleteButton
                            onClick={() =>
                              handleRemoveParticipant(p.CharacterName)
                            }
                          >
                            ✕
                          </DeleteButton>
                        )}

                        <ClassName>{p.CharacterClassName}</ClassName>
                        <ParticipantName>{p.CharacterName}</ParticipantName>
                      </ParticipantInfo>

                      {/* 🔹 자리 선택 드롭다운 (전체 자리 1~8번 표시) */}
                      <OrderSelector
                        value={positionNumber}
                        onChange={(e) =>
                          moveParticipantTo(
                            positionNumber - 1,
                            Number(e.target.value) - 1
                          )
                        }
                        position={rowIndex}
                      >
                        {participants.map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}번 자리
                          </option>
                        ))}
                      </OrderSelector>
                    </ParticipantCard>
                  );
                })}

                {/* 🔹 파티 배지 (중앙 배치) */}
                <PartyBadge>
                  {groupIndex + 1}
                  <span>
                    {groupIndex === 0 ? "ST" : groupIndex === 1 ? "ND" : "RD"}
                  </span>
                </PartyBadge>
              </PartyContainer>
            ))}
          </ParticipantsGrid>
        ) : (
          <p>아직 참가자가 없습니다.</p>
        )}

        {/* 참가 & 닫기 버튼 */}
        <ActionButtons>
          <JoinButton onClick={() => setIsSelectingCharacter(true)}>
            캐릭터 선택 하기
          </JoinButton>
          <CloseButton onClick={onClose}>닫기</CloseButton>
        </ActionButtons>
      </ModalContent>

      {isSelectingCharacter && (
        <CharacterSelectionContainer onClick={(e) => e.stopPropagation()}>
          {/* ✅ 서버 리스트 */}
          <ServerContainer>
            <h2>서버 리스트</h2>
            <ServerList>
              {/* 🔹 `Array.from()`을 사용하여 `Set`을 배열로 변환 */}
              {Array.from(
                new Set(characters.map((char) => char.ServerName))
              ).map((server) => (
                <ServerButton
                  key={server}
                  isSelected={selectedServer === server}
                  onClick={() => {
                    setSelectedServer(server); // ✅ 서버 선택
                    setIsSelectingCharacter(true); // ✅ 모달 유지
                  }}
                >
                  {server}
                </ServerButton>
              ))}
            </ServerList>
          </ServerContainer>

          <CharacterContainer>
            <h2>캐릭터 리스트</h2>
            <CharacterList>
              <CharacterListWrapper>
                {characters
                  .filter(
                    (char) =>
                      !selectedServer || char.ServerName === selectedServer
                  ) // 🔹 서버 선택 전이면 전체 표시
                  .map((char) => (
                    <CharacterCard
                      key={char.CharacterName}
                      isSelected={selectedCharacter === char.CharacterName}
                      onClick={() =>
                        setSelectedCharacter((prev) =>
                          prev === char.CharacterName
                            ? null
                            : char.CharacterName
                        )
                      }
                    >
                      {ClassIcon[char.CharacterClassName] && (
                        <CharacterClassIcon
                          src={ClassIcon[char.CharacterClassName]}
                          alt={char.CharacterClassName}
                        />
                      )}
                      <CharacterImage
                        src={
                          char?.CharacterImage &&
                          char?.CharacterImage !== "null"
                            ? char.CharacterImage
                            : ClassImage[char?.CharacterClassName] ||
                              "/img/default-character.png"
                        }
                        alt={char?.CharacterName || "No Character Selected"}
                      />
                      <CharacterInfoOverlay>
                        <CharacterName>
                          {char?.CharacterName || "No Name"}
                        </CharacterName>
                        <CharacterItemLevel>
                          아이템 레벨: {char?.ItemAvgLevel || "N/A"}
                        </CharacterItemLevel>
                      </CharacterInfoOverlay>
                    </CharacterCard>
                  ))}
              </CharacterListWrapper>
            </CharacterList>
          </CharacterContainer>

          {/* ✅ 참가 & 닫기 버튼 */}
          <CharacterActionButtons>
            <JoinButton onClick={handleJoinEvent}>참가하기</JoinButton>
            <CloseButton
              onClick={() => {
                setIsSelectingCharacter(false);
                setSelectedServer(null); // ✅ 서버 선택 초기화
              }}
            >
              닫기
            </CloseButton>
          </CharacterActionButtons>
        </CharacterSelectionContainer>
      )}
    </ModalOverlay>
  );
};
