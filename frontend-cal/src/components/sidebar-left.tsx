'use client'

import * as React from 'react'
import {
  AudioWaveform,
  BookMarked,
  Calendar,
  Command,
  FilePen,
  Home,
  Inbox,
  LogOut,
  MessageCircleQuestion,
  Settings2,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar'
import { TeamSwitcher } from '@/components/team-switcher'
import { CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useLogoutMutation } from '@/store/apiService'
import { useDispatch } from 'react-redux'
import { logoutState } from '@/store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

// Sample data with subparts and sub-subparts
const data = {
  teams: [
    { name: 'CAL', logo: Command, plan: 'Enterprise' },
    { name: 'CAL', logo: AudioWaveform, plan: 'Startup' },
    { name: 'CAL', logo: Command, plan: 'Free' },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: Home,
      subparts: [],
    },
    {
      title: 'Courses',
      url: '#',
      icon: BookMarked,
      subparts: [
        {
          title: 'Math 101',
          url: '#math',
          subsubparts: [
            { title: 'Algebra', url: '#algebra' },
            { title: 'Geometry', url: '#geometry' },
          ],
        },
        {
          title: 'Physics 202',
          url: '#physics',
          subsubparts: [
            { title: 'Kinematics', url: '#kinematics' },
            { title: 'Dynamics', url: '#dynamics' },
          ],
        },
      ],
    },
    {
      title: 'Assignments',
      url: '#',
      icon: FilePen,
      subparts: [
        {
          title: 'Assignment 1',
          url: '#assign1',
          subsubparts: [
            { title: 'Part A', url: '#parta' },
            { title: 'Part B', url: '#partb' },
          ],
        },
      ],
    },

    {
      title: 'Announcements',
      url: '#',
      icon: Inbox,
      badge: '10',
      subparts: [
        {
          title: 'General Updates',
          url: '#updates',
          subsubparts: [
            { title: 'System Maintenance', url: '#maintenance' },
            { title: 'New Features', url: '#features' },
            { title: 'Important Dates', url: '#dates' },
          ],
        },
        {
          title: 'New Policies',
          url: '#policies',
          subsubparts: [
            { title: 'Attendance Policy', url: '#attendance' },
            { title: 'Grading System', url: '#grading' },
            { title: 'Code of Conduct', url: '#conduct' },
          ],
        },
      ],
    },
  ],
  navSecondary: [
    { title: 'Calendar', url: '#', icon: Calendar },
    { title: 'Settings', url: '#', icon: Settings2 },
    { title: 'Logout', url: '#', icon: LogOut },
    { title: 'Trash', url: '#', icon: Trash2 },
    { title: 'Help', url: '#', icon: MessageCircleQuestion },
  ],
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [selectedNav, setSelectedNav] = React.useState<NavItem | null>(null)
  const [selectedSubpart, setSelectedSubpart] = React.useState<Subpart | null>(
    null
  )
  const [selectedSubsubpart, setSelectedSubsubpart] =
    React.useState<Subsubpart | null>(null)
  const [subpartPosition, setSubpartPosition] = React.useState({
    top: 0,
    left: 0,
  })
  const { setOpen } = useSidebar()
  const dispatch = useDispatch()
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      dispatch(logoutState())
      navigate('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  interface NavItem {
    title: string
    url: string
    icon: React.ComponentType
    subparts: Subpart[]
    badge?: string
  }

  interface Subpart {
    title: string
    url: string
    subsubparts: Subsubpart[]
  }

  interface Subsubpart {
    title: string
    url: string
  }

  const handleNavClick = (item: NavItem) => {
    if (selectedNav?.title === item.title) {
      setSelectedNav(null)
    } else {
      setSelectedNav(item)
      setOpen(true)
    }
    setSelectedSubpart(null)
    setSelectedSubsubpart(null)
  }

  const handleSubpartClick = (subpart: Subpart, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setSubpartPosition({
      top: rect.top,
      left: rect.right + 8, // 8px offset from the button
    })
    setSelectedSubpart(subpart)
    setSelectedSubsubpart(null)
  }

  const handleSubsubpartClick = (subsubpart: Subsubpart) => {
    setSelectedSubsubpart(subsubpart)
  }

  return (
    <div className='flex h-screen'>
      {/* Left Sidebar */}
      <Sidebar className='w-60 border-r' {...props} collapsible='icon'>
        <SidebarHeader className='py-3 pl-2 pr-4'>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent className='flex-col justify-between px-2'>
          <nav className='space-y-1'>
            {data.navMain.map((item) => (
              <div key={item.title}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <SidebarMenuButton
                        className={`flex w-56 items-center justify-between rounded-md py-2 pl-2 pr-4 text-left text-sm ${
                          selectedNav?.title === item.title ? 'bg-accent' : ''
                        }`}
                        onClick={() => handleNavClick(item)}
                      >
                        <div className='flex items-center'>
                          <item.icon className='mr-3 size-5' />
                          <span className='flex-1'>{item.title}</span>
                        </div>
                        {item.subparts.length > 0 && (
                          <span className='ml-2'>
                            {selectedNav?.title === item.title ? (
                              <ChevronDown className='size-4' />
                            ) : (
                              <ChevronRight className='size-4' />
                            )}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {selectedNav?.title === item.title &&
                  item.subparts.length > 0 && (
                    <div className='space-y-1 pl-8'>
                      {item.subparts.map((subpart) => (
                        <SidebarMenuButton
                          key={subpart.title}
                          className={`w-full text-left text-sm ${
                            selectedSubpart?.title === subpart.title
                              ? 'bg-accent'
                              : ''
                          } hover:bg-accent`}
                          onClick={(e) => handleSubpartClick(subpart, e)}
                        >
                          {subpart.title}
                        </SidebarMenuButton>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </nav>
          <nav className='space-y-1'>
            {data.navSecondary.map((item) => (
              <SidebarMenuButton
                key={item.title}
                onClick={() => {
                  if (item.title === 'Logout') {
                    handleLogout()
                  } else {
                    window.location.href = item.url
                  }
                }}
                className='flex items-center rounded-md py-2 pl-2 pr-4 text-sm'
              >
                <item.icon className='mr-3 flex size-5' />
                <span>{item.title}</span>
              </SidebarMenuButton>
            ))}
          </nav>
        </SidebarContent>
      </Sidebar>

      {/* Floating Panel for Subparts */}
      {selectedSubpart && (
        <div
          className='fixed z-50 w-64 rounded-md border bg-background shadow-lg'
          style={{
            top: `${subpartPosition.top}px`,
            left: `${subpartPosition.left}px`,
            maxHeight: '300px',
            overflow: 'auto',
          }}
        >
          <CardHeader className='p-4'>
            <CardTitle className='text-lg'>{selectedSubpart.title}</CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <ul className='space-y-2'>
              {selectedSubpart.subsubparts.map((subsubpart) => (
                <li key={subsubpart.title}>
                  <SidebarMenuButton
                    className={`w-full ${
                      selectedSubsubpart?.title === subsubpart.title
                        ? 'bg-accent'
                        : ''
                    }`}
                    onClick={() => handleSubsubpartClick(subsubpart)}
                  >
                    {subsubpart.title}
                  </SidebarMenuButton>
                </li>
              ))}
            </ul>
          </CardContent>
        </div>
      )}
    </div>
  )
}
