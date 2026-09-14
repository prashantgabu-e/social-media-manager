import { Calendar, ExternalLink, Layers } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";
import { formatDate, titleCase } from "../../lib/utils";
import type { Campaign, ContentItem, Product } from "../../types";

interface Props {
  item: ContentItem;
  product?: Product;
  campaign?: Campaign;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export function ContentCard({ item, product, campaign, onEdit, onDelete, onDuplicate }: Props) {
  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-base font-extrabold text-ink">{item.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink/55">
            <span className="inline-flex items-center gap-1"><Calendar size={14} />{formatDate(item.scheduledDate)}</span>
            <span>{item.postingTime}</span>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.platforms.map((platform) => <Badge key={platform}>{titleCase(platform)}</Badge>)}
        <Badge>{titleCase(item.format)}</Badge>
        <Badge>{titleCase(item.contentPillar)}</Badge>
      </div>
      {(product || campaign) && (
        <div className="mt-3 flex flex-col gap-1 text-sm text-ink/65">
          {product && <span className="inline-flex items-center gap-2"><Layers size={15} />{product.name}</span>}
          {campaign && <span>{campaign.name}</span>}
        </div>
      )}
      {item.driveUrl && (
        <a
          href={item.driveUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-rosewood"
        >
          <ExternalLink size={16} /> Open Drive
        </a>
      )}
      {(onEdit || onDelete || onDuplicate) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {onEdit && <Button variant="secondary" onClick={onEdit}>Edit</Button>}
          {onDuplicate && <Button variant="ghost" onClick={onDuplicate}>Duplicate</Button>}
          {onDelete && <Button variant="ghost" onClick={onDelete}>Delete</Button>}
        </div>
      )}
    </article>
  );
}
