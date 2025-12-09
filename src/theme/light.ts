import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';

const lightTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,

  token: {
    colorPrimary: '#020819', // Brand color
    colorBgBase: '#ffffff', // Main background
    colorTextBase: '#000000', // Main text color
    colorBgContainer: '#ffffff', // Cards, Inputs, Header
    colorBorder: '#e5e7eb', // Light border
    borderRadius: 12,

    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  components: {
    Layout: {
      headerBg: '#ffffff', // Navbar background
      siderBg: '#ffffff', // Sidebar light gray
      bodyBg: '#f9fafb',
    },

    Button: {
      colorPrimary: '#020819',
      colorTextLightSolid: '#ffffff',
      borderRadius: 10,
      fontSize: 14,
      paddingInline: 16,
      paddingBlock: 10,
    },

    Input: {
      colorBgContainer: '#ffffff',
      borderRadius: 8,
      paddingBlock: 10,
      colorBorder: '#d1d5db',
      activeBorderColor: '#020819',
      hoverBorderColor: '#020819',
    },

    Card: {
      colorBgContainer: '#ffffff',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    },

    Menu: {
      // itemColor: '#ffffff',
      itemHoverColor: '#7592ff',
      itemSelectedColor: '#ffffff',
      itemSelectedBg: '#000000',
    },
    Badge: {
      colorBgContainer: '#020819',
    },
  },
};

export default lightTheme;
