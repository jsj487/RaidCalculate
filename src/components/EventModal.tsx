import { useEffect, useState } from "react";
import styled from "styled-components";
import { EventType } from "../pages/Schedule";
import { db } from "../utils/FireBase"; // Firestore 연결
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ClassIcon, ClassImage } from "../utils/NameMap";
import axios from "axios";

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

const CharacterActionButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
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
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [isCharacterListVisible, setIsCharacterListVisible] = useState(false);

  const nickname = localStorage.getItem("nickname") || "";

  useEffect(() => {
    setParticipants(event.participants || []);
  }, [event]);

  useEffect(() => {
    if (nickname) {
      handleSearch(nickname);
    }
  }, [nickname]);

  useEffect(() => {
    const fetchUpdatedParticipants = async () => {
      try {
        const scheduleRef = doc(db, "schedules", scheduleId);
        const scheduleSnap = await getDoc(scheduleRef);

        if (!scheduleSnap.exists()) {
          console.error("해당 스케줄을 찾을 수 없습니다.");
          return;
        }

        const scheduleData = scheduleSnap.data();
        const eventIndex = scheduleData.events.findIndex(
          (e: any) => e.date === event.date && e.title === event.title
        );

        if (eventIndex !== -1) {
          setParticipants(scheduleData.events[eventIndex].participants || []);
        }
      } catch (error) {
        console.error("참가자 목록 갱신 실패:", error);
      }
    };

    fetchUpdatedParticipants(); // 🔹 모달이 열릴 때 Firestore 최신 데이터 가져오기
  }, [event, scheduleId]); // 🔹 event가 바뀔 때마다 최신화

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
      console.log("🔍 정렬된 캐릭터 데이터:", sortedCharacters); // 🔹 정렬된 데이터 출력

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

    // 중복 참가자 확인
    if (participants.includes(selectedCharacter)) {
      alert("이미 참가한 캐릭터입니다!");
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

      // 참가자 목록 업데이트 (중복 검사 통과한 경우만 추가)
      const updatedEvents = [...scheduleData.events];
      updatedEvents[eventIndex].participants = [
        ...(updatedEvents[eventIndex].participants || []),
        selectedCharacter,
      ];

      await updateDoc(scheduleRef, { events: updatedEvents });

      alert(`${selectedCharacter} 캐릭터가 일정에 참가했습니다!`);

      // Firestore에서 최신 데이터 가져오기
      const updatedScheduleSnap = await getDoc(scheduleRef);
      const updatedScheduleData = updatedScheduleSnap.data();
      if (updatedScheduleData) {
        setParticipants(
          updatedScheduleData.events[eventIndex].participants || []
        );
      }

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
