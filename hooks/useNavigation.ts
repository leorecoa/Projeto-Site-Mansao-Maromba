import { create } from 'zustand'

interface NavigationStore {
  currentPath: string
  navigate: (path: string) => void
}

export const useNavigation = create<NavigationStore>((set) => ({
  currentPath: window.location.pathname,
  navigate: (path: string) => {
    window.history.pushState({}, '', path)
    set({ currentPath: path })
  }
}))

// Sincronizar com botão voltar do navegador
window.addEventListener('popstate', () => {
  useNavigation.setState({ currentPath: window.location.pathname })
})
