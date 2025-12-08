import { StyleProvider } from "@ant-design/cssinjs";
import { Button, ConfigProvider } from "antd";
import { Suspense } from "react";
import { PublicRoutes } from "@/routes";
import { darkTheme, lightTheme } from "@/theme";
import { useThemeStore } from "@/store";

function ThemeToggle() {
  const { isDark, theme, setTheme } = useThemeStore();

  return (
    <div style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}>
      <Button
        type="text"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        style={{ color: isDark ? "#aaa" : "#666" }}
      >
        {isDark ? "Light" : "Dark"}
      </Button>
    </div>
  );
}

function App() {
  const { isDark } = useThemeStore();
  console.log("App render with isDark:", isDark);
  console.log("Current theme in document:", lightTheme);

  return (
    <ConfigProvider theme={isDark ? darkTheme : lightTheme}>
      <StyleProvider hashPriority="high">
        <div className="app-root">
          <ThemeToggle />
          <Suspense fallback={<div>Loading...</div>}>
            {/* <ErrorBoundary>/ */}
            <PublicRoutes />
            {/* </ErrorBoundary> */}
          </Suspense>
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
}

export default App;
