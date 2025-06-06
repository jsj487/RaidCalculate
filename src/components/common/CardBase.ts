import styled, { css } from "styled-components";

type CardVariant = "default" | "add" | "character" | "material";

type CardBaseProps = {
  variant?: CardVariant;
};

export const CardBase = styled.div<CardBaseProps>`
  width: 100%;
  max-width: 250px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.normal};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  color: ${({ theme }) => theme.textPrimary};
  text-align: center;
  cursor: ${({ variant }) => (variant === "add" ? "pointer" : "default")};
  display: flex;

  &:hover {
    background-color: ${({ theme, variant }) =>
      variant === "add" ? "#3a3a3a" : theme.cardBackground};
  }

  ${({ variant }) =>
    variant === "character" &&
    css`
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 12px;
      width: 220px;
      min-height: 400px;
    `}

  ${({ variant }) =>
    variant === "material" &&
    css`
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 20px;
      padding: 20px;
      width: 100%;
      max-width: 700px;
      background-color: ${({ theme }) => theme.colors.surface};
      box-shadow: ${({ theme }) => theme.shadow.normal};
      border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    `}
`;
