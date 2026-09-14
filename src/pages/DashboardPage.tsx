import { addMonths, endOfMonth, isAfter, isBefore, startOfMonth } from "date-fns";
import { CalendarDays, CheckCircle2, Clock, Film, Grid2X2, Image, Layers, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContentCard } from "../components/content/ContentCard";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { usePlannerData } from "../hooks/usePlannerData";
import type { ContentFormat, ContentStatus } from "../types";

export function DashboardPage() {
  const navigate = useNavigate();
  const { content, products, campaigns, loading } = usePlannerData();
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const thisMonth = content.filter((item) => item.scheduledDate && isAfter(item.scheduledDate, monthStart) && isBefore(item.scheduledDate, monthEnd));
  const upcoming = content
    .filter((item) => item.scheduledDate && isAfter(item.scheduledDate, now) && isBefore(item.scheduledDate, addMonths(now, 2)))
    .slice(0, 6);

  const stats = [
    { label: "Content planned this month", value: thisMonth.length, icon: CalendarDays },
    { label: "Reels", value: countFormat(thisMonth, "reel"), icon: Film },
    { label: "Posts", value: countFormat(thisMonth, "post"), icon: Image },
    { label: "Carousels", value: countFormat(thisMonth, "carousel"), icon: Grid2X2 },
    { label: "Stories", value: countFormat(thisMonth, "story"), icon: Sparkles },
    { label: "Ready to publish", value: countStatus(content, "ready"), icon: CheckCircle2 },
    { label: "Published", value: countStatus(content, "published"), icon: Layers },
    { label: "Pending production", value: content.filter((item) => ["idea", "brief", "shoot-planned", "shot", "editing"].includes(item.status)).length, icon: Clock },
  ];

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A light operating view for the Dare & Rise content calendar."
        actions={<Button onClick={() => navigate("/content/new")}>Create Content</Button>}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-line bg-white p-4">
            <stat.icon className="text-rosewood" size={20} />
            <p className="mt-4 text-3xl font-extrabold">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-ink/55">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Upcoming Content</h2>
          <Button variant="ghost" onClick={() => navigate("/calendar")}>View Calendar</Button>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState title="No upcoming content" description="Create a post from the calendar or content page to start planning." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {upcoming.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                product={products.find((product) => product.id === item.productId)}
                campaign={campaigns.find((campaign) => campaign.id === item.campaignId)}
                onEdit={() => navigate(`/content/${item.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function countFormat(items: { format: ContentFormat }[], format: ContentFormat) {
  return items.filter((item) => item.format === format).length;
}

function countStatus(items: { status: ContentStatus }[], status: ContentStatus) {
  return items.filter((item) => item.status === status).length;
}
