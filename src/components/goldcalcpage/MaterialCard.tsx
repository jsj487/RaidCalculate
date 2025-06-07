import styled from "styled-components";
import { CardBase } from "../common/CardBase";

export const MaterialCard = styled(CardBase).attrs({
  variant: "material",
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;
