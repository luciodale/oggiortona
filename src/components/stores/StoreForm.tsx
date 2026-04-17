import { useEffect } from "react";
import { useStoreForm } from "../../hooks/useStoreForm";
import { getOrderedDays } from "../../utils/time";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { SummaryFormError } from "../ui/FormError";
import { DayRow } from "./form/DayRow";
import { LocationPickerField } from "../shared/LocationPickerField";


type StoreFormProps = {
  storeId?: number;
  initialData?: Parameters<typeof useStoreForm>[0];
  onSuccess?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

export function StoreForm({ storeId, initialData, onSuccess, onDirtyChange }: StoreFormProps) {
  const {
    form,
    copyFrom,
    onSubmit,
    submitState,
    errorMessage,
    t,
  } = useStoreForm(initialData, onSuccess);

  const isEdit = storeId != null;
  const orderedDays = getOrderedDays();
  const { isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <form
      onSubmit={form.handleSubmit((data) => onSubmit(data, storeId))}
      className="space-y-5"
      aria-label={t(isEdit ? "stores.editStore" : "stores.publishStore")}
    >
      <Input
        label={t("stores.nameLabel")}
        required
        placeholder={t("stores.namePlaceholder")}
        error={form.formState.errors.name?.message}
        {...form.register("name")}
      />

      <Textarea
        label={t("common.description")}
        placeholder={t("stores.descPlaceholder")}
        rows={4}
        maxLength={300}
        error={form.formState.errors.description?.message}
        {...form.register("description")}
      />

      <Input
        label={t("common.type")}
        required
        placeholder={t("stores.typePlaceholder")}
        error={form.formState.errors.type?.message}
        {...form.register("type")}
      />

      <LocationPickerField
        label={t("common.address")}
        placeholder={t("stores.searchAddress")}
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
        label={t("stores.storeLink")}
        type="url"
        placeholder="https://..."
        error={form.formState.errors.storeUrl?.message}
        {...form.register("storeUrl")}
      />

      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-medium text-primary">
          {t("stores.openingHours")}<span className="ml-0.5 text-danger" aria-hidden="true">*</span>
        </legend>
        <div className="rounded-xl border border-border bg-card px-3">
          {orderedDays.map((day) => (
            <DayRow
              key={day}
              day={day}
              form={form}
              onCopyFrom={(source) => copyFrom(day, source)}
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
            : t("stores.publishStore")}
      </Button>
    </form>
  );
}
