// store/useLayoutStore.ts
import { create } from 'zustand';

interface ILayoutState {
  sidebarCollapsed: boolean;
  selectedMenuKey: string;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedMenuKey: (key: string) => void;
}

export const useLayoutStore = create<ILayoutState>(set => ({
  sidebarCollapsed: false,
  selectedMenuKey: 'dashboard',

  toggleSidebar: () =>
    set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed: boolean) =>
    set({ sidebarCollapsed: collapsed }),

  setSelectedMenuKey: (key: string) => set({ selectedMenuKey: key }),
}));
