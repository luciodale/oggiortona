import { useMemo } from "react";
import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import { useAddressSearch } from "../../../hooks/useAddressSearch";
import type { UseFormReturn } from "react-hook-form";
import type { EventFormValues } from "../../../schemas/event";

type EventAddressSearchFieldProps = {
  form: UseFormReturn<EventFormValues>;
  initialAddress?: string;
};

export function EventAddressSearchField({ form, initialAddress }: EventAddressSearchFieldProps) {
  const { query, setQuery, suggestions } = useAddressSearch(initialAddress ?? "");
  const options = useMemo(() => suggestions.map((s) => s.label), [suggestions]);

  function handleSelect(option: string) {
    const match = suggestions.find((s) => s.label === option);
    if (!match) return;
    form.setValue("address", match.value, { shouldDirty: true, shouldValidate: true });
    form.setValue("latitude", match.latitude, { shouldDirty: true });
    form.setValue("longitude", match.longitude, { shouldDirty: true });
    setQuery(match.value);
  }

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-primary">
        Luogo<span className="ml-0.5 text-danger">*</span>
      </label>
      <SearchableDropdown
        options={options}
        value={undefined}
        setValue={handleSelect}
        searchQuery={query}
        onSearchQueryChange={(q) => {
          setQuery(q ?? "");
          if (q) form.setValue("address", q, { shouldValidate: true });
        }}
        filterType="NO_MATCH"
        createNewOptionIfNoMatch={false}
        placeholder="Cerca luogo..."
        classNameSearchableDropdownContainer="relative flex items-center rounded-xl border border-border bg-white focus-within:border-accent"
        classNameSearchQueryInput="w-full rounded-xl bg-transparent px-3 py-2.5 text-[13px] text-primary outline-none placeholder:text-muted/40"
        classNameDropdownOptions="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-white shadow-lg"
        classNameDropdownOption="px-3 py-2.5 text-[13px] text-primary cursor-pointer"
        classNameDropdownOptionFocused="bg-surface-alt"
        classNameDropdownOptionNoMatch="px-3 py-2.5 text-[13px] text-muted"
        classNameTriggerIcon="hidden"
        classNameTriggerIconInvert="hidden"
      />
      {form.formState.errors.address?.message && (
        <p className="mt-1 text-[11px] text-danger">
          {form.formState.errors.address.message}
        </p>
      )}
    </div>
  );
}
