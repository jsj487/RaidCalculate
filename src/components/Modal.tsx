// Modal.tsx - 이미지 모달 컴포넌트
import React, { useEffect } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 80%;
  border-radius: 8px;
  object-fit: contain;
`;

interface ModalProps {
  image: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ image, onClose }) => {
  useEffect(() => {
    // 스크롤 비활성화
    document.body.style.overflow = "hidden";

    // Cleanup: 모달 닫힐 때 스크롤 활성화
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalImage
        src={image}
        alt="Modal Content"
        onClick={(e) => e.stopPropagation()} // 이미지 클릭 시 닫히지 않도록
      />
    </ModalOverlay>
  );
};

export default Modal;
