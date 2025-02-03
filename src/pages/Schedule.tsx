import React, { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import styled from "styled-components";
import ScheduleCreationModal from "../components/ScheduleCreationModal";
import JoinModal from "../components/JoinModal";
import Calendar from "../components/Calendar";
import { RaidValues } from "../components/RaidValues";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../utils/FireBase";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #262626;
  padding: 20px;
`;

const AuthContainer = styled.div`
  display: flex;
  flex-direction: row; /* 세로에서 가로로 변경 */
  gap: 100px;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  background-color: #262626;
  padding: 20px;
`;

const Title = styled.h3`
  color: #fff;
  margin-bottom: 20px;
`;

const AuthBox = styled.div`
  background-color: #444444; /* 어두운 회색 */
  color: #fff; /* 흰색 텍스트 */
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 320px;
  text-align: center;
`;

const Input = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #666666; /* 연한 테두리 */
  border-radius: 6px;
  font-size: 14px;
  background-color: #262626; /* 어두운 배경 */
  color: #fff;

  &:focus {
    outline: none;
    border-color: #dddddd; /* 연한 회색 포커스 */
    box-shadow: 0 0 5px #dddddd; /* 흰색 또는 살짝 회색 */
  }
`;

const AuthButton = styled.button`
  display: block;
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #0077cc; /* 차분한 파란색 */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005bb5; /* 조금 더 어두운 파란색 */
  }
`;

const Message = styled.p`
  color: #fff;
  font-weight: bold;
  font-size: 30px;
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
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const ScheduleList = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); // 한 줄에 5개의 카드
  gap: 20px; // 카드 간 간격
  padding: 20px;
  justify-items: center; // 카드 중앙 정렬
`;

const ScheduleCard = styled.div`
  cursor: pointer;
  background-color: #555;
  border: 1px solid #777;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  width: 180px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  text-align: center;
  color: #fff;
  position: relative; /* 삭제 버튼 위치를 위해 추가 */

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  .delete-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;

    &:hover {
      background: darkred;
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px; // 버튼 사이 여백
  justify-content: center;
  align-items: center;
`;

const PrimaryButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center; // 텍스트 중앙 정렬
  height: 48px;
  width: 220px; // 고정된 너비 설정 (최소한으로 크기 동일하게)
  min-width: 180px; // 버튼 최소 크기 지정
  padding: 0 20px; // 좌우 여백 통일
  border-radius: 10px;
  border: 1px solid #101010;
  background-color: #101010;
  font-size: 16px;
  transition: color 0.2s ease, border-color 0.2s ease,
    background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #fff;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 10px 20px;

  h3 {
    color: white;
    margin-right: 20px;
  }

  button {
    margin-left: 10px;
    padding: 10px 15px;
    font-size: 14px;
    background-color: #3043ff;
    color: rgb(255, 255, 255);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #2a39d6;
    }
  }
`;

const NoScheduleMessage = styled.p`
  color: #bbb;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
  font-style: italic;
`;

const CalendarModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch; /* 모든 섹션을 같은 높이로 */
  background: none;
  max-width: 1300px;
  width: 100%;
  gap: 20px;
`;

const Section = styled.div`
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  min-height: 550px; /* 달력 높이에 맞춤 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ParticipantsSection = styled(Section)`
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  min-height: 550px; /* 달력 높이에 맞춤 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CalendarSection = styled(Section)`
  flex: 3;
  text-align: center;
`;

const ScheduleSection = styled(Section)<{ isDateSelected: boolean }>`
  display: ${(props) => (props.isDateSelected ? "flex" : "flex")};
  flex-direction: ${(props) => (props.isDateSelected ? "column" : "row")};
  justify-content: ${(props) => (props.isDateSelected ? "" : "center")};
  align-items: center;
`;

const AddEventButton = styled.div<{ isAdding: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none; /* 드래그 방지 */
  position: relative;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  span {
    position: absolute;
    color: #a9a9a9;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .plus {
    opacity: ${({ isAdding }) => (isAdding ? "0" : "1")};
    transform: ${({ isAdding }) =>
      isAdding ? "scale(0.8)" : "scale(1)"}; /* 부드러운 축소 효과 */
  }

  .minus {
    opacity: ${({ isAdding }) => (isAdding ? "1" : "0")};
    transform: ${({ isAdding }) =>
      isAdding ? "scale(1)" : "scale(1.2)"}; /* 부드러운 확대 효과 */
  }
