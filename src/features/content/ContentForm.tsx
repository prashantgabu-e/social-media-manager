import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { MultiSelect } from "../../components/ui/MultiSelect";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { titleCase } from "../../lib/utils";
import type {
  AspectRatio,
  Campaign,
  ContentFormat,
  ContentItem,
  ContentPillar,
  ContentStatus,
  ContentType,
  Platform,
  Product,
} from "../../types";
import {
  aspectRatios,
  contentFormats,
  contentPillars,
  contentStatuses,
  contentTypes,
  defaultTimezone,
  platforms,
} from "../../types/options";
import {
  contentSchema,
  defaultContentValues,
  toScheduledDate,
  type ContentFormValues,
} from "./contentSchema";

interface Props {
  initial?: ContentItem;
  initialDate?: string;
  products: Product[];
  campaigns: Campaign[];
  onSubmit: (values: Omit<ContentItem, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  createdBy: string;
}

export function ContentForm({ initial, initialDate, products, campaigns, onSubmit, createdBy }: Props) {
  const [saving, setSaving] = useState(false);
  const defaults = initial
    ? itemToValues(initial)
    : { ...defaultContentValues, date: initialDate ?? defaultContentValues.date };
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: defaults,
  });
  const driveUrl = form.watch("driveUrl");

  useEffect(() => {
    form.reset(initial ? itemToValues(initial) : { ...defaultContentValues, date: initialDate ?? defaultContentValues.date });
  }, [form, initial, initialDate]);

  async function submit(values: ContentFormValues) {
    setSaving(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        scheduledDate: toScheduledDate(values.date, values.postingTime),
        postingTime: values.postingTime,
        timezone: defaultTimezone,
        platforms: values.platforms as Platform[],
        format: values.format as ContentFormat,
        aspectRatio: values.aspectRatio as AspectRatio,
        contentType: values.contentType as ContentType,
        contentPillar: values.contentPillar as ContentPillar,
        productId: values.productId || null,
        campaignId: values.campaignId || null,
        caption: values.caption ?? "",
        cta: values.cta ?? "",
        hashtags: values.hashtags ?? "",
        musicName: values.musicName ?? "",
        musicArtist: values.musicArtist ?? "",
        musicUrl: values.musicUrl ?? "",
        driveUrl: values.driveUrl ?? "",
        status: values.status as ContentStatus,
        publishedUrl: values.publishedUrl ?? "",
        notes: values.notes ?? "",
        createdBy: initial?.createdBy || createdBy,
      });
    } finally {
      setSaving(false);
    }
  }

  const productOptions = products.map((product) => ({ value: product.id, label: product.name }));
  const campaignOptions = campaigns.map((campaign) => ({ value: campaign.id, label: campaign.name }));
  const optionize = (values: string[]) => values.map((value) => ({ value, label: titleCase(value) }));

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
      <FormSection title="Basic">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Title" {...form.register("title")} error={form.formState.errors.title?.message} />
          <Input label="Date" type="date" {...form.register("date")} error={form.formState.errors.date?.message} />
          <Input label="Posting Time" type="time" {...form.register("postingTime")} error={form.formState.errors.postingTime?.message} />
          <Controller
            name="platforms"
            control={form.control}
            render={({ field, fieldState }) => (
              <MultiSelect label="Platforms" options={platforms} value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
            )}
          />
        </div>
      </FormSection>

      <FormSection title="Strategy">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="Format" {...form.register("format")} options={optionize(contentFormats)} />
          <Select label="Aspect Ratio" {...form.register("aspectRatio")} options={aspectRatios.map((value) => ({ value, label: value }))} />
          <Select label="Content Type" {...form.register("contentType")} options={optionize(contentTypes)} />
          <Select label="Content Pillar" {...form.register("contentPillar")} options={optionize(contentPillars)} />
          <Select label="Product" {...form.register("productId")} placeholder="No product" options={productOptions} />
          <Select label="Campaign" {...form.register("campaignId")} placeholder="No campaign" options={campaignOptions} />
        </div>
      </FormSection>

      <FormSection title="Copy">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="CTA" {...form.register("cta")} />
          <Textarea label="Caption" {...form.register("caption")} />
          <Textarea label="Hashtags" {...form.register("hashtags")} />
        </div>
      </FormSection>

      <FormSection title="Music">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Music / Song Name" {...form.register("musicName")} />
          <Input label="Artist" {...form.register("musicArtist")} />
          <Input label="Optional Music URL" {...form.register("musicUrl")} error={form.formState.errors.musicUrl?.message} />
        </div>
      </FormSection>

      <FormSection title="Media">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <Input label="Google Drive URL" {...form.register("driveUrl")} error={form.formState.errors.driveUrl?.message} />
          <Button
            type="button"
            variant="secondary"
            icon={<ExternalLink size={17} />}
            disabled={!driveUrl}
            onClick={() => driveUrl && window.open(driveUrl, "_blank", "noopener,noreferrer")}
          >
            Open Drive
          </Button>
        </div>
      </FormSection>

      <FormSection title="Workflow">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Status" {...form.register("status")} options={optionize(contentStatuses)} />
          <Input label="Published Post URL" {...form.register("publishedUrl")} error={form.formState.errors.publishedUrl?.message} />
        </div>
      </FormSection>

      <FormSection title="Notes">
        <Textarea label="Internal Notes" {...form.register("notes")} />
      </FormSection>

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-paper/95 p-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button type="submit" isLoading={saving} icon={<Save size={17} />} className="w-full sm:w-auto">
          {initial ? "Save Changes" : "Create Content"}
        </Button>
      </div>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-white p-4">
      <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-ink/55">{title}</h2>
      {children}
    </section>
  );
}

function itemToValues(item: ContentItem): ContentFormValues {
  return {
    ...defaultContentValues,
    title: item.title,
    date: item.scheduledDate ? item.scheduledDate.toISOString().slice(0, 10) : defaultContentValues.date,
    postingTime: item.postingTime,
    platforms: item.platforms,
    format: item.format,
    aspectRatio: item.aspectRatio,
    contentType: item.contentType,
    contentPillar: item.contentPillar,
    productId: item.productId ?? "",
    campaignId: item.campaignId ?? "",
    caption: item.caption,
    cta: item.cta,
    hashtags: item.hashtags,
    musicName: item.musicName,
    musicArtist: item.musicArtist,
    musicUrl: item.musicUrl,
    driveUrl: item.driveUrl,
    status: item.status,
    publishedUrl: item.publishedUrl,
    notes: item.notes,
  };
}
