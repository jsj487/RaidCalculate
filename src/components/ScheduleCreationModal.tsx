import React, { useState } from "react";
import styled from "styled-components";

// 스타일 컴포넌트
const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 320px; /* 살짝 넓혀 균형감 추가 */
  text-align: center;
  display: flex;
  flex-direction: column; /* 수직 정렬 */
  align-items: center; /* 내부 요소 중앙 정렬 */
`;

const Input = styled.input`
  width: calc(100% - 20px); /* 양쪽 패딩 여유 공간 확보 */
  padding: 10px;
  margin-bottom: 15px; /* 버튼과의 간격 조정 */
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box; /* 패딩 포함 계산 */
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px; /* 버튼 간격 추가 */
  width: 100%;
  justify-content: center; /* 버튼을 중앙 정렬 */
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: ${(props) => (props.primary ? "#007bff" : "#ccc")};
  color: #fff;
  cursor: pointer;
  flex: 1; /* 버튼 간 크기 균등 */
  max-width: 100px; /* 버튼 최대 너비 제한 */

  &:hover {
    background: ${(props) => (props.primary ? "#0056b3" : "#999")};
  }
`;

interface ScheduleCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const ScheduleCreationModal: React.FC<ScheduleCreationModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [scheduleName, setScheduleName] = useState("");

  const handleCreate = () => {
    if (scheduleName.trim() === "") {
      alert("스케줄러 이름을 입력하세요.");
      return;
    }
    onCreate(scheduleName); // 부모 컴포넌트로 이름 전달
    setScheduleName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>스케줄러 생성</h2>
        <Input
          type="text"
          placeholder="스케줄러 이름 입력"
          value={scheduleName}
          onChange={(e) => setScheduleName(e.target.value)}
        />
        <ButtonGroup>
          <Button onClick={onClose}>취소</Button>
          <Button onClick={handleCreate} primary>
            생성
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ScheduleCreationModal;
