import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Home,
  Layers,
  LogOut,
  Megaphone,
  MoreHorizontal,
  Package,
  Plus,
  Settings,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";

const desktopNav = [
  { label: "Dashboard", to: "/", icon: BarChart3 },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Content", to: "/content", icon: ClipboardList },
  { label: "Campaigns", to: "/campaigns", icon: Megaphone },
  { label: "Products", to: "/products", icon: Package },
  { label: "Settings", to: "/settings", icon: Settings },
];

const mobileNav = [
  { label: "Home", to: "/", icon: Home },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Content", to: "/content", icon: Layers },
  { label: "More", to: "/settings", icon: MoreHorizontal },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-line bg-white px-5 py-6 lg:flex lg:flex-col">
        <button className="mb-8 text-left" onClick={() => navigate("/")} type="button">
          <p className="font-display text-3xl leading-none">Dare & Rise</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ink/50">Social Planner</p>
        </button>
        <nav className="space-y-1">
          {desktopNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition",
                  isActive ? "bg-ink text-white" : "text-ink/65 hover:bg-paper hover:text-ink",
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-line bg-paper p-3">
          <p className="truncate text-sm font-extrabold">{user?.displayName ?? "Planner"}</p>
          <p className="truncate text-xs font-semibold text-ink/50">{user?.email}</p>
          <Button variant="ghost" className="mt-3 w-full justify-start px-2" onClick={() => void logout()} icon={<LogOut size={16} />}>
            Logout
          </Button>
        </div>
      </aside>

      <main className="min-h-screen px-4 pb-24 pt-5 sm:px-6 lg:ml-72 lg:px-8 lg:pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <button className="text-left" onClick={() => navigate("/")} type="button">
              <p className="font-display text-2xl leading-none">Dare & Rise</p>
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink/50">Social Planner</p>
            </button>
            <Button className="h-11 w-11 p-0" onClick={() => navigate("/content/new")} aria-label="Create content">
              <Plus size={20} />
            </Button>
          </div>
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pb-2 pt-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1">
          {mobileNav.slice(0, 2).map((item) => (
            <MobileNavItem key={item.to} item={item} pathname={location.pathname} />
          ))}
          <button
            type="button"
            onClick={() => navigate("/content/new")}
            className="mx-auto flex h-14 w-14 -translate-y-3 items-center justify-center rounded-full bg-ink text-white shadow-soft"
            aria-label="Create content"
          >
            <Plus size={24} />
          </button>
          {mobileNav.slice(2).map((item) => (
            <MobileNavItem key={item.to} item={item} pathname={location.pathname} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function MobileNavItem({
  item,
  pathname,
}: {
  item: { label: string; to: string; icon: typeof Home };
  pathname: string;
}) {
  const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
  return (
    <NavLink
      to={item.to}
      className={cn(
        "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-bold",
        active ? "text-ink" : "text-ink/45",
      )}
    >
      <item.icon size={20} />
      {item.label}
    </NavLink>
  );
}
