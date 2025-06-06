// components/common/Button.tsx
import styled, { css } from "styled-components";

type ButtonProps = {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
};

export const CommonButton = styled.button<ButtonProps>`
  padding: 10px 20px;
  font-weight: bold;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: ${({ theme }) => theme.colors.textLight};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};

  ${({ theme, variant = "primary" }) => {
    switch (variant) {
      case "primary":
        return css`
          background-color: ${theme.colors.accentBlue};
          &:hover {
            background-color: ${theme.colors.accentBlueHover};
          }
        `;
      case "secondary":
        return css`
          background-color: ${theme.colors.gray};
          &:hover {
            background-color: ${theme.colors.grayDark};
          }
        `;
      case "danger":
        return css`
          background-color: ${theme.colors.red};
          &:hover {
            background-color: ${theme.colors.redDark};
          }
        `;
    }
  }}
`;
