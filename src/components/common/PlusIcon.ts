import styled from "styled-components";
import { FaUserPlus } from "react-icons/fa6";

export const PlusIcon = styled(FaUserPlus)`
  font-size: 48px;
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
