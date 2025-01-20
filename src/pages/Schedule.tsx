import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ScheduleCreationModal from "../components/ScheduleCreationModal";
import Calendar from "../components/Calendar";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/FireBase";
import axios from "axios";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #383838;
  padding: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ScheduleList = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); // 한 줄에 5개의 카드
  gap: 20px; // 카드 간 간격
  padding: 20px;
  justify-items: center; // 카드 중앙 정렬
`;

const ScheduleCard = styled.div`
  background-color: #333;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  width: 180px; // 카드 너비
  height: 250px; // 카드 높이
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; // 내용 간 간격 균일화
  padding: 15px;
  text-align: center;
  color: #fff;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  img {
    width: 100%;
    height: 150px; // 이미지 높이
    object-fit: cover;
    border-radius: 8px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0;
  }

  .subtitle {
    font-size: 12px;
    color: #bbb;
  }
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 265px; // 썸네일 높이
  background-color: #555;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; // 이미지가 잘리지 않도록 설정
  }
`;

const ScheduleName = styled.div`
  font-size: 16px; // 글자 크기 증가
  color: #fff;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center; // 이름 중앙 정렬
`;

const CalendarModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
`;

// Main Component
const Schedule: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [nicknameForSchedules, setNicknameForSchedules] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<{
    id: number;
    name: string;
    code: string;
  } | null>(null);
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: "Weekly Raid Schedule",
      code: "abc12345", // 테스트용 고유 코드
    },
  ]);

  const fetchSchedules = async (): Promise<
    { id: number; name: string; code: string }[]
  > => {
    try {
      const querySnapshot = await getDocs(collection(db, "schedules"));
      const fetchedSchedules = querySnapshot.docs.map((doc, index) => ({
        id: index + 1, // Firestore에는 숫자 ID가 없으므로 index를 사용
        name: doc.data().name || "Unknown Name", // Firestore 문서의 name 필드
        code: doc.data().code || "Unknown Code", // Firestore 문서의 code 필드
      }));
      console.log("가져온 스케줄:", fetchedSchedules);
      return fetchedSchedules;
    } catch (error) {
      console.error("스케줄 가져오기 실패:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadSchedules = async () => {
      const fetchedSchedules = await fetchSchedules();
      setSchedules(fetchedSchedules);
    };
    loadSchedules();
  }, []);

  const handleCreateSchedule = async (name: string) => {
    const uniqueCode = Math.random().toString(36).substr(2, 8); // 고유 코드 생성

    const newSchedule = {
      id: schedules.length + 1, // 로컬 상태 관리용 ID
      name,
      code: uniqueCode,
      createdAt: new Date(), // 생성 시간 추가
    };

    try {
      // Firestore에 스케줄 추가
      const docRef = await addDoc(collection(db, "schedules"), newSchedule);
      console.log("스케줄 추가 성공! 문서 ID:", docRef.id);

      // 로컬 상태에도 업데이트
      setSchedules((prev) => [...prev, newSchedule]);

      // 모달 닫기
      setIsModalOpen(false);

      // 사용자에게 고유 코드 표시
      alert(`스케줄이 생성되었습니다. 고유 코드: ${uniqueCode}`);
    } catch (error) {
      console.error("스케줄 추가 실패:", error);
      alert("스케줄 생성 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleJoinSchedule = () => {
    const inputCode = prompt("스케줄표 고유 코드를 입력하세요:"); // 입력창 표시
    if (!inputCode) {
      alert("입력이 취소되었습니다.");
      return;
    }

    const foundSchedule = schedules.find(
      (schedule) => schedule.code === inputCode.trim()
    );
    if (foundSchedule) {
      setSelectedSchedule(foundSchedule);
      alert(`"${foundSchedule.name}" 스케줄에 입장합니다.`);
    } else {
      alert("올바르지 않은 코드입니다. 다시 시도하세요.");
    }
  };

  const handleSearch = async (nickname: string): Promise<string | null> => {
    const uniqueCode = Math.random().toString(36).substr(2, 8); // 고유 코드 생성
    try {
      const response = await axios.get("/api/characters/siblings", {
        params: { name: nickname },
      });

      const data = response.data;

      if (!data || data.length === 0) {
        alert("검색 결과가 없습니다. 닉네임을 다시 확인하세요.");
        return null;
      }

      // Firestore에 고유 코드와 함께 데이터 저장
      const searchEntry = {
        nickname,
        code: uniqueCode,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "searches"), searchEntry);

      alert(`검색 성공! 고유 코드: ${uniqueCode}`);
      return uniqueCode; // 고유 코드 반환
    } catch (error) {
      console.error("검색 중 오류가 발생했습니다:", error);
      alert("검색 중 오류가 발생했습니다. 다시 시도하세요.");
      return null;
    }
  };

  const fetchSchedulesByNickname = async (nickname: string) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "searches"), where("nickname", "==", nickname))
      );

      if (querySnapshot.empty) {
        alert("해당 닉네임으로 저장된 스케줄이 없습니다.");
        return [];
      }

      const schedules = querySnapshot.docs.map((doc) => doc.data());
      console.log("조회된 스케줄 목록:", schedules);
      return schedules;
    } catch (error) {
      console.error("스케줄 조회 실패:", error);
      return [];
    }
  };

  return (
    <Container>
      <ButtonWrapper>
        <Button onClick={() => setIsModalOpen(true)}>스케줄러 만들기</Button>
        <ScheduleCreationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateSchedule}
        />
        <Button onClick={handleJoinSchedule}>스케줄표 입장하기</Button>
        <div>
          <h2>닉네임 검색</h2>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            style={{ padding: "10px", width: "300px", marginRight: "10px" }}
          />
          <button
            onClick={async () => {
              const code = await handleSearch(nickname);
              if (code) {
                console.log("받은 코드:", code); // 받은 코드를 로컬 상태나 스토리지에 저장
              }
            }}
            style={{ padding: "10px" }}
          >
            검색 및 코드 받기
          </button>
        </div>

        <div>
          <h2>닉네임으로 스케줄 조회</h2>
          <input
            type="text"
            value={nicknameForSchedules}
            onChange={(e) => setNicknameForSchedules(e.target.value)}
            placeholder="닉네임을 입력하세요"
            style={{ padding: "10px", width: "300px", marginRight: "10px" }}
          />
          <button
            onClick={async () => {
              const schedules = await fetchSchedulesByNickname(
                nicknameForSchedules
              );
              if (schedules.length > 0) {
                console.log("닉네임 기반 스케줄:", schedules);
              }
            }}
            style={{ padding: "10px" }}
          >
            스케줄 조회
          </button>
        </div>
      </ButtonWrapper>

      <ScheduleList>
        {schedules.map((schedule) => (
          <ScheduleCard
            key={schedule.id}
            onClick={() => setSelectedSchedule(schedule)}
          >
            <ScheduleName>{schedule.name}</ScheduleName>
          </ScheduleCard>
        ))}
      </ScheduleList>

      {selectedSchedule && (
        <CalendarModal>
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "90%",
            }}
          >
            <h2>{selectedSchedule.name}</h2>
            <Calendar scheduleName={selectedSchedule.name} />
            <button
              onClick={() => setSelectedSchedule(null)}
              style={{ marginTop: "20px", padding: "10px 20px" }}
            >
              닫기
            </button>
          </div>
        </CalendarModal>
      )}
    </Container>
  );
};

export default Schedule;
