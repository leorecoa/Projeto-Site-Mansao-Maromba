import { create } from 'zustand'

interface NavigationStore {
  currentPath: string
  navigate: (path: string) => void
}

export const useNavigation = create<NavigationStore>((set) => ({
  currentPath: window.location.pathname,
  navigate: (path: string) => {
    console.log('Navegando para:', path)
    window.history.pushState({}, '', path)
    set({ currentPath: path })
    console.log('currentPath atualizado para:', path)
    window.scrollTo(0, 0)
  }
}))

window.addEventListener('popstate', () => {
  const newPath = window.location.pathname
  console.log('Popstate detectado:', newPath)
  useNavigation.setState({ currentPath: newPath })
})
