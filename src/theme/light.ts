// src/theme/lightTheme.ts
import { theme as antdTheme } from "antd";
import type { ThemeConfig } from "antd";

const lightTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: "#020819",
    colorBgBase: "#ffffff",
    colorTextBase: "#000000",
    borderRadius: 12,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Button: {
      colorPrimary: "#020819",
      colorTextLightSolid: "#ffffff",
    },
    Input: {
      colorBgContainer: "#ffffff",
      borderRadius: 8,
      paddingBlock: 10,
    },
    Card: {
      colorBgContainer: "#ffffff",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },
  },
};

export default lightTheme;
