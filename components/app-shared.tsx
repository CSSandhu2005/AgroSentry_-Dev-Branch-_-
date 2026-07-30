import type { ReactNode } from "react";
import {
  LayoutDashboardIcon,
  UserIcon,
  SparklesIcon,
  CalendarIcon,
  ActivityIcon,
  ZapIcon,
  RefreshCwIcon,
  MapIcon,
  FileTextIcon,
  MessageSquareIcon,
  NavigationIcon,
  ClockIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  CpuIcon,
  LeafIcon,
  RadioIcon,
  LayersIcon,
} from "lucide-react";

export type SidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    label: "Executive Intelligence",
    items: [
      {
        title: "Executive Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboardIcon />,
        isActive: true,
      },
      {
        title: "Advisory Reports",
        path: "/reports",
        icon: <FileTextIcon />,
      },
    ],
  },
  {
    label: "Farm Intelligence",
    items: [
      {
        title: "Farmer Profile",
        path: "/profile",
        icon: <UserIcon />,
      },
      {
        title: "Crop Recommendation",
        path: "/recommendation",
        icon: <SparklesIcon />,
      },
      {
        title: "Crop Lifecycle Schedule",
        path: "/plan",
        icon: <CalendarIcon />,
      },
      {
        title: "Disease Diagnosis",
        path: "/disease",
        icon: <ActivityIcon />,
      },
      {
        title: "Nutrient Risk",
        path: "/nutrient",
        icon: <ZapIcon />,
      },
      {
        title: "Dynamic Replanner",
        path: "/replanner",
        icon: <RefreshCwIcon />,
      },
      {
        title: "Farm Digital Twin",
        path: "/spatial-planner",
        icon: <MapIcon />,
      },
    ],
  },
  {
    label: "AI Workspace",
    items: [
      {
        title: "AI Chat Assistant",
        path: "/agent-chat",
        icon: <MessageSquareIcon />,
      },
    ],
  },
  {
    label: "Autonomous Mission Operations",
    items: [
      {
        title: "Mission Control",
        path: "/autonomous/mission-control",
        icon: <ActivityIcon />,
      },
      {
        title: "Mission Planner",
        path: "/autonomous/mission-planner",
        icon: <CalendarIcon />,
      },
      {
        title: "Mission Queue",
        path: "/autonomous/mission-queue",
        icon: <ClockIcon />,
      },
      {
        title: "Live Operations",
        path: "/autonomous/live-operations",
        icon: <RadioIcon />,
      },
      {
        title: "Mission Replay",
        path: "/autonomous/mission-replay",
        icon: <SparklesIcon />,
      },
      {
        title: "Targeted Spraying",
        path: "/autonomous/spray",
        icon: <ShieldCheckIcon />,
      },
      {
        title: "Mission History",
        path: "/autonomous/mission-history",
        icon: <FileTextIcon />,
      },
      {
        title: "Mission Analytics",
        path: "/autonomous/mission-analytics",
        icon: <BarChart3Icon />,
      },
      {
        title: "Fleet & Profiles",
        path: "/autonomous/fleet",
        icon: <NavigationIcon />,
      },
      {
        title: "Edge AI & Hardware",
        path: "/autonomous/edge-ai",
        icon: <CpuIcon />,
      },
      {
        title: "SDG Impact Engine",
        path: "/autonomous/sdg-impact",
        icon: <LeafIcon />,
      },
      {
        title: "Executive Reports",
        path: "/autonomous/reports",
        icon: <FileTextIcon />,
      },
    ],
  },
];

export const navLinks: SidebarNavItem[] = navGroups.flatMap((g) => g.items);
