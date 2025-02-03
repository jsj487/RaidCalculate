import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ko } from "date-fns/locale";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/FireBase";

const CalendarContainer = styled.div`
  max-width: 700px;
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const DayHeader = styled.div<{
  isHoliday?: boolean;
  isSaturday?: boolean;
  isSunday?: boolean;
}>`
  font-weight: bold;
  text-align: center;
  color: ${({ isHoliday, isSaturday, isSunday }) =>
    isHoliday || isSunday
      ? "#ff0000" // 공휴일 또는 일요일 빨간색
      : isSaturday
      ? "#0000ff" // 토요일 파란색
      : "#000"}; // 평일 검은색
`;

const EmptyDay = styled.div`
  height: 100px; /* 높이를 고정 */
`;

const Day = styled.div<{
  isHoliday?: boolean;
  isSaturday?: boolean;
  isSunday?: boolean;
}>`
  height: 100px;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  color: ${({ isHoliday, isSaturday, isSunday }) =>
    isHoliday || isSunday
      ? "#ff0000" // 공휴일 또는 일요일 빨간색
      : isSaturday
      ? "#0000ff" // 토요일 파란색
      : "#000"}; // 평일 검은색
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgb(233, 233, 233);
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;

  img {
    width: 24px; // 버튼 이미지 크기 조절
    height: 24px;
    object-fit: contain;
  }
`;

const Calendar = ({
  scheduleName,
  scheduleId,
  onDateClick,
}: {
  scheduleName: string;
  scheduleId: string;
  onDateClick: (date: string) => void; // 날짜 클릭 시 호출될 함수 타입 지정
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [days, setDays] = useState<Date[]>([]);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const currentMonth = format(currentDate, "MMMM", { locale: ko });
  const currentYear = format(currentDate, "yyyy", { locale: ko });
  const [events, setEvents] = useState<{ date: string }[]>([]);

  useEffect(() => {
    console.log("📌 현재 scheduleId:", scheduleId); // scheduleId 확인

    if (!scheduleId) {
      console.warn("🚨 scheduleId가 없습니다.");
      return;
    }
  }, [scheduleId]);

  useEffect(() => {
    console.log("📌 현재 scheduleId:", scheduleId); // scheduleId가 올바르게 설정되는지 확인

    if (!scheduleId) {
      console.warn("🚨 scheduleId가 없습니다.");
      return;
    }

    const fetchEvents = async () => {
      try {
        const scheduleRef = doc(db, "schedules", scheduleId.toString()); // 문자열 변환
        const scheduleSnap = await getDoc(scheduleRef);

        if (!scheduleSnap.exists()) {
          console.error(
            "🚨 해당 scheduleId의 문서를 찾을 수 없습니다:",
            scheduleId
          );
          return;
        }

        const scheduleData = scheduleSnap.data();
        console.log("📌 가져온 스케줄 데이터:", scheduleData);

        // events 필드가 없을 경우 빈 배열을 기본값으로 설정
        setEvents(scheduleData?.events ?? []);
      } catch (error) {
        console.error("🔥 이벤트 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchEvents();
  }, [scheduleId]);

  useEffect(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    setDays(eachDayOfInterval({ start, end }));
  }, [currentDate]);

  const getEventCountForDate = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");

    return events.filter((event) => {
      console.log("Comparing:", event.date, "vs", formattedDate);
      return event.date === formattedDate;
    }).length;
  };

  const fetchHolidays = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/publicholidays/2025/KR"
      );
      console.log("HTTP 상태 코드:", response.status); // 상태 코드 확인

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("공휴일 API 데이터:", data); // 응답 데이터 확인

      // 공휴일 데이터를 Date 객체로 변환하여 상태에 저장
      const holidayDates = data.map(
        (holiday: { date: string }) => new Date(holiday.date)
      );
      setHolidays(holidayDates); // 공휴일 상태 업데이트
    } catch (error) {
      console.error("Failed to fetch holidays", error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const isHoliday = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return holidays.some(
      (holiday) => format(holiday, "yyyy-MM-dd") === dateString
    );
  };

  return (
    <CalendarContainer>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "Center",
          alignItems: "Center",
        }}
      >
        <IconButton onClick={handlePreviousMonth}>
          <img
            src={`${process.env.PUBLIC_URL}/img/left_arrow.png`}
            alt="이전 달"
          />
        </IconButton>
        <span style={{ fontWeight: "bold", paddingBottom: "4px" }}>
          {currentYear}년 {currentMonth}
        </span>
        <IconButton onClick={handleNextMonth}>
          <img
            src={`${process.env.PUBLIC_URL}/img/expand_arrow.png`}
            alt="다음 달"
          />
        </IconButton>
      </div>
      {/* 현재 달 이름 표시 */}
      <CalendarGrid>
        {weekDays.map((day, idx) => (
          <DayHeader
            key={idx}
            isHoliday={day === "일"}
            isSaturday={day === "토"}
            isSunday={day === "일"}
          >
            {day}
          </DayHeader>
        ))}
        {Array(startOfMonth(currentDate).getDay())
          .fill(null)
          .map((_, idx) => (
            <EmptyDay key={idx} />
          ))}
        {days.map((day) => {
          const isHolidayDay = isHoliday(day);
          const isSaturday = day.getDay() === 6;
          const isSunday = day.getDay() === 0;
          const formattedDate = format(day, "yyyy-MM-dd"); // 날짜 포맷
          const eventCount = getEventCountForDate(day); // 해당 날짜에 있는 이벤트 개수 가져오기

          return (
            <Day
              key={day.getTime()}
              isHoliday={isHolidayDay}
              isSaturday={isSaturday}
              isSunday={isSunday}
              onClick={() => onDateClick(formattedDate)}
            >
              <span>{format(day, "d", { locale: ko })}</span>
              {eventCount > 0 && (
                <span
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#0077cc",
                    marginTop: "5px",
                  }}
                >
                  {eventCount}
                </span>
              )}
            </Day>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default Calendar;
