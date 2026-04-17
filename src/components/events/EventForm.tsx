import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useEventForm } from "../../hooks/useEventForm";
import { useUserRestaurants } from "../../hooks/useUserRestaurants";
import { useUserStores } from "../../hooks/useUserStores";
import { useSpaAuth } from "../../hooks/useSpaAuth";
import { eventFormCategories, eventCategoryLabels } from "../../config/categories";
import { useLocale } from "../../i18n/useLocale";
import type { RestaurantWithStatus, StoreWithStatus } from "../../types/domain";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Pill } from "../ui/Pill";
import { Button } from "../ui/Button";
import { FormError, SummaryFormError } from "../ui/FormError";
import { OptionalTimePicker } from "../ui/OptionalTimePicker";
import { DatePicker } from "../ui/DatePicker";
import { LocationPickerField } from "../shared/LocationPickerField";

type EventFormProps = {
  eventId?: number;
  initialData?: Parameters<typeof useEventForm>[0];
  onSuccess?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

export function EventForm({ eventId, initialData, onSuccess, onDirtyChange }: EventFormProps) {
  const {
    form,
    toggleCategory,
    onSubmit,
    submitState,
    errorMessage,
    t,
  } = useEventForm(initialData, onSuccess);

  const { locale } = useLocale();
  const catLabels = eventCategoryLabels(locale);
  const isEdit = eventId != null;
  const { isAdmin } = useSpaAuth();
  const { restaurants: userRestaurants } = useUserRestaurants();
  const { stores: userStores } = useUserStores();
  const { data: allRestaurantsData } = useQuery<{ restaurants: Array<RestaurantWithStatus> }>({
    queryKey: ["restaurants"],
    queryFn: () => fetch("/api/restaurants").then((r) => r.json()),
    enabled: isAdmin,
  });
  const { data: allStoresData } = useQuery<{ stores: Array<StoreWithStatus> }>({
    queryKey: ["stores"],
    queryFn: () => fetch("/api/stores").then((r) => r.json()),
    enabled: isAdmin,
  });
  const restaurantOptions = isAdmin ? (allRestaurantsData?.restaurants ?? []) : userRestaurants;
  const storeOptions = isAdmin ? (allStoresData?.stores ?? []) : userStores;
  const selectedCategories = useWatch({ control: form.control, name: "categories" });
  const categoriesError = form.formState.errors.categories;
  const { isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <form
      onSubmit={form.handleSubmit((data) => onSubmit(data, eventId))}
      className="space-y-5"
      aria-label={t(isEdit ? "events.editEvent" : "events.publishEvent")}
    >
      <Input
        label={t("common.title")}
        required
        placeholder={t("events.titlePlaceholder")}
        error={form.formState.errors.title?.message}
        {...form.register("title")}
      />

      <Textarea
        label={t("common.description")}
        placeholder={t("events.descPlaceholder")}
        rows={4}
        maxLength={500}
        error={form.formState.errors.description?.message}
        {...form.register("description")}
      />

      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-medium text-primary">
          {t("events.category")}<span className="ml-0.5 text-danger" aria-hidden="true">*</span>
        </legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("events.category")}>
          {eventFormCategories.map((cat) => (
            <Pill
              key={cat}
              active={selectedCategories.includes(cat)}
              onClick={() => toggleCategory(cat)}
            >
              {catLabels[cat] ?? cat}
            </Pill>
          ))}
        </div>
        <div className="mt-3">
          <Input
            placeholder={t("events.otherCategory")}
            {...form.register("customCategory")}
          />
        </div>
        {categoriesError?.message && <FormError message={categoriesError.message} />}
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <DatePicker
          label={t("events.dateStart")}
          required
          value={form.watch("dateStart")}
          onChange={(v) => form.setValue("dateStart", v, { shouldValidate: true, shouldDirty: true })}
          error={form.formState.errors.dateStart?.message}
        />
        <DatePicker
          label={t("events.dateEnd")}
          value={form.watch("dateEnd")}
          onChange={(v) => form.setValue("dateEnd", v, { shouldValidate: true, shouldDirty: true })}
          error={form.formState.errors.dateEnd?.message}
          placeholder={t("events.optional")}
          clearable
        />
      </div>

      <div className="space-y-2">
        <p className="text-[13px] font-medium text-primary">{t("events.time")}</p>
        <OptionalTimePicker
          label={t("events.timeStart")}
          value={form.watch("timeStart")}
          onChange={(v) => form.setValue("timeStart", v, { shouldDirty: true })}
        />
        <OptionalTimePicker
          label={t("events.timeEnd")}
          value={form.watch("timeEnd")}
          onChange={(v) => form.setValue("timeEnd", v, { shouldDirty: true })}
        />
      </div>

      <LocationPickerField
        label={t("events.location")}
        placeholder={t("events.searchLocation")}
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
        error={form.formState.errors.phone?.message}
        {...form.register("phone")}
      />

      <Input
        label={t("events.priceEur")}
        type="number"
        step="0.01"
        min="0"
        placeholder={t("events.priceHint")}
        error={form.formState.errors.price?.message}
        {...form.register("price", { valueAsNumber: true })}
      />

      <Input
        label={t("common.link")}
        type="url"
        placeholder="https://..."
        {...form.register("link")}
      />

      {restaurantOptions.length > 0 && (
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-primary">
            {t("events.linkedVenue")}
          </label>
          <select
            value={form.watch("restaurantId") ?? ""}
            onChange={(e) => form.setValue("restaurantId", e.target.value ? Number(e.target.value) : null, { shouldDirty: true })}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-[13px] text-primary outline-none transition-colors focus:border-accent"
          >
            <option value="">{t("events.noLinkedVenue")}</option>
            {restaurantOptions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      )}

      {storeOptions.length > 0 && (
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-primary">
            {t("events.linkedStore")}
          </label>
          <select
            value={form.watch("storeId") ?? ""}
            onChange={(e) => form.setValue("storeId", e.target.value ? Number(e.target.value) : null, { shouldDirty: true })}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-[13px] text-primary outline-none transition-colors focus:border-accent"
          >
            <option value="">{t("events.noLinkedStore")}</option>
            {storeOptions.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

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
            : t("events.publishEvent")}
      </Button>
    </form>
  );
}
