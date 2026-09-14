import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { ContentForm } from "../features/content/ContentForm";
import { useAuth } from "../hooks/useAuth";
import { usePlannerData } from "../hooks/usePlannerData";
import { useToast } from "../hooks/useToast";
import { createContent, updateContent } from "../services/contentService";
import type { ContentItem } from "../types";

export function ContentEditorPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const notify = useToast();
  const { user } = useAuth();
  const { content, products, campaigns, loading } = usePlannerData();
  const initial = useMemo(() => content.find((item) => item.id === id), [content, id]);

  if (loading && id) return <LoadingState label="Loading content" />;
  if (id && !initial) {
    return (
      <div>
        <PageHeader title="Content not found" />
        <Button variant="secondary" onClick={() => navigate("/content")}>Back to Content</Button>
      </div>
    );
  }

  async function handleSubmit(values: Omit<ContentItem, "id" | "createdAt" | "updatedAt">) {
    try {
      if (initial) {
        await updateContent(initial.id, values);
        notify("Content updated.", "success");
      } else {
        await createContent(values);
        notify("Content created.", "success");
      }
      navigate("/calendar");
    } catch (error) {
      console.error(error);
      notify("Unable to save content.", "error");
    }
  }

  return (
    <div>
      <PageHeader
        title={initial ? "Edit Content" : "Create Content"}
        description="Plan the creative, production status, copy, Drive link and publishing details."
        actions={<Button variant="secondary" onClick={() => navigate(-1)} icon={<ArrowLeft size={17} />}>Back</Button>}
      />
      <ContentForm
        initial={initial}
        initialDate={params.get("date") ?? undefined}
        products={products}
        campaigns={campaigns}
        createdBy={user?.uid ?? ""}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
