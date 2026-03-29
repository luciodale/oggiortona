import { useWatch } from "react-hook-form";
import { useRestaurantForm } from "../../hooks/useRestaurantForm";
import { restaurantFormTypes, restaurantTypeLabels } from "../../config/categories";
import { getOrderedDays } from "../../utils/time";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Pill } from "../ui/Pill";
import { Button } from "../ui/Button";
import { DayRow } from "./form/DayRow";
import { LocationPickerField } from "../shared/LocationPickerField";

type RestaurantFormProps = {
  restaurantId?: number;
  initialData?: Parameters<typeof useRestaurantForm>[0];
};

export function RestaurantForm({ restaurantId, initialData }: RestaurantFormProps) {
  const {
    form,
    toggleType,
    copyFromPrevious,
    onSubmit,
    submitState,
    errorMessage,
    createdId,
  } = useRestaurantForm(initialData);

  const isEdit = restaurantId != null;
  const selectedTypes = useWatch({ control: form.control, name: "types" });
  const typesError = form.formState.errors.types;
  const orderedDays = getOrderedDays();
  const navigate = useNavigate();

  if (submitState === "success" && createdId) {
    toast.success(isEdit ? "Locale aggiornato!" : "Locale inviato per approvazione!");
    navigate({ to: isEdit ? "/" : "/restaurant/$id", params: isEdit ? undefined : { id: String(createdId) } });
    return null;
  }

  return (
    <form
      onSubmit={form.handleSubmit((data) => onSubmit(data, restaurantId))}
      className="space-y-5"
      aria-label={isEdit ? "Modifica locale" : "Pubblica locale"}
    >
      <Input
        label="Nome del locale"
        required
        placeholder="Es: Trattoria Da Mario"
        error={form.formState.errors.name?.message}
        {...form.register("name")}
      />

      <Textarea
        label="Descrizione"
        placeholder="Cucina tradizionale abruzzese con vista sul porto..."
        rows={3}
        maxLength={300}
        error={form.formState.errors.description?.message}
        {...form.register("description")}
      />

      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-medium text-primary">
          Tipo<span className="ml-0.5 text-danger" aria-hidden="true">*</span>
        </legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tipi di locale">
          {restaurantFormTypes.map((t) => (
            <Pill
              key={t}
              active={selectedTypes.includes(t)}
              onClick={() => toggleType(t)}
            >
              {restaurantTypeLabels[t]}
            </Pill>
          ))}
        </div>
        <div className="mt-3">
          <Input
            placeholder="Altro tipo (es: pescheria, pasticceria...)"
            {...form.register("customType")}
          />
        </div>
        {typesError && (
          <p className="mt-1 text-[11px] text-danger" role="alert">
            {typesError.message}
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-medium text-primary">
          Fascia di prezzo<span className="ml-0.5 text-danger" aria-hidden="true">*</span>
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
              aria-label={`${"€".repeat(n)} - ${n === 1 ? "Economico" : n === 2 ? "Medio" : "Alto"}`}
              className={`flex-1 rounded-xl py-2.5 text-center text-[13px] font-semibold transition-all ${
                form.getValues("priceRange") === n
                  ? "bg-primary text-white"
                  : "bg-surface-warm text-muted hover:text-primary"
              }`}
            >
              {"€".repeat(n)}
            </button>
          ))}
        </div>
      </fieldset>

      <LocationPickerField
        label="Indirizzo"
        placeholder="Cerca indirizzo..."
        initialAddress={initialData?.address ?? undefined}
        initialLatitude={initialData?.latitude ?? undefined}
        initialLongitude={initialData?.longitude ?? undefined}
        error={form.formState.errors.address?.message}
        onAddressChange={(v) => form.setValue("address", v, { shouldValidate: true, shouldDirty: true })}
        onCoordinatesChange={(lat, lng) => {
          form.setValue("latitude", lat, { shouldDirty: true });
          form.setValue("longitude", lng, { shouldDirty: true });
        }}
      />

      <Input
        label="Telefono"
        type="tel"
        placeholder="+39 085 906 1234"
        {...form.register("phone")}
      />

      <Input
        label="Link al menu"
        type="url"
        placeholder="https://..."
        error={form.formState.errors.menuUrl?.message}
        {...form.register("menuUrl")}
      />

      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-medium text-primary">
          Orari di apertura<span className="ml-0.5 text-danger" aria-hidden="true">*</span>
        </legend>
        <div className="rounded-xl border border-border bg-white px-3">
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

      {errorMessage && (
        <p className="text-[13px] text-danger" role="alert">{errorMessage}</p>
      )}

      {form.formState.isSubmitted && Object.keys(form.formState.errors).length > 0 && (
        <p className="text-[13px] text-danger" role="alert">
          Compila tutti i campi obbligatori prima di procedere
        </p>
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
            : "Pubblica locale"}
      </Button>
    </form>
  );
}
