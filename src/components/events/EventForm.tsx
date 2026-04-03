import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useEventForm } from "../../hooks/useEventForm";
import { eventFormCategories, eventCategoryLabels } from "../../config/categories";
import { useLocale } from "../../i18n/useLocale";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Pill } from "../ui/Pill";
import { Button } from "../ui/Button";
import { FormError, SummaryFormError } from "../ui/FormError";
import { TimePicker } from "../ui/TimePicker";
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
  } = useEventForm(initialData, onSuccess);

  const { locale } = useLocale();
  const catLabels = eventCategoryLabels(locale);
  const isEdit = eventId != null;
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
      aria-label={isEdit ? "Modifica evento" : "Pubblica evento"}
    >
      <Input
        label="Titolo"
        required
        placeholder="Es: Sagra del pesce"
        error={form.formState.errors.title?.message}
        {...form.register("title")}
      />

      <Textarea
        label="Descrizione"
        placeholder="Descrivi l'evento..."
        rows={3}
        maxLength={500}
        error={form.formState.errors.description?.message}
        {...form.register("description")}
      />

      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-medium text-primary">
          Categoria<span className="ml-0.5 text-danger" aria-hidden="true">*</span>
        </legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Categorie disponibili">
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
            placeholder="Altra categoria (es: sagra, mercato...)"
            {...form.register("customCategory")}
          />
        </div>
        {categoriesError?.message && <FormError message={categoriesError.message} />}
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <DatePicker
          label="Data inizio"
          required
          value={form.watch("dateStart")}
          onChange={(v) => form.setValue("dateStart", v, { shouldValidate: true, shouldDirty: true })}
          error={form.formState.errors.dateStart?.message}
        />
        <DatePicker
          label="Data fine"
          value={form.watch("dateEnd")}
          onChange={(v) => form.setValue("dateEnd", v, { shouldValidate: true, shouldDirty: true })}
          error={form.formState.errors.dateEnd?.message}
          placeholder="Facoltativa"
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-medium text-primary">
          Orario
        </legend>
        <div className="flex items-center gap-2">
          <TimePicker
            value={form.watch("timeStart") || "18:00"}
            onChange={(v) => form.setValue("timeStart", v, { shouldDirty: true })}
          />
          <span className="text-muted" aria-hidden="true">&ndash;</span>
          <TimePicker
            value={form.watch("timeEnd") || "23:00"}
            onChange={(v) => form.setValue("timeEnd", v, { shouldDirty: true })}
          />
        </div>
      </fieldset>

      <LocationPickerField
        label="Luogo"
        placeholder="Cerca luogo..."
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
        label="Telefono"
        type="tel"
        placeholder="Es: +39 085 906 1234"
        error={form.formState.errors.phone?.message}
        {...form.register("phone")}
      />

      <Input
        label="Prezzo (EUR)"
        type="number"
        step="0.01"
        min="0"
        placeholder="Lascia vuoto se gratuito"
        error={form.formState.errors.price?.message}
        {...form.register("price", { valueAsNumber: true })}
      />

      <Input
        label="Link"
        type="url"
        placeholder="https://..."
        {...form.register("link")}
      />

      {errorMessage && <SummaryFormError message={errorMessage} />}

      {form.formState.isSubmitted && Object.keys(form.formState.errors).length > 0 && (
        <SummaryFormError message="Compila tutti i campi obbligatori prima di procedere" />
      )}

      <Button
        type="submit"
        fullWidth
        disabled={submitState === "submitting"}
        aria-busy={submitState === "submitting"}
      >
        {submitState === "submitting"
          ? "Salvataggio..."
          : isEdit
            ? "Salva modifiche"
            : "Pubblica evento"}
      </Button>
    </form>
  );
}
