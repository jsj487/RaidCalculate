import styled from "styled-components";

export const TooltipIcon = styled.span`
  display: inline-block;
  margin-left: 6px;
  width: 16px;
  height: 16px;
  background-color: #555;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  text-align: center;
  line-height: 16px;
  cursor: help;
  position: relative;
`;

export const TooltipText = styled.div`
  visibility: hidden;
  opacity: 0;
  width: max-content;
  max-width: 220px;
  background-color: #333;
  color: #fff;
  text-align: left;
  border-radius: 6px;
  padding: 8px;
  font-size: 13px;
  position: absolute;
  z-index: 100;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.2s;

  ${TooltipIcon}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;
