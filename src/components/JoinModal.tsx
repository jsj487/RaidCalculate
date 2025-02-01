import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #262626;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 300px;
  text-align: center;
`;

const Title = styled.h3`
  color: #fff;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #555;
  border-radius: 6px;
  font-size: 14px;
  background-color: #2c2c2c;
  color: #fff;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const AuthButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

interface NicknameAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (nickname: string, pin: string) => void;
}

const NicknameAuthModal: React.FC<NicknameAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
}) => {
  const [nickname, setNickname] = React.useState("");
  const [pin, setPin] = React.useState("");

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>회원가입</Title>
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
          onClick={() => {
            onAuthenticate(nickname, pin);
            onClose();
          }}
        >
          회원가입
        </AuthButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default NicknameAuthModal;
