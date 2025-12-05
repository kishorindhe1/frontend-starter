import { StyleProvider } from "@ant-design/cssinjs";
import { Button, ConfigProvider, theme } from "antd";
import { useState } from "react";
import PublicRoutes from "./routes/public-routes";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const customDarkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: "#020819", // Your main brand color
      colorBgBase: "#020819", // Base background
      colorTextBase: "#ffffff",
      colorBgContainer: "#0f0f0f", // Slightly lighter containers (cards, modals)
      colorBorder: "#434343",
      colorBorderSecondary: "#333333", // Often used for Card borders specifically
      borderRadius: 6,

      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: 14,
    },
    components: {
      Form: {
        labelAlign: "left", // or "right" (common in dashboards)
        labelWrap: true, // auto wrap long labels
        colon: false,
        // Vertical spacing between label and input (when labels are above)
        itemMarginBottom: 24, // default is 24, reduce/increase as needed

        // Horizontal layout: distance between label and input
        labelColSpacing: 1, // space when label is on the left
        wrapperColSpacing: 8,

        // Label font weight & size (optional polish)
        labelFontWeight: 600,
        labelColor: "#e0e0e0",
        labelRequiredColor: "#ff4d4f", // red * for required
      },
      Button: {
        colorPrimary: "#ffffff",
        colorTextLightSolid: "#020819",
      },
      Input: {
        colorBgContainer: "#020819", // Darker input bg for contrast
        colorTextPlaceholder: "#9ca3af", // ← placeholder when empty
        borderRadius: 8,
        paddingBlock: 10,
        activeBorderColor: "#ffffff", // Main glow color
        hoverBorderColor: "#ffffff", // Slightly dimmer on hover
        colorPrimaryHover: "#00d4ff", // Reinforces the glow
        colorError: "#ff4d4f",
        colorErrorBorderHover: "#ff4d4f",
        colorErrorOutline: "rgba(255, 77, 79, 0.3)",
      },
      Card: {
        colorBgContainer: "#020819",
        borderRadius: 16,
        borderColor: "#434343",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
      },
      Layout: {
        colorBgLayout: "#020819",
      },
      // Optional: style GitHub/Facebook buttons
      // You can further customize if using Ant Design's built-in social buttons
    },
  };

  const customLightTheme = {
    algorithm: theme.defaultAlgorithm,
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
      },
      Card: {
        colorBgContainer: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      },
    },
  };

  return (
    <ConfigProvider theme={darkMode ? customDarkTheme : customLightTheme}>
      <StyleProvider hashPriority="high">
        <div
          style={{
            minHeight: "100vh",
            background: darkMode ? "#020819" : "#f9f9f9",
            backgroundImage: darkMode
              ? "radial-gradient(circle at top left, #020819 0%, transparent 50%), radial-gradient(circle at bottom right, #0f0f0f 0%, transparent 60%)"
              : "linear-gradient(to bottom, #f0f4ff, #ffffff)",
            transition: "all 0.4s ease",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Optional: Theme Toggle Button */}
          <div style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}>
            <Button
              onClick={() => setDarkMode(!darkMode)}
              type="text"
              style={{ color: darkMode ? "#aaa" : "#666" }}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>

          <PublicRoutes />
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
}

export default App;
