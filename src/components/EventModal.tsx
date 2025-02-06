import { useEffect, useState } from "react";
import styled from "styled-components";
import { EventType } from "../pages/Schedule";
import { db } from "../utils/FireBase"; // Firestore 연결
import { doc, getDoc, updateDoc } from "firebase/firestore";
import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://raidcalculate.onrender.com/api"
    : "http://localhost:5000/api";

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
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 600px;
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

const JoinButton = styled.button`
  flex: 1;
  padding: 10px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: #45a049;
  }
`;

const CloseButton = styled.button`
  flex: 1;
  padding: 10px;
  background: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

const CharacterListContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: ${({ isVisible }) => (isVisible ? "0" : "-100%")};
  left: 0;
  width: 100%;
  background: #357abd;
  color: white;
  padding: 20px;
  transition: bottom 0.3s ease-in-out;
  text-align: center;
`;

const CharacterList = styled.div`
  display: flex;
  flex-wrap: nowrap; /* 한 줄로 배치 */
  gap: 15px;
  justify-content: center;
  max-height: 300px;
  overflow-x: auto; /* 가로 스크롤 추가 */
  padding: 10px;
  width: 100%;
`;

const CharacterCard = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 120px; /* 카드의 너비 */
  height: 200px; /* 카드의 높이 */
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.08);
  }
`;

const CharacterImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid #ddd;
`;

const CharacterName = styled.p`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: #222;
`;

const ItemLevel = styled.p`
  font-size: 12px;
  color: #555;
`;

export const EventModal = ({
  event,
  scheduleId,
  onClose,
}: {
  event: EventType;
  scheduleId: string;
  onClose: () => void;
}) => {
  const [participants, setParticipants] = useState<string[]>(
    event.participants || []
  );
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  const [isSelectingCharacter, setIsSelectingCharacter] = useState(false); // 🔹 캐릭터 선택 UI 활성화 여부
  const [loading, setLoading] = useState(false);

  const nickname = localStorage.getItem("nickname") || "";

  useEffect(() => {
    setParticipants(event.participants || []);
  }, [event]);

  useEffect(() => {
    if (nickname) {
      handleSearch(nickname);
    }
  }, [nickname]);

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

      // 🔹 높은 레벨 순으로 정렬하여 저장
      const sortedCharacters = [...data].sort(
        (a: any, b: any) =>
          parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
          parseFloat(a.ItemAvgLevel.replace(/,/g, ""))
      );

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

    try {
      const scheduleRef = doc(db, "schedules", scheduleId);
      const scheduleSnap = await getDoc(scheduleRef);

      if (!scheduleSnap.exists()) {
        alert("해당 스케줄을 찾을 수 없습니다.");
        return;
      }

      const scheduleData = scheduleSnap.data();
      const eventIndex = scheduleData.events.findIndex(
        (e: any) => e.date === event.date && e.title === event.title
      );

      if (eventIndex === -1) {
        alert("해당 이벤트를 찾을 수 없습니다.");
        return;
      }

      const updatedEvents = [...scheduleData.events];
      updatedEvents[eventIndex].participants = [
        ...(updatedEvents[eventIndex].participants || []),
        selectedCharacter,
      ];

      await updateDoc(scheduleRef, { events: updatedEvents });

      alert(`${selectedCharacter} 캐릭터가 일정에 참가했습니다!`);
      setParticipants((prev) => [...prev, selectedCharacter]);

      // ✅ 참가가 완료된 후에만 닫기
      setIsSelectingCharacter(false);
    } catch (error) {
      console.error("❌ 참가 실패:", error);
      alert("이벤트 참가 중 오류가 발생했습니다.");
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>{event.title}</h2>
        <p>
          <strong>레이드:</strong> {event.raid}
        </p>
        <p>
          <strong>난이도:</strong> {event.level}
        </p>
        <p>
          <strong>날짜:</strong> {event.date}
        </p>

        {/* 참가자 목록 */}
        <h3>참가자 목록</h3>
        {participants.length > 0 ? (
          <ul>
            {participants.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
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

      {/* 🔹 캐릭터 선택 UI */}
      <CharacterListContainer isVisible={isSelectingCharacter}>
        <h2>캐릭터 리스트</h2>
        <CharacterList>
          {characters.map((char) => (
            <CharacterCard
              key={char.CharacterName}
              onClick={() => setSelectedCharacter(char.CharacterName)}
            >
              <CharacterImage
                src={char?.CharacterImage || "/img/default-character.png"}
                alt={char?.CharacterName || "No Character Selected"}
              />
              <CharacterName>{char?.CharacterName || "No Name"}</CharacterName>
              <ItemLevel>아이템 레벨: {char?.ItemAvgLevel || "N/A"}</ItemLevel>
            </CharacterCard>
          ))}
        </CharacterList>
        <button onClick={handleJoinEvent}>참가하기</button>
      </CharacterListContainer>
    </ModalOverlay>
  );
};
