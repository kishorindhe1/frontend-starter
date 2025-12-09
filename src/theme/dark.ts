// src/theme/darkTheme.ts
import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';

const darkTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: '#020819',
    colorBgBase: '#020819',
    colorTextBase: '#ffffff',
    colorBgContainer: '#0f0f0f',
    colorBorder: '#434343',
    colorBorderSecondary: '#333333',
    borderRadius: 4,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
  },
  components: {
    Form: {
      labelAlign: 'left',
      colon: false,
      itemMarginBottom: 24,
      labelFontWeight: 600,
      labelColor: '#e0e0e0',
      labelRequiredColor: '#ff4d4f',
    },
    Button: {
      colorPrimary: '#ffffff',
      colorTextLightSolid: '#020819', // this is the correct token name
      colorPrimaryHover: '#9ca3af',
    },
    Input: {
      colorBgContainer: '#020819',
      colorTextPlaceholder: '#9ca3af',
      borderRadius: 8,
      paddingBlock: 10,
      activeBorderColor: '#ffffff',
      hoverBorderColor: '#ffffff',
      colorPrimaryHover: '#00d4ff',
      colorError: '#ff4d4f',
      colorErrorBorderHover: '#ff4d4f',
      colorErrorOutline: 'rgba(255, 77, 79, 0.3)',
    },
    Card: {
      colorBgContainer: '#020819',
      borderRadius: 16,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    },
    Menu: {
      itemColor: '#ffffff',
      itemHoverColor: '#7592ff',
      itemSelectedColor: '#ffffff',
      itemSelectedBg: '#465fff',
    },
    Layout: {
      colorBgLayout: '#020819',
    },
  },
};

export default darkTheme;
