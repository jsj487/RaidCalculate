import React, { useState } from "react";
import styled from "styled-components";
import ScheduleCreationModal from "../components/ScheduleCreationModal";
import Calendar from "../components/Calendar";

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
  const [scheduleName, setScheduleName] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<{
    id: number;
    name: string;
    thumbnail: string;
  } | null>(null);

  const handleCardClick = (schedule: {
    id: number;
    name: string;
    thumbnail: string;
  }) => {
    setSelectedSchedule(schedule);
  };
  // Example schedule data
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: "Weekly Raid Schedule",
      thumbnail: "/path/to/thumbnail1.png",
    },
  ]);

  const handleCreateSchedule = (name: string) => {
    const newSchedule = {
      id: schedules.length + 1,
      name,
      thumbnail: "/path/to/default-thumbnail.png", // 기본 썸네일
    };
    setSchedules((prev) => [...prev, newSchedule]); // 스케줄 배열 업데이트
    setIsModalOpen(false);
  };

  const joinSchedule = () => {
    alert("Join Schedule clicked!");
    // Redirect to schedule join page
  };

  return (
    <Container>
      <ButtonWrapper>
        <Button onClick={() => setIsModalOpen(true)}>스케줄러 만들기</Button>
        {scheduleName && <Calendar scheduleName={scheduleName} />}
        <ScheduleCreationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateSchedule}
        />
        <Button onClick={joinSchedule}>스케줄표 입장하기</Button>
      </ButtonWrapper>

      <ScheduleList>
        {schedules.map((schedule) => (
          <ScheduleCard
            key={schedule.id}
            onClick={() => handleCardClick(schedule)}
          >
            <Thumbnail>
              {schedule.thumbnail ? (
                <img src={schedule.thumbnail} alt={schedule.name} />
              ) : (
                "썸네일 없음"
              )}
            </Thumbnail>
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
