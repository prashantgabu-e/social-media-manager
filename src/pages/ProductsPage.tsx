import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { LoadingState } from "../components/ui/LoadingState";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { usePlannerData } from "../hooks/usePlannerData";
import { useToast } from "../hooks/useToast";
import { createProduct, deleteProduct, updateProduct } from "../services/productService";
import type { Product } from "../types";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().optional(),
  collection: z.string().optional(),
  category: z.string().optional(),
  gender: z.string().optional(),
  productUrl: z.string().url("Enter a valid URL").or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductsPage() {
  const { products, loading } = usePlannerData();
  const notify = useToast();
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  if (loading) return <LoadingState label="Loading products" />;

  async function remove() {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      notify("Product deleted.", "success");
    } catch (error) {
      console.error(error);
      notify("Unable to delete product.", "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Product Master"
        description="Maintain the lightweight product list used in content planning."
        actions={<Button onClick={() => { setEditing(null); setOpen(true); }} icon={<Plus size={17} />}>Add Product</Button>}
      />
      {products.length === 0 ? (
        <EmptyState title="No products yet" description="Add products to populate the content form dropdown." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-extrabold">{product.name}</h3>
                  <p className="text-sm font-semibold text-ink/50">{product.sku || "No SKU"}</p>
                </div>
                <Badge>{product.status}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Meta label="Collection" value={product.collection} />
                <Meta label="Category" value={product.category} />
                <Meta label="Gender" value={product.gender} />
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" onClick={() => { setEditing(product); setOpen(true); }} icon={<Edit size={16} />}>Edit</Button>
                <Button variant="ghost" onClick={() => setDeleteTarget(product)} icon={<Trash2 size={16} />}>Delete</Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <ProductModal open={open} product={editing} onClose={() => setOpen(false)} />
      <ConfirmDialog open={Boolean(deleteTarget)} message={`Delete "${deleteTarget?.name}"?`} onCancel={() => setDeleteTarget(null)} onConfirm={remove} />
    </div>
  );
}

function Meta({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-ink/40">{label}</p>
      <p className="truncate font-semibold text-ink/70">{value || "Not set"}</p>
    </div>
  );
}

function ProductModal({ open, product, onClose }: { open: boolean; product: Product | null; onClose: () => void }) {
  const notify = useToast();
  const [saving, setSaving] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    values: product
      ? {
          name: product.name,
          sku: product.sku,
          collection: product.collection,
          category: product.category,
          gender: product.gender,
          productUrl: product.productUrl,
          status: product.status,
        }
      : { name: "", sku: "", collection: "", category: "", gender: "", productUrl: "", status: "active" },
  });

  async function submit(values: ProductFormValues) {
    setSaving(true);
    try {
      const payload = {
        name: values.name,
        sku: values.sku ?? "",
        collection: values.collection ?? "",
        category: values.category ?? "",
        gender: values.gender ?? "",
        productUrl: values.productUrl,
        status: values.status,
      };
      if (product) await updateProduct(product.id, payload);
      else await createProduct(payload);
      notify(product ? "Product updated." : "Product created.", "success");
      onClose();
    } catch (error) {
      console.error(error);
      notify("Unable to save product.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} title={product ? "Edit Product" : "Add Product"} onClose={onClose}>
      <form onSubmit={form.handleSubmit(submit)} className="grid gap-4 sm:grid-cols-2">
        <Input label="Product Name" {...form.register("name")} error={form.formState.errors.name?.message} />
        <Input label="SKU" {...form.register("sku")} />
        <Input label="Collection" {...form.register("collection")} />
        <Input label="Category" {...form.register("category")} />
        <Input label="Gender" {...form.register("gender")} />
        <Select label="Status" {...form.register("status")} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
        <div className="sm:col-span-2">
          <Input label="Product URL" {...form.register("productUrl")} error={form.formState.errors.productUrl?.message} />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" isLoading={saving}>Save Product</Button>
        </div>
      </form>
    </Modal>
  );
}
