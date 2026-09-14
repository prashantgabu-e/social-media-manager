import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ContentCard } from "../components/content/ContentCard";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { LoadingState } from "../components/ui/LoadingState";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { formatDate, titleCase } from "../lib/utils";
import { usePlannerData } from "../hooks/usePlannerData";
import { useToast } from "../hooks/useToast";
import { createCampaign, deleteCampaign, updateCampaign } from "../services/campaignService";
import type { Campaign } from "../types";
import { campaignStatuses } from "../types/options";

const campaignSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  objective: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["planned", "active", "completed", "paused"]),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export function CampaignsPage() {
  const { campaigns, content, products, loading } = usePlannerData();
  const notify = useToast();
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const [open, setOpen] = useState(false);

  if (loading) return <LoadingState label="Loading campaigns" />;

  async function remove() {
    if (!deleteTarget) return;
    try {
      await deleteCampaign(deleteTarget.id);
      notify("Campaign deleted.", "success");
    } catch (error) {
      console.error(error);
      notify("Unable to delete campaign.", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Create simple campaign windows and connect content plans to them."
        actions={<Button onClick={() => { setEditing(null); setOpen(true); }} icon={<Plus size={17} />}>Add Campaign</Button>}
      />
      {campaigns.length === 0 ? (
        <EmptyState title="No campaigns yet" description="Add campaigns to organize content around launches, offers and editorial arcs." />
      ) : (
        <div className="space-y-5">
          {campaigns.map((campaign) => {
            const associated = content.filter((item) => item.campaignId === campaign.id);
            return (
              <section key={campaign.id} className="rounded-xl border border-line bg-white p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-extrabold">{campaign.name}</h3>
                      <Badge>{titleCase(campaign.status)}</Badge>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-ink/55">{formatDate(campaign.startDate)} to {formatDate(campaign.endDate)}</p>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/65">{campaign.objective || "No objective set."}</p>
                    {campaign.description && <p className="mt-1 max-w-3xl text-sm leading-6 text-ink/55">{campaign.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => { setEditing(campaign); setOpen(true); }} icon={<Edit size={16} />}>Edit</Button>
                    <Button variant="ghost" onClick={() => setDeleteTarget(campaign)} icon={<Trash2 size={16} />}>Delete</Button>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="mb-3 text-sm font-extrabold">{associated.length} associated content item{associated.length === 1 ? "" : "s"}</p>
                  <div className="grid gap-3 lg:grid-cols-2">
                    {associated.slice(0, 4).map((item) => (
                      <ContentCard key={item.id} item={item} product={products.find((product) => product.id === item.productId)} />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
      <CampaignModal open={open} campaign={editing} onClose={() => setOpen(false)} />
      <ConfirmDialog open={Boolean(deleteTarget)} message={`Delete "${deleteTarget?.name}"?`} onCancel={() => setDeleteTarget(null)} onConfirm={remove} />
    </div>
  );
}

function CampaignModal({ open, campaign, onClose }: { open: boolean; campaign: Campaign | null; onClose: () => void }) {
  const notify = useToast();
  const [saving, setSaving] = useState(false);
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    values: campaign
      ? {
          name: campaign.name,
          startDate: campaign.startDate?.toISOString().slice(0, 10) ?? "",
          endDate: campaign.endDate?.toISOString().slice(0, 10) ?? "",
          objective: campaign.objective,
          description: campaign.description,
          status: campaign.status,
        }
      : { name: "", startDate: "", endDate: "", objective: "", description: "", status: "planned" },
  });

  async function submit(values: CampaignFormValues) {
    setSaving(true);
    try {
      const payload = {
        ...values,
        startDate: new Date(`${values.startDate}T00:00:00`),
        endDate: new Date(`${values.endDate}T23:59:59`),
        objective: values.objective ?? "",
        description: values.description ?? "",
      };
      if (campaign) await updateCampaign(campaign.id, payload);
      else await createCampaign(payload);
      notify(campaign ? "Campaign updated." : "Campaign created.", "success");
      onClose();
    } catch (error) {
      console.error(error);
      notify("Unable to save campaign.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} title={campaign ? "Edit Campaign" : "Add Campaign"} onClose={onClose}>
      <form onSubmit={form.handleSubmit(submit)} className="grid gap-4 sm:grid-cols-2">
        <Input label="Campaign Name" {...form.register("name")} error={form.formState.errors.name?.message} />
        <Select label="Status" {...form.register("status")} options={campaignStatuses.map((status) => ({ value: status, label: titleCase(status) }))} />
        <Input label="Start Date" type="date" {...form.register("startDate")} error={form.formState.errors.startDate?.message} />
        <Input label="End Date" type="date" {...form.register("endDate")} error={form.formState.errors.endDate?.message} />
        <div className="sm:col-span-2">
          <Input label="Objective" {...form.register("objective")} />
        </div>
        <div className="sm:col-span-2">
          <Textarea label="Description" {...form.register("description")} />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" isLoading={saving}>Save Campaign</Button>
        </div>
      </form>
    </Modal>
  );
}
