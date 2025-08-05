const breakpoints = {
  mobileSmall: "575px",
  mobile: "767px",
  tablet: "1024px",
  laptop: "1439px",
  desktop: "1440px",
};

export const theme = {
  colors: {
    background: "#1e1e1e", // 전체 배경
    surface: "#2e2e2e", // 카드 배경 (기존보다 더 밝게)
    cardBorder: "#555", // 카드 경계선 강조
    container: "#2a2a2a",
    divider: "#444",
    textDefault: "#ddd",
    textSub: "#aaa",
    textMuted: "#888",
    accentBlue: "#3043ff",
    accentBlueHover: "#2a39d6",
    red: "#ff4d4d",
    redDark: "#e63939",
    lightGray: "#ccc",
    textBright: "#f5f5f5",
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
  borderRadius: "8px",
  shadow: {
    normal: "0 4px 12px rgba(0, 0, 0, 0.4)",
    heavy: "0 6px 12px rgba(0, 0, 0, 0.2)",
  },
  transition: "0.3s ease",

  breakpoints,
  device: {
    mobileSmall: `(max-width: ${breakpoints.mobileSmall})`,
    mobile: `(max-width: ${breakpoints.mobile})`,
    tablet: `(max-width: ${breakpoints.tablet})`,
    laptop: `(max-width: ${breakpoints.laptop})`,
    desktop: `(min-width: ${breakpoints.desktop})`,
  },
};
