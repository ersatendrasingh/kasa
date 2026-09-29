"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArchiveIcon,
  CheckCircle2Icon,
  CircleDollarSignIcon,
  Layers3Icon,
  KeyRoundIcon,
  PencilIcon,
  PlusIcon,
  PowerIcon,
  PowerOffIcon,
  SearchIcon,
  TagsIcon,
  Trash2Icon,
} from "lucide-react";
import {
  createProductAction,
  createProductPriceAction,
  deleteProductAction,
  deleteProductPriceAction,
  toggleProductPriceStatusAction,
  toggleProductStatusAction,
  updateProductAction,
  updateProductPriceAction,
} from "@/actions/admin/products";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import {
  AdminInfoTile,
  friendlyLabel,
  limitLabel,
  MetaBox,
  SectionLabel,
} from "@/components/admin/shared/detail-primitives";
import {
  ProductPriceForm,
  type PriceFormValue,
  type ProductOption,
} from "@/components/admin/licenses/product-price-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { KASA_MODULES, normalizeFeatures, normalizeRules } from "@/lib/admin/kasa-modules";
import { formatMoney } from "@/lib/admin/dashboard-format";

export type ProductPriceView = PriceFormValue & {
  currency: string;
  amount: number;
  isActive: boolean;
  licenseCount: number;
};

export type ProductView = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: "ACTIVE" | "ARCHIVED";
  licenseCount: number;
  prices: ProductPriceView[];
};

function matchesProduct(product: ProductView, query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return true;

  return [
    product.name,
    product.slug,
    product.description,
    product.status,
    ...product.prices.flatMap((price) => [
      price.edition,
      price.plan,
      price.currency,
      price.envatoItemId,
      price.isActive ? "active" : "disabled",
    ]),
  ]
    .filter(Boolean)
    .some((item) => String(item).toLowerCase().includes(value));
}

function ProductDrawer() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          Add product
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-none overflow-y-auto rounded-l-2xl data-[vaul-drawer-direction=right]:w-[min(560px,calc(100vw-18px))] data-[vaul-drawer-direction=right]:sm:max-w-none">
        <DrawerHeader className="text-left">
          <DrawerTitle>Create product</DrawerTitle>
          <DrawerDescription>Add a sellable KASA product before creating pricing rows.</DrawerDescription>
        </DrawerHeader>
        <form action={createProductAction} className="grid w-full gap-4 px-5 pb-6 md:px-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required placeholder="KASA Enterprise" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" required placeholder="kasa-enterprise" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} />
          </div>
          <Button type="submit" size="lg">Create product</Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

