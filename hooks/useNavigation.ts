import { create } from 'zustand';

interface NavigationStore {
  currentPath: string;
  navigate: (path: string) => void;
}

export const useNavigation = create<NavigationStore>((set) => ({
  currentPath: window.location.pathname,
  navigate: (path: string) => {
    window.history.replaceState({}, '', path);
    set({ currentPath: path });
    window.scrollTo(0, 0);
  },
}));

window.addEventListener('popstate', () => {
  const newPath = window.location.pathname;
  useNavigation.setState({ currentPath: newPath });
});
