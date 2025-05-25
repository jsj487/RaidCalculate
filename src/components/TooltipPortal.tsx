import ReactDOM from "react-dom";
import React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  targetRect: DOMRect | null;
}

const TooltipPortal: React.FC<Props> = ({ children, targetRect }) => {
  const [tooltipContainer, setTooltipContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    const el = document.getElementById("tooltip-root");
    setTooltipContainer(el);
  }, []);

  if (!tooltipContainer || !targetRect) return null;

  const style = {
    position: "fixed" as const,
    top: `${targetRect.top - 100}px`,
    left: `${targetRect.left + targetRect.width / 2}px`,
    transform: "translateX(-50%)",
    zIndex: 9999,
  };

  return ReactDOM.createPortal(
    <div style={style}>{children}</div>,
    tooltipContainer
  );
};

export default TooltipPortal;
