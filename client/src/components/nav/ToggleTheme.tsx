
import { useTheme } from '../../hooks/ThemeContext'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-md border"
    >
      {theme === 'light' ? '☀️' : '🌙'}
    </button>
  )
}