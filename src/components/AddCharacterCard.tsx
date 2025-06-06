import styled from "styled-components";
import { CardBase } from "./common/CardBase";

export const AddCharacterCard = styled(CardBase).attrs({
  variant: "add",
})`
  border: 2px dashed ${({ theme }) => theme.colors.lightGray};
  background-color: transparent;
  justify-content: center;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }
`;
