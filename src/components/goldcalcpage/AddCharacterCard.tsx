import styled from "styled-components";
import { CardBase } from "../common/CardBase";

export const AddCharacterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  margin-top: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textBright};
  font-size: 16px;
  font-weight: bold;
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow.normal};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentBlue};
    color: #fff;
    border-color: ${({ theme }) => theme.colors.accentBlue};
  }
`;
