import { Filter, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContentCard } from "../components/content/ContentCard";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { titleCase } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";
import { usePlannerData } from "../hooks/usePlannerData";
import { useToast } from "../hooks/useToast";
import { deleteContent, duplicateContent } from "../services/contentService";
import { contentFormats, contentPillars, contentStatuses, contentTypes, platforms } from "../types/options";
import type { ContentItem } from "../types";

type SortKey = "date" | "updated" | "created";

export function ContentPage() {
  const { content, products, campaigns, loading } = usePlannerData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const notify = useToast();
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    platform: "",
    format: "",
    status: "",
    pillar: "",
    type: "",
    product: "",
    campaign: "",
    sort: "date" as SortKey,
  });

  const filtered = useMemo(() => {
    const search = filters.search.toLowerCase().trim();
    return content
      .filter((item) => {
        const haystack = [item.title, item.caption, item.hashtags].join(" ").toLowerCase();
        return !search || haystack.includes(search);
      })
      .filter((item) => !filters.platform || item.platforms.includes(filters.platform as never))
      .filter((item) => !filters.format || item.format === filters.format)
      .filter((item) => !filters.status || item.status === filters.status)
      .filter((item) => !filters.pillar || item.contentPillar === filters.pillar)
      .filter((item) => !filters.type || item.contentType === filters.type)
      .filter((item) => !filters.product || item.productId === filters.product)
      .filter((item) => !filters.campaign || item.campaignId === filters.campaign)
      .sort((a, b) => {
        const field = filters.sort === "date" ? "scheduledDate" : filters.sort === "updated" ? "updatedAt" : "createdAt";
        return (b[field]?.getTime() ?? 0) - (a[field]?.getTime() ?? 0);
      });
  }, [content, filters]);

  if (loading) return <LoadingState label="Loading content library" />;

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteContent(deleteTarget.id);
      notify("Content deleted.", "success");
    } catch (error) {
      console.error(error);
      notify("Unable to delete content.", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleDuplicate(item: ContentItem) {
    try {
      await duplicateContent(item, user?.uid ?? "");
      notify("Content duplicated.", "success");
    } catch (error) {
      console.error(error);
      notify("Unable to duplicate content.", "error");
    }
  }

  const optionize = (values: string[]) => values.map((value) => ({ value, label: titleCase(value) }));

  return (
    <div>
      <PageHeader
        title="Content Library"
        description="Search, filter and manage every planned Instagram and Facebook content item."
        actions={<Button onClick={() => navigate("/content/new")} icon={<Plus size={17} />}>Create Content</Button>}
      />
      <section className="mb-5 rounded-xl border border-line bg-white p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-extrabold">
          <Filter size={18} /> Filters
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Search" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Title, caption, hashtag" />
          <Select label="Platform" value={filters.platform} onChange={(event) => setFilters({ ...filters, platform: event.target.value })} placeholder="All platforms" options={optionize(platforms)} />
          <Select label="Format" value={filters.format} onChange={(event) => setFilters({ ...filters, format: event.target.value })} placeholder="All formats" options={optionize(contentFormats)} />
          <Select label="Status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} placeholder="All statuses" options={optionize(contentStatuses)} />
          <Select label="Content Pillar" value={filters.pillar} onChange={(event) => setFilters({ ...filters, pillar: event.target.value })} placeholder="All pillars" options={optionize(contentPillars)} />
          <Select label="Content Type" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} placeholder="All types" options={optionize(contentTypes)} />
          <Select label="Product" value={filters.product} onChange={(event) => setFilters({ ...filters, product: event.target.value })} placeholder="All products" options={products.map((item) => ({ value: item.id, label: item.name }))} />
          <Select label="Campaign" value={filters.campaign} onChange={(event) => setFilters({ ...filters, campaign: event.target.value })} placeholder="All campaigns" options={campaigns.map((item) => ({ value: item.id, label: item.name }))} />
          <Select
            label="Sort"
            value={filters.sort}
            onChange={(event) => setFilters({ ...filters, sort: event.target.value as SortKey })}
            options={[
              { value: "date", label: "Date" },
              { value: "updated", label: "Recently Updated" },
              { value: "created", label: "Recently Created" },
            ]}
          />
        </div>
      </section>
      {filtered.length === 0 ? (
        <EmptyState
          title="No content found"
          description="Create content or adjust the filters to see matching items."
          action={<Button onClick={() => navigate("/content/new")} icon={<Search size={17} />}>Create First Content</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              product={products.find((product) => product.id === item.productId)}
              campaign={campaigns.find((campaign) => campaign.id === item.campaignId)}
              onEdit={() => navigate(`/content/${item.id}`)}
              onDuplicate={() => void handleDuplicate(item)}
              onDelete={() => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
