"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import Textarea from "../../../../components/common/Textarea";
import Select from "../../../../components/common/Select";
import Checkbox from "../../../../components/common/Checkbox";
import { Card, CardHeader, CardTitle } from "../../../../components/common/Card";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useAdminProductsStore } from "../../../../store/adminProducts";
import ProductEditSkeleton from "../../../../components/skeletons/ProductEditSkeleton";
import { BasicInfoSection } from "../../../../components/products/BasicInfoSection";
import { MediaSection } from "../../../../components/products/MediaSection";
import { CategorySelector } from "../../../../components/products/CategorySelector";
import ConfirmModal from "../../../../components/common/ConfirmModal";
import { ToastContainer, Toast as ToastType } from "../../../../components/common/Toast";

type ProductType =
  | "GENERAL"
  | "BOOK"
  | "ELECTRONICS"
  | "CLOTHING"
  | "FOOD"
  | "TOYS"
  | "SPORTS"
  | "BEAUTY"
  | "HOME"
  | "AUTOMOTIVE";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    categories,
    fetchCategories,
    fetchProduct,
    updateProduct,
    deleteProduct,
    isSubmitting,
    isLoading,
    clearError,
  } = useAdminProductsStore();

  // Basic info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE" | "ARCHIVED">("DRAFT");
  const [productType, setProductType] = useState<ProductType>("GENERAL");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [trackInventory, setTrackInventory] = useState(true);
  const [allowBackorder, setAllowBackorder] = useState(false);

  // Delivery & dimensions
  const [deliveryMinDays, setDeliveryMinDays] = useState<number>(1);
  const [deliveryMaxDays, setDeliveryMaxDays] = useState<number>(3);
  const [weight, setWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg");
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [dimensionUnit, setDimensionUnit] = useState<"cm" | "m">("cm");

  // Pickup location
  const [pickupLocationName, setPickupLocationName] = useState<string>("");
  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [pickupCity, setPickupCity] = useState<string>("");
  const [pickupProvince, setPickupProvince] = useState<string>("");
  const [pickupPostalCode, setPickupPostalCode] = useState<string>("");
  const [pickupCountry, setPickupCountry] = useState<string>("South Africa");
  const [pickupInstructions, setPickupInstructions] = useState<string>("");

  // Return policy
  const [returnPolicyName, setReturnPolicyName] = useState<string>("");
  const [returnsAccepted, setReturnsAccepted] = useState<boolean>(true);
  const [returnPeriodDays, setReturnPeriodDays] = useState<number>(30);
  const [restockingFeePct, setRestockingFeePct] = useState<number>(0);
  const [returnShippingPaidBy, setReturnShippingPaidBy] = useState<
    "CUSTOMER" | "VENDOR" | "SHARED"
  >("CUSTOMER");

  // Warranty
  const [hasWarranty, setHasWarranty] = useState<boolean>(false);
  const [warrantyPeriod, setWarrantyPeriod] = useState<number>(12);
  const [warrantyUnit, setWarrantyUnit] = useState<"months" | "years">("months");
  const [warrantyDetails, setWarrantyDetails] = useState<string>("");

  // Pricing & inventory
  const [basePrice, setBasePrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);

  // Images
  const [images, setImages] = useState<string[]>([]);

  // Tags
  const [tags, setTags] = useState<string>("");

  // UI state
  const [salesCount, setSalesCount] = useState<number>(0);
  const [isDataReady, setIsDataReady] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const generateToastId = () => {
    try {
      // @ts-ignore - randomUUID may not exist in some environments
      return (typeof crypto !== 'undefined' && crypto.randomUUID)
        // @ts-ignore
        ? crypto.randomUUID()
        : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    } catch {
      return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    const id = generateToastId();
    setToasts((prev) => [...prev, { id, message, type, duration: 5000 }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function load() {
      setIsDataReady(false);
      try {
        const [product] = await Promise.all([fetchProduct(id), fetchCategories()]);

        if (!product) {
          showToast("Product not found", "error");
          setTimeout(() => router.push("/products"), 2000);
          return;
        }

        // Basic info
        setTitle(product.title || "");
        setDescription(product.description || "");
        setStatus(product.status || "DRAFT");
        setCategoryId(product.categoryId || "");
        setProductType(product.productType || "GENERAL");
        setIsFeatured(product.featured || false);
        setIsActive(product.isActive ?? true);
        setSalesCount(product.salesCount ?? 0);

        // Delivery & dimensions
        setDeliveryMinDays(product.deliveryMinDays || 1);
        setDeliveryMaxDays(product.deliveryMaxDays || 3);
        setWeight(product.weight || 0);
        setWeightUnit(product.weightUnit || "kg");
        setLength(product.length || 0);
        setWidth(product.width || 0);
        setHeight(product.height || 0);
        setDimensionUnit(product.dimensionUnit || "cm");

        // Pickup location
        const pl = product.pickupLocation;
        if (pl) {
          setPickupLocationName(pl.name || "");
          setPickupAddress(pl.address || "");
          setPickupCity(pl.city || "");
          setPickupProvince(pl.province || "");
          setPickupPostalCode(pl.postalCode || "");
          setPickupCountry(pl.country || "South Africa");
          setPickupInstructions(pl.instructions || "");
        }

        // Return policy
        const rp = product.returnPolicy;
        if (rp) {
          setReturnPolicyName(rp.name || "");
          setReturnsAccepted(rp.returnsAccepted ?? true);
          setReturnPeriodDays(rp.returnPeriodDays ?? 30);
          setRestockingFeePct(rp.restockingFeePct ?? 0);
          setReturnShippingPaidBy(rp.returnShippingPaidBy || "CUSTOMER");
        }

        // Warranty
        const wt = product.warranty;
        if (wt) {
          setHasWarranty(wt.hasWarranty || false);
          setWarrantyPeriod(wt.warrantyPeriod ?? 12);
          setWarrantyUnit(wt.warrantyUnit || "months");
          setWarrantyDetails(wt.warrantyDetails || "");
        }

        // Tags
        setTags(Array.isArray(product.tags) ? product.tags.join(", ") : "");

        // Media
        if (Array.isArray(product.media) && product.media.length > 0) {
          setImages(product.media.map((m: any) => m.url).filter(Boolean));
        }

        // Pricing
        if (product.priceInCents) {
          setBasePrice(product.priceInCents / 100);
        }
        if (product.compareAtPriceInCents) {
          setCompareAtPrice(product.compareAtPriceInCents / 100);
        }
        setStockQuantity(product.stockQuantity || 0);

        setTimeout(() => setIsDataReady(true), 100);
      } catch (err) {
        console.error(err);
        showToast("Failed to load product", "error");
      }
    }
    if (id) load();
  }, [fetchProduct, fetchCategories, id, router]);

  async function handleUpdate() {
    if (!title || !categoryId) {
      showToast("Title and category are required", "error");
      return;
    }
    if (!pickupAddress || !pickupCity || !pickupProvince || !pickupPostalCode) {
      showToast(
        "Pickup address is required. Please provide the full address.",
        "error"
      );
      return;
    }
    if (!basePrice || basePrice <= 0) {
      showToast("Please enter a valid price", "error");
      return;
    }
    if (compareAtPrice && compareAtPrice < basePrice) {
      showToast(
        "Compare at price must be greater than or equal to price",
        "error"
      );
      return;
    }

    clearError();

    try {
      await updateProduct(id, {
        title,
        description,
        status,
        productType,
        categoryId,
        isFeatured,
        isActive,
        trackInventory,
        allowBackorder,
        deliveryMinDays,
        deliveryMaxDays,
        weight,
        weightUnit,
        length,
        width,
        height,
        dimensionUnit,
        pickupLocationName,
        pickupAddress,
        pickupCity,
        pickupProvince,
        pickupPostalCode,
        pickupCountry,
        pickupInstructions,
        returnPolicyName: returnsAccepted ? returnPolicyName : undefined,
        returnsAccepted,
        returnPeriodDays: returnsAccepted ? returnPeriodDays : undefined,
        restockingFeePct: returnsAccepted ? restockingFeePct : undefined,
        returnShippingPaidBy: returnsAccepted ? returnShippingPaidBy : undefined,
        hasWarranty,
        warrantyPeriod: hasWarranty ? warrantyPeriod : undefined,
        warrantyUnit: hasWarranty ? warrantyUnit : undefined,
        warrantyDetails: hasWarranty ? warrantyDetails : undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        priceInCents: Math.round(Number(basePrice) * 100),
        compareAtPriceInCents: compareAtPrice
          ? Math.round(Number(compareAtPrice) * 100)
          : undefined,
        images,
      });
      showToast("Product updated successfully!", "success");
      setTimeout(() => router.push("/products"), 1500);
    } catch (err) {
      console.error(err);
      showToast(
        err instanceof Error ? err.message : "Failed to update product",
        "error"
      );
    }
  }

  async function handleDelete() {
    clearError();
    try {
      await deleteProduct(id);
      showToast("Product deleted successfully", "success");
      setTimeout(() => router.push("/products"), 1500);
    } catch (err) {
      console.error(err);
      showToast(
        err instanceof Error ? err.message : "Failed to delete product",
        "error"
      );
    }
  }

  if (isLoading || !isDataReady) {
    return (
      <DashboardLayout>
        <ProductEditSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Saving Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#C8102E] rounded-full animate-spin border-t-transparent"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Saving Changes</h3>
                <p className="text-sm text-gray-600">Please wait while we update the product...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/products")}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-1">Update product details on behalf of the vendor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {salesCount === 0 && (
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(true)}
                icon={Trash2}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            )}
            <Button onClick={handleUpdate} icon={Save} disabled={isSubmitting || !title || !categoryId}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BasicInfoSection
              title={title}
              onTitleChange={setTitle}
              description={description}
              onDescriptionChange={setDescription}
            />

            <MediaSection images={images} onImagesChange={setImages} />

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price"
                  type="number"
                  value={String(basePrice)}
                  onChange={(v) => setBasePrice(parseFloat(v) || 0)}
                  required
                  fullWidth
                />
                <Input
                  label="Compare at Price"
                  type="number"
                  value={String(compareAtPrice)}
                  onChange={(v) => setCompareAtPrice(parseFloat(v) || 0)}
                  fullWidth
                />
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <Checkbox
                  label="Track inventory"
                  checked={trackInventory}
                  onChange={setTrackInventory}
                />
                {trackInventory && (
                  <>
                    <Input
                      label="Stock Quantity"
                      type="number"
                      value={String(stockQuantity)}
                      onChange={(v) => setStockQuantity(parseInt(v) || 0)}
                      fullWidth
                    />
                    <Checkbox
                      label="Allow backorders"
                      checked={allowBackorder}
                      onChange={setAllowBackorder}
                    />
                  </>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Timeframe</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Estimated delivery time</p>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Minimum Days"
                  type="number"
                  value={String(deliveryMinDays)}
                  onChange={(v) => setDeliveryMinDays(parseInt(v) || 0)}
                  fullWidth
                />
                <Input
                  label="Maximum Days"
                  type="number"
                  value={String(deliveryMaxDays)}
                  onChange={(v) => setDeliveryMaxDays(parseInt(v) || 0)}
                  fullWidth
                />
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Dimensions & Weight</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Weight"
                    type="number"
                    value={String(weight)}
                    onChange={(v) => setWeight(parseFloat(v) || 0)}
                    fullWidth
                  />
                  <Select
                    label="Unit"
                    value={weightUnit}
                    onChange={(v) => setWeightUnit(v as "kg" | "g")}
                    options={[
                      { value: "kg", label: "Kilograms (kg)" },
                      { value: "g", label: "Grams (g)" },
                    ]}
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Input
                    label="Length"
                    type="number"
                    value={String(length)}
                    onChange={(v) => setLength(parseFloat(v) || 0)}
                    fullWidth
                  />
                  <Input
                    label="Width"
                    type="number"
                    value={String(width)}
                    onChange={(v) => setWidth(parseFloat(v) || 0)}
                    fullWidth
                  />
                  <Input
                    label="Height"
                    type="number"
                    value={String(height)}
                    onChange={(v) => setHeight(parseFloat(v) || 0)}
                    fullWidth
                  />
                  <Select
                    label="Unit"
                    value={dimensionUnit}
                    onChange={(v) => setDimensionUnit(v as "cm" | "m")}
                    options={[
                      { value: "cm", label: "Centimeters" },
                      { value: "m", label: "Meters" },
                    ]}
                  />
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pickup Address</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Where the product will be collected by the driver
                </p>
              </CardHeader>
              <div className="space-y-4">
                <Input
                  label="Location Name"
                  value={pickupLocationName}
                  onChange={setPickupLocationName}
                  placeholder="e.g., Main Warehouse"
                  fullWidth
                />
                <Input
                  label="Street Address"
                  value={pickupAddress}
                  onChange={setPickupAddress}
                  required
                  fullWidth
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" value={pickupCity} onChange={setPickupCity} required fullWidth />
                  <Input
                    label="Province"
                    value={pickupProvince}
                    onChange={setPickupProvince}
                    required
                    fullWidth
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postal Code"
                    value={pickupPostalCode}
                    onChange={setPickupPostalCode}
                    required
                    fullWidth
                  />
                  <Input
                    label="Country"
                    value={pickupCountry}
                    onChange={setPickupCountry}
                    fullWidth
                  />
                </div>
                <Textarea
                  label="Pickup Instructions"
                  value={pickupInstructions}
                  onChange={setPickupInstructions}
                  placeholder="Special instructions for pickup"
                  rows={3}
                  fullWidth
                />
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return Policy</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <Checkbox
                  label="Accept returns"
                  checked={returnsAccepted}
                  onChange={setReturnsAccepted}
                />
                {returnsAccepted && (
                  <>
                    <Input
                      label="Policy Name"
                      value={returnPolicyName}
                      onChange={setReturnPolicyName}
                      fullWidth
                    />
                    <Input
                      label="Return Period (days)"
                      type="number"
                      value={String(returnPeriodDays)}
                      onChange={(v) => setReturnPeriodDays(parseInt(v) || 0)}
                      fullWidth
                    />
                    <Input
                      label="Restocking Fee (%)"
                      type="number"
                      value={String(restockingFeePct)}
                      onChange={(v) => setRestockingFeePct(parseFloat(v) || 0)}
                      fullWidth
                    />
                    <Select
                      label="Return Shipping Paid By"
                      value={returnShippingPaidBy}
                      onChange={(v) =>
                        setReturnShippingPaidBy(v as "CUSTOMER" | "VENDOR" | "SHARED")
                      }
                      options={[
                        { value: "CUSTOMER", label: "Customer" },
                        { value: "VENDOR", label: "Vendor" },
                        { value: "SHARED", label: "Shared" },
                      ]}
                    />
                  </>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Warranty</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <Checkbox
                  label="Product has warranty"
                  checked={hasWarranty}
                  onChange={setHasWarranty}
                />
                {hasWarranty && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Warranty Period"
                        type="number"
                        value={String(warrantyPeriod)}
                        onChange={(v) => setWarrantyPeriod(parseInt(v) || 0)}
                        fullWidth
                      />
                      <Select
                        label="Unit"
                        value={warrantyUnit}
                        onChange={(v) => setWarrantyUnit(v as "months" | "years")}
                        options={[
                          { value: "months", label: "Months" },
                          { value: "years", label: "Years" },
                        ]}
                      />
                    </div>
                    <Textarea
                      label="Warranty Details"
                      value={warrantyDetails}
                      onChange={setWarrantyDetails}
                      rows={3}
                      fullWidth
                    />
                  </>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <CategorySelector
              categories={categories || []}
              selectedCategoryId={categoryId}
              onSelectCategory={setCategoryId}
              isLoading={isLoading}
            />

            <Card>
              <CardHeader>
                <CardTitle>Product Type</CardTitle>
              </CardHeader>
              <Select
                label="Type"
                value={productType}
                onChange={(v) => setProductType(v as ProductType)}
                options={[
                  { value: "GENERAL", label: "General" },
                  { value: "BOOK", label: "Book" },
                  { value: "ELECTRONICS", label: "Electronics" },
                  { value: "CLOTHING", label: "Clothing" },
                  { value: "FOOD", label: "Food & Beverage" },
                  { value: "TOYS", label: "Toys & Games" },
                  { value: "SPORTS", label: "Sports & Outdoors" },
                  { value: "BEAUTY", label: "Beauty & Personal Care" },
                  { value: "HOME", label: "Home & Garden" },
                  { value: "AUTOMOTIVE", label: "Automotive" },
                ]}
              />
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Comma-separated tags</p>
              </CardHeader>
              <Input
                label="Tags"
                value={tags}
                onChange={setTags}
                placeholder="e.g., sale, new, popular"
                fullWidth
              />
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <Select
                  label="Status"
                  value={status}
                  onChange={(v) => setStatus(v as "DRAFT" | "ACTIVE" | "ARCHIVED")}
                  options={[
                    { value: "DRAFT", label: "Draft" },
                    { value: "ACTIVE", label: "Active" },
                    { value: "ARCHIVED", label: "Archived" },
                  ]}
                />
                <Checkbox label="Active" checked={isActive} onChange={setIsActive} />
                <Checkbox label="Featured" checked={isFeatured} onChange={setIsFeatured} />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </DashboardLayout>
  );
}
