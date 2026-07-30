import type { ReactNode } from "react";
import { LayoutDashboardIcon, UserIcon, SparklesIcon, CalendarIcon, ActivityIcon, ZapIcon, RefreshCwIcon, MapIcon, FileTextIcon, MessageSquareIcon } from "lucide-react";

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
		label: "Farm Management",
		items: [
			{
				title: "Dashboard",
				path: "/dashboard",
				icon: <LayoutDashboardIcon />,
				isActive: true,
			},
			{
				title: "Farmer Profile",
				path: "/profile",
				icon: <UserIcon />,
			},
		],
	},
	{
		label: "AI Intelligence",
		items: [
			{
				title: "Crop Recommendation",
				path: "/recommendation",
				icon: <SparklesIcon />,
			},
			{
				title: "Crop Plan",
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
		],
	},
	{
		label: "Precision & Reports",
		items: [
			{
				title: "Spatial Twin",
				path: "/spatial-planner",
				icon: <MapIcon />,
			},
			{
				title: "Advisory Reports",
				path: "/reports",
				icon: <FileTextIcon />,
			},
			{
				title: "AI Chat Assistant",
				path: "/agent-chat",
				icon: <MessageSquareIcon />,
			},
		],
	},
];

export const navLinks: SidebarNavItem[] = navGroups.flatMap((g) => g.items);
