import { useEffect } from "react";
import { useRestaurantForm } from "../../hooks/useRestaurantForm";
import { getOrderedDays } from "../../utils/time";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { SummaryFormError } from "../ui/FormError";
import { DayRow } from "./form/DayRow";
import { LocationPickerField } from "../shared/LocationPickerField";


type RestaurantFormProps = {
  restaurantId?: number;
  initialData?: Parameters<typeof useRestaurantForm>[0];
  onSuccess?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

export function RestaurantForm({ restaurantId, initialData, onSuccess, onDirtyChange }: RestaurantFormProps) {
  const {
    form,
    copyFromPrevious,
    onSubmit,
    submitState,
    errorMessage,
    t,
  } = useRestaurantForm(initialData, onSuccess);

  const isEdit = restaurantId != null;
  const orderedDays = getOrderedDays();
  const { isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <form
      onSubmit={form.handleSubmit((data) => onSubmit(data, restaurantId))}
      className="space-y-5"
      aria-label={t(isEdit ? "restaurants.editVenue" : "restaurants.publishVenue")}
    >
      <Input
        label={t("restaurants.nameLabel")}
        required
        placeholder={t("restaurants.namePlaceholder")}
        error={form.formState.errors.name?.message}
        {...form.register("name")}
      />

      <Textarea
        label={t("common.description")}
        placeholder={t("restaurants.descPlaceholder")}
        rows={4}
        maxLength={300}
        error={form.formState.errors.description?.message}
        {...form.register("description")}
      />

      <Input
        label={t("common.type")}
        required
        placeholder={t("restaurants.typePlaceholder")}
        error={form.formState.errors.type?.message}
        {...form.register("type")}
      />

      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-medium text-primary">
          {t("restaurants.priceRange")}<span className="ml-0.5 text-danger" aria-hidden="true">*</span>
        </legend>
        <div className="flex gap-2" role="group">
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() =>
                form.setValue("priceRange", n, { shouldValidate: true })
              }
              aria-pressed={form.getValues("priceRange") === n}
              aria-label={`${"€".repeat(n)} - ${n === 1 ? t("restaurants.priceEconomic") : n === 2 ? t("restaurants.priceMedium") : t("restaurants.priceHigh")}`}
              className={`flex-1 rounded-xl py-2.5 text-center text-[13px] font-semibold transition-all ${
                form.getValues("priceRange") === n
                  ? "bg-muted text-card"
                  : "bg-surface-warm text-muted hover:text-primary"
              }`}
            >
              {"€".repeat(n)}
            </button>
          ))}
        </div>
      </fieldset>

      <LocationPickerField
        label={t("common.address")}
        placeholder={t("restaurants.searchAddress")}
        initialAddress={initialData?.address ?? undefined}
        initialLatitude={initialData?.latitude ?? undefined}
        initialLongitude={initialData?.longitude ?? undefined}
        error={form.formState.errors.address?.message}
        coordinateError={form.formState.errors.latitude?.message}
        onAddressChange={(v) => form.setValue("address", v, { shouldValidate: true, shouldDirty: true })}
        onCoordinatesChange={(lat, lng) => {
          form.setValue("latitude", lat, { shouldValidate: true, shouldDirty: true });
          form.setValue("longitude", lng, { shouldValidate: true, shouldDirty: true });
        }}
      />

      <Input
        label={t("common.phone")}
        type="tel"
        placeholder={t("common.phonePlaceholder")}
        {...form.register("phone")}
      />

      <Input
        label={t("restaurants.menuLink")}
        type="url"
        placeholder="https://..."
        error={form.formState.errors.menuUrl?.message}
        {...form.register("menuUrl")}
      />

      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-medium text-primary">
          {t("restaurants.openingHours")}<span className="ml-0.5 text-danger" aria-hidden="true">*</span>
        </legend>
        <div className="rounded-xl border border-border bg-card px-3">
          {orderedDays.map((day, i) => (
            <DayRow
              key={day}
              day={day}
              dayIndex={i}
              form={form}
              onCopyPrevious={() => copyFromPrevious(day)}
            />
          ))}
        </div>
      </fieldset>

      {errorMessage && <SummaryFormError message={errorMessage} />}

      {form.formState.isSubmitted && Object.keys(form.formState.errors).length > 0 && (
        <SummaryFormError message={t("validation.requiredFields")} />
      )}

      <Button
        type="submit"
        fullWidth
        disabled={submitState === "submitting"}
        aria-busy={submitState === "submitting"}
      >
        {submitState === "submitting"
          ? t("common.saving")
          : isEdit
            ? t("common.saveChanges")
            : t("restaurants.publishVenue")}
      </Button>
    </form>
  );
}
