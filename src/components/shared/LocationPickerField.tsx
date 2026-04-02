import { useId, useMemo, useState } from "react";
import { FormError } from "../ui/FormError";
import { SearchableDropdown } from "@luciodale/react-searchable-dropdown";
import { useAddressSearch } from "../../hooks/useAddressSearch";
import { useLocationPicker } from "../../hooks/useLocationPicker";
import { MAP_CSS } from "../../utils/map";

type LocationPickerFieldProps = {
  label: string;
  placeholder: string;
  initialAddress?: string;
  initialLatitude?: number;
  initialLongitude?: number;
  error?: string;
  coordinateError?: string;
  onAddressChange: (address: string) => void;
  onCoordinatesChange: (lat: number, lng: number) => void;
};

export function LocationPickerField({
  label,
  placeholder,
  initialAddress,
  initialLatitude,
  initialLongitude,
  error,
  coordinateError,
  onAddressChange,
  onCoordinatesChange,
}: LocationPickerFieldProps) {
  const addressId = useId();
  const errorId = useId();
  const { query: searchQuery, setQuery: setSearchQuery, suggestions } = useAddressSearch("");
  const options = useMemo(() => suggestions.map((s) => s.label), [suggestions]);

  const [lat, setLat] = useState<number | null>(initialLatitude ?? null);
  const [lng, setLng] = useState<number | null>(initialLongitude ?? null);
  const [mapVisible, setMapVisible] = useState(lat != null && lng != null);

  const mapCallbackRef = useLocationPicker({
    latitude: lat,
    longitude: lng,
    onMove(newLat, newLng) {
      setLat(newLat);
      setLng(newLng);
      onCoordinatesChange(newLat, newLng);
    },
  });

  function handleSelect(option: string) {
    const match = suggestions.find((s) => s.label === option);
    if (!match) return;
    onCoordinatesChange(match.latitude, match.longitude);
    setSearchQuery(match.value);
    setLat(match.latitude);
    setLng(match.longitude);
    setMapVisible(true);
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={addressId} className="mb-1.5 block text-[13px] font-medium text-primary">
          {label}<span className="ml-0.5 text-danger" aria-hidden="true">*</span>
        </label>
        <p className="mb-1.5 text-[11px] text-muted">
          Visibile sulla pagina
        </p>
        <input
          id={addressId}
          type="text"
          defaultValue={initialAddress ?? ""}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder={placeholder}
          aria-required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-[13px] text-primary outline-none placeholder:text-muted/40 focus:border-accent"
        />
        {error && <FormError message={error} />}
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-primary">
          Posizione sulla mappa<span className="ml-0.5 text-danger">*</span>
        </label>
        <p className="mb-1.5 text-[11px] text-muted">
          Cerca un indirizzo o trascina il segnaposto per le coordinate esatte
        </p>
        <SearchableDropdown
          options={options}
          value={undefined}
          setValue={handleSelect}
          searchQuery={searchQuery}
          onSearchQueryChange={(q) => setSearchQuery(q ?? "")}
          filterType="NO_MATCH"
          createNewOptionIfNoMatch={false}
          placeholder="Cerca sulla mappa..."
          classNameSearchableDropdownContainer="relative flex items-center rounded-xl border border-border bg-card focus-within:border-accent"
          classNameSearchQueryInput="w-full rounded-xl bg-transparent px-3 py-2.5 text-[13px] text-primary outline-none placeholder:text-muted/40"
          classNameDropdownOptions="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-card shadow-lg"
          classNameDropdownOption="px-3 py-2.5 text-[13px] text-primary cursor-pointer"
          classNameDropdownOptionFocused="bg-surface-alt"
          classNameDropdownOptionNoMatch="px-3 py-2.5 text-[13px] text-muted"
          classNameTriggerIcon="hidden"
          classNameTriggerIconInvert="hidden"
        />

        {mapVisible && (
          <div className="mt-2">
            <style>{MAP_CSS}</style>
            <style>{`.picker-pin { background: none !important; border: none !important; }`}</style>
            <div
              ref={mapCallbackRef}
              role="application"
              aria-label="Trascina il segnaposto per scegliere la posizione"
              className="h-[200px] w-full overflow-hidden rounded-xl border border-border"
            />
          </div>
        )}
        {coordinateError && <FormError message={coordinateError} />}
      </div>
    </div>
  );
}
