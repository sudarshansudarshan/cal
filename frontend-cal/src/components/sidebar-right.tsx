// Import React and required icons
import * as React from 'react'
import { Plus } from 'lucide-react'

// Import custom components
import { Calendars } from '@/components/calendars'
import { DatePicker } from '@/components/date-picker'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Import proctoring related components
import CameraAndMicCheck from './proctoring-components/CameraAndMicCheck'
import { ModeToggle } from './mode-toggle'
import ParentComponent from './proctoring-components/ParentComponent'
import BlurDetectction from './proctoring-components/BlurDetection'
import SnapshotRecorder from './proctoring-components/SnapshotRecorder'

// Sample data for user profile and calendars
const data = {
  // User profile information
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  // Calendar sections with empty items arrays
  calendars: [
    {
      name: 'My Schedules',
      items: [],
    },
    {
      name: 'Announcements',
      items: [],
    },
    {
      name: 'Updates',
      items: [],
    },
  ],
}

// SidebarRight component that displays user profile, calendars and proctoring tools
export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible='none'
      className='sticky top-0 hidden h-svh border-l lg:flex'
      {...props}
    >
      {/* Header section with user profile */}
      <SidebarHeader className='h-16 border-b border-sidebar-border'>
        <NavUser user={data.user} />
      </SidebarHeader>

      {/* Main content section with calendars */}
      <SidebarContent>
        <Calendars calendars={data.calendars} />
      </SidebarContent>

      {/* Footer section with proctoring tools and new schedule button */}
      <SidebarFooter>
        <SidebarMenu>
          {/* <ParentComponent /> */}
          {/* <CameraAndMicCheck /> */}
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Schedule</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
