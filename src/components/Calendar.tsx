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
  color: ${({ isHoliday, isSaturday, isSunday }) =>
    isHoliday || isSunday
      ? "#ff0000" // 공휴일 또는 일요일 빨간색
      : isSaturday
      ? "#0000ff" // 토요일 파란색
      : "#000"}; // 평일 검은색
  border: 1px solid #ddd;
  border-radius: 5px;
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
}: {
  scheduleName: string;
  scheduleId: string;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<Record<string, string[]>>({});
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [days, setDays] = useState<Date[]>([]);

  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const currentMonth = format(currentDate, "MMMM", { locale: ko });
  const currentYear = format(currentDate, "yyyy", { locale: ko });

  useEffect(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    setDays(eachDayOfInterval({ start, end }));
  }, [currentDate]);

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
          return (
            <Day
              key={day.getTime()}
              isHoliday={isHolidayDay}
              isSaturday={isSaturday}
              isSunday={isSunday}
            >
              <span>{format(day, "d", { locale: ko })}</span>
            </Day>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default Calendar;
