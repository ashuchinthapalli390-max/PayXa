import {
  BarChart3,
  Bell,
  Code2,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Link2,
  Package,
  QrCode,
  Settings,
  Smartphone,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type DashNavItem = { label: string; href: string; icon: LucideIcon; badge?: string };

export const dashNav: { group: string; items: DashNavItem[] }[] = [
  {
    group: "Operate",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Payments", href: "/dashboard/payments", icon: CreditCard, badge: "3" },
      { label: "Orders", href: "/dashboard/orders", icon: Package },
      { label: "Payment Links", href: "/dashboard/links", icon: Link2 },
      { label: "QR Payments", href: "/dashboard/qr", icon: QrCode },
      { label: "Customers", href: "/dashboard/customers", icon: Users },
    ],
  },
  {
    group: "Monitor",
    items: [
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "Devices", href: "/dashboard/devices", icon: Smartphone },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ],
  },
  {
    group: "Build",
    items: [
      { label: "Developers", href: "/dashboard/developers", icon: Code2 },
      { label: "Team", href: "/dashboard/team", icon: UsersRound },
      { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];
