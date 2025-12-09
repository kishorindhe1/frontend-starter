import { PublicRoutes } from '@/routes';
import { useThemeStore } from '@/store';
import { darkTheme, lightTheme } from '@/theme';
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import { Suspense, type FC } from 'react';

const App: FC = () => {
  const { isDark } = useThemeStore();
  return (
    <ConfigProvider theme={isDark ? darkTheme : lightTheme}>
      <StyleProvider hashPriority="high">
        <div className="app-root">
          <Suspense fallback={<div>Loading...</div>}>
            {/* <ErrorBoundary>/ */}
            <PublicRoutes />
            {/* </ErrorBoundary> */}
          </Suspense>
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default App;
