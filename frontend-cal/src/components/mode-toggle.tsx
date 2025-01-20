// Import sun and moon icons from Lucide
import { Moon, Sun } from 'lucide-react'

// Import custom button component and theme hook
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'

// Component for toggling between light and dark themes
export function ModeToggle() {
  // Get current theme and setter function from theme context
  const { theme, setTheme } = useTheme()

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    // Button that triggers theme toggle
    <Button variant='outline' size='icon' onClick={toggleTheme}>
      {/* Sun icon that rotates and scales based on theme */}
      <Sun className='size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      {/* Moon icon that rotates and scales based on theme */}
      <Moon className='absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      {/* Screen reader text for accessibility */}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