`;

const EventInputContainer = styled.div<{ isAdding: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  padding: 10px;
  background: #f4f4f4;
  border-radius: 8px;
  transform: scaleY(${({ isAdding }) => (isAdding ? "1" : "0")});
  transform-origin: top;
  opacity: ${({ isAdding }) => (isAdding ? "1" : "0")};
  max-height: ${({ isAdding }) =>
    isAdding ? "300px" : "0px"}; /* 자연스러운 확장 */
  overflow: hidden;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out,
    padding 0.3s ease-in-out;

  select,
  input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 8px 12px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #357abd;
    }
  }
`;

type Schedule = {
  id: number;
  name: string;
  code: string;
  participants: string[]; // 추가
};

// Main Component
const Schedule: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedRaid, setSelectedRaid] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [raidTitle, setRaidTitle] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false); // 인증 여부 상태
  const [authenticatedCode, setAuthenticatedCode] = useState<string | null>(
    null
  ); // 인증된 코드
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // 선택된 날짜 상태 추가
  const [events, setEvents] = useState<{ date: string; name: string }[]>([]); // 해당 날짜의 일정 리스트

  const [selectedEvents, setSelectedEvents] = useState<
    { id: string; name: string }[]
  >([]);
  const [pin, setPin] = useState(""); // PIN을 관리하는 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<{
    id: number;
    name: string;
    code: string;
    participants: string[]; // 추가
  } | null>(null);

  const [schedules, setSchedules] = useState<Schedule[]>([]); // 타입 지정

  const fetchScheduleByCode = async (code: string) => {
    setIsLoading(true); // 로딩 시작
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "searches"), where("code", "==", code))
      );

      if (querySnapshot.empty) {
        alert("해당 코드로 조회된 데이터가 없습니다.");
        setIsLoading(false); // 로딩 종료
        return null;
      }

      const scheduleData = querySnapshot.docs.map((doc) => doc.data())[0];

      if (scheduleData?.nickname && scheduleData?.code) {
        localStorage.setItem("nickname", scheduleData.nickname);
        localStorage.setItem("authenticatedCode", scheduleData.code);

        setNickname(scheduleData.nickname);
        setAuthenticatedCode(scheduleData.code);
        setIsAuthenticated(true); // 인증 상태 업데이트
      }

      const schedules = await fetchSchedules(scheduleData.nickname);
      setSchedules(schedules); // 스케줄 상태 업데이트
      alert("스케줄 조회가 성공적으로 완료되었습니다.");
      setIsLoading(false); // 로딩 종료
      return scheduleData;
    } catch (error) {
      console.error("스케줄 코드 조회 실패:", error);
      alert("스케줄 조회 중 문제가 발생했습니다.");
      setIsLoading(false); // 로딩 종료
      return null;
    }
  };

  const fetchSchedules = async (nickname: string) => {
    try {
      // Firestore searches 컬렉션에서 인증 코드 가져오기
      const searchQuerySnapshot = await getDocs(
        query(collection(db, "searches"), where("nickname", "==", nickname))
      );

      if (searchQuerySnapshot.empty) {
        console.error("인증 코드가 없습니다.");
        return [];
      }

      // Firestore schedules 컬렉션에서 인증 코드가 포함된 스케줄 가져오기
      const q = query(
        collection(db, "schedules"),
        where("participants", "array-contains", nickname) // 인증 코드 필터링
      );

      const querySnapshot = await getDocs(q);

      const schedules = querySnapshot.docs.map((doc, index) => ({
        id: index + 1,
        name: doc.data().name || "Unnamed Schedule",
        code: doc.data().code || "No Code",
        participants: doc.data().participants || [], // participants 필드 추가
      }));

      console.log("참여된 스케줄:", schedules);
      return schedules;
    } catch (error) {
      console.error("스케줄 조회 실패:", error);
      return [];
    }
  };

  const recoverCode = async (
    nickname: string,
    pin: string
  ): Promise<string | null> => {
    try {
      // PIN 유효성 검사
      if (!/^\d{4}$/.test(pin)) {
        alert("PIN은 4자리 숫자여야 합니다.");
        return null;
      }

      // Firestore에서 닉네임으로 데이터 검색
      const querySnapshot = await getDocs(
        query(collection(db, "searches"), where("nickname", "==", nickname))
      );

      if (querySnapshot.empty) {
        alert("닉네임과 PIN이 일치하는 데이터를 찾을 수 없습니다.");
        return null;
      }

      const existingData = querySnapshot.docs[0].data();

      // PIN 검증
      const isPinValid = await bcrypt.compare(pin, existingData.pin);
      if (!isPinValid) {
        alert("PIN이 올바르지 않습니다.");
        return null;
      }

      return existingData.code;
    } catch (error) {
      console.error("코드 복구 실패:", error);
      alert("코드 복구 중 문제가 발생했습니다.");
      return null;
    }
  };

  const handleCreateSchedule = async (scheduleName: string) => {
    if (!isAuthenticated) {
      alert("닉네임 인증 후 스케줄을 생성할 수 있습니다.");
      return;
    }

    setIsLoading(true); // 로딩 시작
    const uniqueScheduleCode = Math.random().toString(36).substr(2, 8);

    try {
      const querySnapshot = await getDocs(
        query(collection(db, "searches"), where("nickname", "==", nickname))
      );

      if (querySnapshot.empty) {
        alert("닉네임 인증 정보가 없습니다.");
        setIsLoading(false); // 로딩 종료
        return;
      }

      const nickkname = querySnapshot.docs[0].data().nickname;

      const newSchedule = {
        name: scheduleName,
        code: uniqueScheduleCode,
        createdAt: new Date(),
        participants: [nickname],
      };

      await addDoc(collection(db, "schedules"), newSchedule);

      const searchDocId = querySnapshot.docs[0].id;
      const searchDocRef = doc(db, "searches", searchDocId);

      await updateDoc(searchDocRef, {
        scheduleCodes: arrayUnion(uniqueScheduleCode),
      });

      const schedules = await fetchSchedules(nickname);
      setSchedules(schedules); // 스케줄 상태 업데이트
      alert(`스케줄이 생성되었습니다. 코드: ${uniqueScheduleCode}`);
      setIsLoading(false); // 로딩 종료
    } catch (error) {
      console.error("스케줄 생성 실패:", error);
      alert("스케줄 생성 중 문제가 발생했습니다.");
      setIsLoading(false); // 로딩 종료
    }
  };

  const handleJoinSchedule = async () => {
    const inputCode = prompt("스케줄표 고유 코드를 입력하세요:");
    if (!inputCode) {
      alert("입력이 취소되었습니다.");
      return;
    }

    try {
      // Firestore에서 스케줄 검색
      const q = query(
        collection(db, "schedules"),
        where("code", "==", inputCode.trim())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("올바르지 않은 코드입니다. 다시 시도하세요.");
        return;
      }

      const scheduleDoc = querySnapshot.docs[0];
      const scheduleData = scheduleDoc.data();

      // Firestore searches 컬렉션에서 인증 코드 가져오기
      const searchQuerySnapshot = await getDocs(
        query(collection(db, "searches"), where("nickname", "==", nickname))
      );

      if (searchQuerySnapshot.empty) {
        alert("닉네임 인증 정보가 없습니다.");
        return;
      }

      // 중복 참여 방지
      if (scheduleData.participants?.includes(nickname)) {
        alert("이미 이 스케줄에 참여하였습니다.");
        return;
      }

      // Firestore searches 컬렉션에 스케줄 코드 추가
      const searchDocId = searchQuerySnapshot.docs[0].id;
      const searchDocRef = doc(db, "searches", searchDocId);

      await updateDoc(searchDocRef, {
        scheduleCodes: arrayUnion(inputCode.trim()), // 스케줄 코드 추가
      });

      // Firestore schedules 컬렉션에 인증 코드 추가
      const scheduleDocRef = doc(db, "schedules", scheduleDoc.id);
      await updateDoc(scheduleDocRef, {
        participants: arrayUnion(nickname), // 인증 코드 추가
      });

      alert(`"${scheduleData.name}" 스케줄에 입장하였습니다.`);
      window.location.reload(); // 새로고침
      // 참여 후 스케줄 목록 업데이트
      await fetchSchedules(nickname);
    } catch (error) {
      console.error("스케줄 입장 실패:", error);
      alert("스케줄 입장 중 문제가 발생했습니다.");
    }
  };

  const handleSearch = async (
    nickname: string,
    pin: string
  ): Promise<string | null> => {
    try {
      // PIN 유효성 검사
      if (!/^\d{4}$/.test(pin)) {
        alert("PIN은 4자리 숫자여야 합니다.");
        return null;
      }

      // Firestore에서 닉네임 중복 검사
      const querySnapshot = await getDocs(
        query(collection(db, "searches"), where("nickname", "==", nickname))
      );

      if (!querySnapshot.empty) {
        alert(
          "이미 인증된 닉네임입니다. 다른 닉네임을 사용하거나 PIN을 사용해 코드를 복구하세요."
        );
        return null;
      }

      // PIN 암호화
      const hashedPin = await bcrypt.hash(pin, 10);

      // 인증 코드 생성
      const uniqueCode = Math.random().toString(36).substr(2, 8);

      const searchEntry = {
        nickname,
        pin: hashedPin, // 암호화된 PIN 저장
        code: uniqueCode,
        createdAt: new Date(),
      };

      // Firestore에 저장
      await addDoc(collection(db, "searches"), searchEntry);

      // localStorage에 인증 상태 저장
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("authenticatedCode", uniqueCode);

      alert(`인증 성공! 인증 코드: ${uniqueCode}`);
      return uniqueCode;
    } catch (error) {
      console.error("닉네임 인증 실패:", error);
      alert("닉네임 인증 중 문제가 발생했습니다.");
      return null;
    }
  };

  const handleRemoveSchedule = async (scheduleCode: string) => {
    const confirmDelete = window.confirm(
      "정말로 스케줄 방에서 나가시겠습니까?"
    );
    if (!confirmDelete) return; // 사용자가 취소를 누르면 삭제 작업 중단

    try {
      // Firestore searches 컬렉션에서 인증 코드 가져오기
      const searchQuerySnapshot = await getDocs(
        query(collection(db, "searches"), where("nickname", "==", nickname))
      );

      if (searchQuerySnapshot.empty) {
        alert("닉네임 인증 정보가 없습니다.");
        return;
      }

      const userCode = searchQuerySnapshot.docs[0].data().code;
      const searchDocId = searchQuerySnapshot.docs[0].id;
      const searchDocRef = doc(db, "searches", searchDocId);

      // Firestore searches 컬렉션에서 scheduleCode 제거
      await updateDoc(searchDocRef, {
        scheduleCodes: arrayRemove(scheduleCode),
      });

      // Firestore schedules 컬렉션에서 participants에서 userCode 제거
      const scheduleDocQuerySnapshot = await getDocs(
        query(collection(db, "schedules"), where("code", "==", scheduleCode))
      );

      if (!scheduleDocQuerySnapshot.empty) {
        const scheduleDocId = scheduleDocQuerySnapshot.docs[0].id;
        const scheduleDocRef = doc(db, "schedules", scheduleDocId);

        await updateDoc(scheduleDocRef, {
          participants: arrayRemove(nickname),
        });
      }

      alert("스케줄 방에서 성공적으로 나왔습니다.");
      window.location.reload(); // 페이지 자동 새로고침
    } catch (error) {
      console.error("스케줄 삭제 실패:", error);
      alert("스케줄 삭제 중 문제가 발생했습니다.");
    }
  };

  const handleLogout = () => {
    // LocalStorage에서 데이터 삭제
    localStorage.removeItem("authenticatedCode");
    localStorage.removeItem("nickname");

    // 상태 초기화
    setIsAuthenticated(false);
    setNickname("");
    setAuthenticatedCode("");

    // 페이지 새로고침 또는 리디렉션
    window.location.reload(); // 새로고침으로 상태 반영
  };

  const handleAuthenticate = async (nickname: string, pin: string) => {
    const code = await handleSearch(nickname, pin); // 기존 함수 사용
    if (code) {
      setAuthenticatedCode(code);
      setIsAuthenticated(true);
    }
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date); // 클릭된 날짜 업데이트

    // Firebase에서 해당 날짜의 일정 불러오기 (데이터 예시)
    const mockEvents = [
      { date: "2025-02-10", name: "길드 레이드" },
      { date: "2025-02-15", name: "주간 공대" },
    ];

    // 선택된 날짜와 일치하는 일정만 필터링하여 표시
    const filteredEvents = mockEvents.filter((event) => event.date === date);
    setEvents(filteredEvents);
  };

  const saveRaidEvent = async (
    scheduleId: string, // Firestore 문서 ID는 string 타입이어야 함
    title: string,
    raid: string,
    level: string
  ) => {
    try {
      // Firestore에서 해당 schedule 문서를 직접 참조
      const scheduleRef = doc(db, "schedules", scheduleId);

      // 문서 존재 여부 확인
      const scheduleSnap = await getDoc(scheduleRef);
      if (!scheduleSnap.exists()) {
        console.error("해당 스케줄 문서를 찾을 수 없습니다.");
        alert("해당 스케줄을 찾을 수 없습니다.");
        return;
      }

      // 기존 events 필드 확인 (없으면 빈 배열 생성)
      const scheduleData = scheduleSnap.data();
      const existingEvents = scheduleData.events || [];

      // 새로운 이벤트 데이터 추가
      const newEvent = {
        title: title || `${raid} - ${level}`,
        raid,
        level,
        date: selectedDate,
        createdAt: new Date(),
      };

      // Firestore 문서 업데이트 (events 배열 업데이트)
      await updateDoc(scheduleRef, {
        events: [...existingEvents, newEvent], // 기존 events 배열에 추가
      });

      alert("공대 일정이 저장되었습니다.");
    } catch (error) {
      console.error("일정 저장 실패:", error);
      alert("일정 저장 중 문제가 발생했습니다.");
    }
  };

  const handleSaveEvent = () => {
    if (!selectedRaid || !selectedLevel) return;

    const finalTitle = raidTitle.trim() || `${selectedRaid} - ${selectedLevel}`;

    if (!selectedSchedule) {
      alert("스케줄을 찾을 수 없습니다.");
      return;
    }

    // 🔹 Firestore 문서 ID를 그대로 사용
    saveRaidEvent(
      String(selectedSchedule.id), // 🔹 숫자를 문자열로 변환
      finalTitle,
      selectedRaid,
      selectedLevel
    );
    setIsAdding(false);
    setSelectedRaid("");
    setSelectedLevel("");
    setRaidTitle("");
  };

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedCode = localStorage.getItem("authenticatedCode");

    if (storedNickname) setNickname(storedNickname);
    if (storedCode) {
      setIsAuthenticated(true);
      setAuthenticatedCode(storedCode);
    }
  }, []);

  useEffect(() => {
    console.log("schedules 상태:", schedules);
  }, [schedules]);

  useEffect(() => {
    if (isAuthenticated && nickname) {
      const loadSchedules = async () => {
        const fetchedSchedules = await fetchSchedules(nickname);
        setSchedules(fetchedSchedules); // 참여된 스케줄만 상태에 저장
      };

      loadSchedules();
    }
  }, [isAuthenticated, nickname]);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedCode = localStorage.getItem("authenticatedCode");

    if (storedNickname) setNickname(storedNickname);
    if (storedCode) {
      setIsAuthenticated(true);
      setAuthenticatedCode(storedCode);
    }
  }, []);

  return (
    <Container>
      {isLoading && <p>로딩 중입니다. 잠시만 기다려주세요...</p>}
      {!isAuthenticated && (
        <Message>
          닉네임 인증 또는 코드 입력 후 스케줄에 접근할 수 있습니다.
        </Message>
      )}
      {isAuthenticated && (
        <TopBar>
          <h3>{nickname}님 어서오세요.</h3>
          <button
            onClick={() => {
              if (authenticatedCode) {
                navigator.clipboard.writeText(authenticatedCode);
                alert(`${authenticatedCode} 복사 완료했습니다.`);
              } else {
                alert("복사할 코드가 없습니다.");
              }
            }}
          >
            코드복사
          </button>
          <button className="secondary" onClick={handleLogout}>
            로그아웃
          </button>
        </TopBar>
      )}

      <ButtonWrapper>
        {isAuthenticated && (
          <ButtonContainer>
            <PrimaryButton onClick={() => setIsModalOpen(true)}>
              스케줄 만들기
            </PrimaryButton>
            <ScheduleCreationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onCreate={handleCreateSchedule}
            />
            <PrimaryButton onClick={handleJoinSchedule}>
              스케줄 입장
            </PrimaryButton>
          </ButtonContainer>
        )}
        {!isAuthenticated && (
          <AuthContainer>
            <>
              <JoinModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAuthenticate={handleAuthenticate}
              />

              <AuthBox>
                <Title>로그인</Title>
                <Input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                />
                <Input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="4자리 PIN을 입력하세요"
                  maxLength={4}
                />
                <AuthButton
                  onClick={async () => {
                    const code = await recoverCode(nickname, pin);
                    if (code) {
                      localStorage.setItem("nickname", nickname);
                      localStorage.setItem("authenticatedCode", code);
                      setAuthenticatedCode(code);
                      setIsAuthenticated(true);
                    }
                  }}
                >
                  로그인
                </AuthButton>
                <AuthButton onClick={() => setIsModalOpen(true)}>
                  회원가입
                </AuthButton>
              </AuthBox>

              <AuthBox>
                <Title>스케줄 불러오기</Title>
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="코드를 입력하세요"
                />
                <AuthButton
                  onClick={async () => {
                    const schedule = await fetchScheduleByCode(code);
                    if (schedule) {
                      setIsAuthenticated(true);
                      setAuthenticatedCode(code);
                    }
                  }}
                >
                  코드 입력
                </AuthButton>
              </AuthBox>
            </>
          </AuthContainer>
        )}
      </ButtonWrapper>

      {isAuthenticated && (
        <ScheduleList>
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                onClick={() => setSelectedSchedule(schedule)} // 클릭 시 선택된 스케줄 업데이트
              >
                {" "}
                <button
                  className="delete-btn"
                  onClick={() => handleRemoveSchedule(schedule.code)}
                >
                  X
                </button>
                <ScheduleName>{schedule.name}</ScheduleName>
              </ScheduleCard>
            ))
          ) : (
            <NoScheduleMessage>참여 중인 스케줄이 없습니다.</NoScheduleMessage>
          )}
        </ScheduleList>
      )}

      {selectedSchedule && (
        <CalendarModal onClick={() => setSelectedSchedule(null)}>
          {" "}
          {/* 바깥 클릭 시 닫힘 */}
          <CalendarModalContainer onClick={(e) => e.stopPropagation()}>
            {" "}
            {/* 내부 클릭 시 이벤트 버블링 방지 */}
            {/* 왼쪽: 구성원 리스트 */}
            <ParticipantsSection>
              <Title style={{ color: "#000" }}>구성원</Title>
              {selectedSchedule.participants.length > 0 ? (
                <ul>
                  {selectedSchedule.participants.map((member) => (
                    <li key={member}>{member}</li>
                  ))}
                </ul>
              ) : (
                <p>구성원이 없습니다.</p>
              )}
            </ParticipantsSection>
            {/* 가운데: 캘린더 (구성원을 props로 전달) */}
            <CalendarSection>
              <h2>{selectedSchedule.name}</h2>
              <Calendar
                scheduleName={selectedSchedule.name}
                scheduleId={String(selectedSchedule.id)}
                onDateClick={handleDateClick} // 날짜 클릭 시 함수 실행
              />
            </CalendarSection>
            {/* 오른쪽: 날짜별 공대 일정 */}
            <ScheduleSection isDateSelected={!!selectedDate}>
              {selectedDate ? (
                <>
                  <h3>{selectedDate}</h3>
                  {events.length > 0 ? (
                    <ul>
                      {events.map((event) => (
                        <li key={event.name}>{event.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <AddEventButton
                      onClick={() => setIsAdding(!isAdding)}
                      isAdding={isAdding}
                    >
                      <span className="plus">+</span>
                      <span className="minus">−</span>
                    </AddEventButton>
                  )}

                  <EventInputContainer isAdding={isAdding}>
                    <select
                      value={selectedRaid}
                      onChange={(e) => setSelectedRaid(e.target.value)}
                    >
                      <option value="">레이드 선택</option>
                      {Object.keys(RaidValues).map((category) =>
                        Object.keys(RaidValues[category]).map((raidName) => (
                          <option key={raidName} value={raidName}>
                            {raidName}
                          </option>
                        ))
                      )}
                    </select>

                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                    >
                      <option value="">난이도 선택</option>
                      {selectedRaid &&
                        Object.keys(
                          Object.values(RaidValues)
                            .map((category) => category[selectedRaid]) // 배열로 변환
                            .find((raid) => raid !== undefined) || {}
                        ).map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                    </select>

                    <input
                      type="text"
                      value={raidTitle}
                      onChange={(e) => setRaidTitle(e.target.value)}
                      placeholder="공대 제목 (선택)"
                    />

                    <button onClick={handleSaveEvent}>저장</button>
                  </EventInputContainer>
                </>
              ) : (
                <p style={{ fontWeight: "bold", fontSize: "25px" }}>
                  날짜를 선택하세요
                </p>
              )}
            </ScheduleSection>
          </CalendarModalContainer>
        </CalendarModal>
      )}
    </Container>
  );
};

export default Schedule;