function PricingDrawer({
  products,
  price,
  trigger,
}: {
  products: ProductOption[];
  price?: ProductPriceView;
  trigger: ReactNode;
}) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="h-full max-h-none overflow-hidden rounded-l-2xl data-[vaul-drawer-direction=right]:w-[min(860px,calc(100vw-18px))] data-[vaul-drawer-direction=right]:sm:max-w-none">
        <DrawerHeader className="text-left">
          <DrawerTitle>{price ? `Edit ${friendlyLabel(price.edition)} pricing` : "Add pricing"}</DrawerTitle>
          <DrawerDescription>
            Pricing controls edition, billing term, amount, installation limits, LMS modules, and Envato mapping.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex min-h-0 w-full flex-1 flex-col">
          <ProductPriceForm
            action={price ? updateProductPriceAction : createProductPriceAction}
            products={products}
            price={price}
            submitLabel={price ? "Update pricing" : "Save pricing"}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function AdminProductsBoard({ products }: { products: ProductView[] }) {
  const productOptions = products.map((product) => ({ id: product.id, name: product.name }));
  const [activeProductId, setActiveProductId] = useState(products[0]?.id || "");
  const [query, setQuery] = useState("");
  const filteredProducts = useMemo(() => products.filter((product) => matchesProduct(product, query)), [products, query]);
  const selectedProduct = products.find((product) => product.id === activeProductId) || filteredProducts[0] || products[0] || null;

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        <ProductDrawer />
        <PricingDrawer
          products={productOptions}
          trigger={
            <Button variant="outline">
              <TagsIcon className="size-4" />
              Add pricing
            </Button>
          }
        />
      </div>

      <section className="grid min-w-0 overflow-hidden rounded-2xl border border-border/80 bg-card/75 shadow-xl shadow-primary/5 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        <aside className="min-w-0 border-b border-border/80 p-3 lg:border-r lg:border-b-0 lg:p-4">
          <label className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-border/80 bg-background px-3 text-sm text-muted-foreground shadow-sm focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/10">
            <SearchIcon className="size-4 shrink-0" aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, plans, Envato"
              className="h-auto min-w-0 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
          </label>
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Products ({filteredProducts.length})
            </p>
            <Badge variant="secondary">{products.filter((product) => product.status === "ACTIVE").length} active</Badge>
          </div>
          <div className="mt-4 grid max-h-[min(36rem,calc(100svh-22rem))] gap-2 overflow-y-auto pr-1">
            {filteredProducts.length ? filteredProducts.map((product) => {
              const active = selectedProduct?.id === product.id;
              const activePrices = product.prices.filter((price) => price.isActive).length;

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setActiveProductId(product.id)}
                  className={`min-w-0 rounded-xl border p-4 text-left transition hover:border-primary/40 hover:bg-secondary/45 ${
                    active ? "border-primary/55 bg-secondary/70 shadow-sm" : "border-border/70 bg-background/55"
                  }`}
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-heading text-base font-semibold text-foreground">{product.name}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{product.slug}</p>
                    </div>
                    <Badge variant={product.status === "ACTIVE" ? "default" : "outline"}>{friendlyLabel(product.status)}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {activePrices}/{product.prices.length} active pricing rows
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{product.licenseCount} licenses attached</p>
                </button>
              );
            }) : (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No matching products.
              </div>
            )}
          </div>
        </aside>

        <div className="min-w-0 p-4 lg:p-5">
          {selectedProduct ? <ProductDetails product={selectedProduct} products={productOptions} /> : (
            <div className="grid min-h-96 place-items-center rounded-2xl border border-dashed text-center text-muted-foreground">
              No product selected.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ProductDetails({ product, products }: { product: ProductView; products: ProductOption[] }) {
  const activePrices = product.prices.filter((price) => price.isActive);
  const envatoPrices = product.prices.filter((price) => price.envatoItemId);
  const lowestPrice = product.prices.reduce<ProductPriceView | null>((lowest, price) => {
    if (!lowest) return price;
    return price.amount < lowest.amount ? price : lowest;
  }, null);

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-border/80 pb-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={product.status === "ACTIVE" ? "default" : "outline"}>{friendlyLabel(product.status)}</Badge>
            <Badge variant="secondary">{product.licenseCount} licenses</Badge>
            <Badge variant="secondary">{product.prices.length} price rows</Badge>
          </div>
          <h2 className="mt-3 break-words font-heading text-2xl font-semibold text-foreground lg:text-3xl">{product.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{product.slug}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <form action={toggleProductStatusAction}>
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="status" value={product.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE"} />
            <Button
              type="submit"
              variant="outline"
              size="icon"
              aria-label={product.status === "ACTIVE" ? "Archive product" : "Activate product"}
              title={product.status === "ACTIVE" ? "Archive product" : "Activate product"}
            >
              {product.status === "ACTIVE" ? <ArchiveIcon className="size-4" /> : <CheckCircle2Icon className="size-4" />}
            </Button>
          </form>
          <ConfirmActionButton
            action={deleteProductAction}
            fields={[{ name: "productId", value: product.id }]}
            icon={Trash2Icon}
            label="Delete product"
            title={`Delete ${product.name}?`}
            description="This product will be permanently deleted only if it has no licenses attached."
            confirmLabel="Delete product"
            variant="destructive"
            confirmVariant="destructive"
          />
        </div>
      </div>

      <div className="grid min-w-0 gap-3 border-b border-border/80 py-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminInfoTile icon={Layers3Icon} label="Active pricing" value={`${activePrices.length}/${product.prices.length}`} helper="Enabled rows" />
        <AdminInfoTile icon={CircleDollarSignIcon} label="Starting price" value={lowestPrice ? formatMoney(lowestPrice.amount, lowestPrice.currency) : "No price"} helper={lowestPrice ? friendlyLabel(lowestPrice.plan) : "Add pricing"} />
        <AdminInfoTile icon={TagsIcon} label="Envato mapped" value={String(envatoPrices.length)} helper="Pricing rows" />
        <AdminInfoTile icon={KeyRoundIcon} label="Licenses" value={String(product.licenseCount)} helper="Issued keys" />
      </div>

      <div className="grid min-w-0 gap-5 py-5">
        <section>
          <SectionLabel>Product profile</SectionLabel>
          <form action={updateProductAction} className="mt-3 grid gap-3 rounded-2xl border border-border/80 bg-background/65 p-4 md:grid-cols-3">
            <input type="hidden" name="productId" value={product.id} />
            <Input name="name" defaultValue={product.name} />
            <Input name="slug" defaultValue={product.slug} />
            <Input name="description" defaultValue={product.description || ""} />
            <div className="md:col-span-3">
              <Button type="submit" variant="outline">Update product</Button>
            </div>
          </form>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionLabel>Pricing and entitlements</SectionLabel>
            <PricingDrawer
              products={products}
              trigger={
                <Button type="button" variant="outline">
                  <TagsIcon className="size-4" />
                  Add pricing
                </Button>
              }
            />
          </div>
          <div className="mt-3 grid gap-3">
            {product.prices.length ? product.prices.map((price) => (
              <PriceRow key={price.id} price={price} products={products} />
            )) : (
              <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No pricing rows yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function PriceRow({ price, products }: { price: ProductPriceView; products: ProductOption[] }) {
  const features = normalizeFeatures(price.features, price.edition);
  const rules = normalizeRules(price.rules, price.edition);
  const enabledModules = KASA_MODULES.filter((module) => features[module.key]);
  const modulePreview = enabledModules.slice(0, 6);

  return (
    <div className="rounded-2xl border border-border/80 bg-background/65 p-4 shadow-sm shadow-primary/5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{friendlyLabel(price.edition)}</Badge>
            <Badge variant="secondary">{friendlyLabel(price.plan)}</Badge>
            <Badge variant={price.isActive ? "default" : "outline"}>{price.isActive ? "Active" : "Disabled"}</Badge>
            {price.envatoItemId ? <Badge variant="outline">Envato {price.envatoItemId}</Badge> : null}
          </div>
          <p className="mt-4 font-heading text-2xl font-semibold text-foreground">{formatMoney(price.amount, price.currency)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {price.licenseCount} licenses using this row
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <PricingDrawer
            products={products}
            price={price}
            trigger={
              <Button type="button" variant="outline" size="icon" aria-label={`Edit ${price.edition} pricing`} title={`Edit ${price.edition} pricing`}>
                <PencilIcon className="size-4" />
              </Button>
            }
          />
          <form action={toggleProductPriceStatusAction}>
            <input type="hidden" name="productPriceId" value={price.id} />
            <input type="hidden" name="isActive" value={price.isActive ? "false" : "true"} />
            <Button
              type="submit"
              variant="outline"
              size="icon"
              aria-label={price.isActive ? "Disable pricing" : "Enable pricing"}
              title={price.isActive ? "Disable pricing" : "Enable pricing"}
            >
              {price.isActive ? <PowerOffIcon className="size-4" /> : <PowerIcon className="size-4" />}
            </Button>
          </form>
          <ConfirmActionButton
            action={deleteProductPriceAction}
            fields={[{ name: "productPriceId", value: price.id }]}
            icon={Trash2Icon}
            label="Delete pricing"
            title={`Delete ${price.edition} ${price.plan} pricing?`}
            description="This pricing row will be permanently deleted only if no license is using it."
            confirmLabel="Delete pricing"
            variant="destructive"
            confirmVariant="destructive"
          />
        </div>
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
        <MetaBox label="Activations" value={String(price.maxActivations)} />
        <MetaBox label="Users" value={limitLabel(price.userLimit, "users")} />
        <MetaBox label="Courses" value={limitLabel(price.courseLimit, "courses")} />
        <MetaBox label="Faculty" value={limitLabel(price.facultyLimit, "faculty")} />
      </div>
      <div className="mt-4 rounded-xl border border-border/80 bg-card/65 p-3">
        <div className="flex flex-wrap gap-2">
          {modulePreview.map((module) => (
            <Badge key={module.key} variant="outline">{module.label}</Badge>
          ))}
          {enabledModules.length > modulePreview.length ? <Badge variant="secondary">+{enabledModules.length - modulePreview.length} more</Badge> : null}
        </div>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <MetaBox label="Certificate rule" value={friendlyLabel(rules.certificateRule)} />
          <MetaBox label="Delivery modes" value={rules.allowedCourseModes.map(friendlyLabel).join(", ")} />
        </div>
      </div>
    </div>
  );
}
