import React from "react";
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
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  object-fit: contain;
`;

interface ModalProps {
  image: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ image, onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalImage src={image} alt="Character" />
    </ModalOverlay>
  );
};

export default Modal;
