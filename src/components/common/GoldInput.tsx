import styled from "styled-components";

export const GoldInput = styled.input`
  width: 100px;
  padding: 5px 8px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textDefault};
  text-align: right;
  box-shadow: none;
  outline: none;
`;
