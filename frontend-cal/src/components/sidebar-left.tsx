"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookMarked,
  Calendar,
  Command,
  File,
  FilePen,
  Home,
  Inbox,
  LogOut,
  MessageCircleQuestion,
  Settings2,
  Trash2,
} from "lucide-react";

import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { TeamSwitcher } from "@/components/team-switcher";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";


// Sample data with subparts for each navigation item
const data = {
  teams: [
    { name: "CAL", logo: Command, plan: "Enterprise" },
    { name: "CAL", logo: AudioWaveform, plan: "Startup" },
    { name: "CAL", logo: Command, plan: "Free" },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
      subparts: [],
    },
    {
      title: "Courses",
      url: "#",
      icon: BookMarked,
      subparts: [
        { title: "Math 101", url: "#math" },
        { title: "Physics 202", url: "#physics" },
        { title: "Biology 303", url: "#biology" },
      ],
    },
    {
      title: "Assignments",
      url: "#",
      icon: FilePen,
      subparts: [
        { title: "Assignment 1", url: "#assign1" },
        { title: "Assignment 2", url: "#assign2" },
      ],
    },
    {
      title: "Announcements",
      url: "#",
      icon: Inbox,
      badge: "10",
      subparts: [
        { title: "General Updates", url: "#updates" },
        { title: "New Policies", url: "#policies" },
      ],
    },
  ],
  navSecondary: [
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Settings", url: "#", icon: Settings2 },
    { title: "Logout", url: "#", icon: LogOut },
    { title: "Trash", url: "#", icon: Trash2 },
    { title: "Help", url: "#", icon: MessageCircleQuestion },
  ],
};

export function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [selectedNav, setSelectedNav] = React.useState(null);

  const { toggleSidebar } = useSidebar();
  const handleNavClick = (item) => {
    if (selectedNav?.title === item.title) {
      setSelectedNav(null); // Close the subparts panel if the same item is clicked again
    } else {
      setSelectedNav(item); // Open subparts panel
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar className="w-60 border-r" {...props} collapsible="icon">
        <SidebarHeader className="pr-4 pl-2 py-3">
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent className="flex-col justify-between px-2">
          <nav className="space-y-1">
            {data.navMain.map((item) => (
              <button
                key={item.title}
                className={`flex items-center text-left w-auto pl-2 pr-4 py-2 text-sm rounded-md ${selectedNav?.title === item.title
                    ? "underline"
                    : ""
                  }`}
                onClick={() => {
                  handleNavClick(item);
                  { selectedNav === null ? toggleSidebar() : null }
                  console.log("Selected NAv", selectedNav)
                }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="flex-1">{item.title}</span>
              </button>
            ))}
          </nav>
          <nav className="space-y-1">
            {data.navSecondary.map((item) => (
              <button
                key={item.title}
                href={item.url}
                className="flex items-center pl-2 pr-4 py-2 text-sm rounded-md"
              >
                <item.icon className="w-5 h-5 mr-3 flex" />
                <span>{item.title}</span>
              </button>
            ))}
          </nav>
        </SidebarContent>
      </Sidebar>

      {/* Subparts Panel */}
      {selectedNav && selectedNav.subparts.length > 0 && (
        <Card className="w-56 border rounded-none">
          <CardHeader>
            <CardTitle className="text-lg">{selectedNav.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="mt-2 w-full">
              {selectedNav.subparts.map((subpart) => (
                <li key={subpart.title}>
                  <a
                    href={subpart.url}
                    className="block px-3 py-2 text-sm font-medium rounded"
                  >
                    {subpart.title}
                  </a>
                  <Separator />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
