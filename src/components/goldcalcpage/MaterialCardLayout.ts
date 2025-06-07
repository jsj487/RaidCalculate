import styled from "styled-components";

export const MaterialLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const MaterialRight = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
`;

export const MaterialCharacterImage = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
`;

export const MaterialCharacterInfo = styled.div`
  margin-top: 10px;
`;

export const InfoText = styled.p`
  font-size: 14px; // 기존보다 한 단계 키움
  color: ${({ theme }) => theme.colors.textDefault};
  margin: 0;
  line-height: 1.5;
`;

export const SectionTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textBright};
`;

export const MaterialList = styled.ul`
  list-style: none;
  padding: 10px;
  margin: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

export const MaterialItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};

  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 6px;
  }

  strong {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textBright};
  }

  span {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.lightGray};
  }
`;

export const MaterialSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const GoldSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
