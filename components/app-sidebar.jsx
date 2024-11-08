"use client"

import * as React from "react"
import {
  Home,
  Building,
  User,
  ShoppingCart,
  Briefcase,
  Box,
  Square,
  Tag,
  Users,
  FolderOpen,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      id: "",
      title: "Dashboard",
      icon: Home,
      url: "#",
    },
    {
      id: "organizations",
      title: "Organization",
      icon: Building,
      url: "organizations",
    },
    {
      id: "users",
      title: "Users",
      icon: User,
      url: "users",
    },
    {
      id: "products",
      title: "Products",
      icon: ShoppingCart,
      url: "products",
    },
    {
      id: "vendors",
      title: "Vendors",
      icon: Briefcase,
      url: "vendors",
    },
    {
      id: "units",
      title: "Units",
      icon: Box,
      url: "units",
    },
    {
      id: "POS",
      title: "POS",
      icon: Square,
      url: "POS",
      
    },
    {
      id: "brands",
      title: "Brands",
      icon: Tag,
      url: "brands",
    },
    {
      id: "customers",
      title: "Customers",
      icon: Users,
      url: "customers",
    },
    {
      id: "companies",
      title: "Companies",
      icon: Building,
      url: "companies",
    },
    {
      id: "product_categories",
      title: "Product Categories",
      icon: FolderOpen,
      url: "product_categories",
    },
   
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};


export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
