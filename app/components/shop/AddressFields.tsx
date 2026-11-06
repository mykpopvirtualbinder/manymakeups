import { provinces } from "@/lib/shop/places";

export type AddressValue = {
  street: string;
  extra: string;
  postalCode: string;
  city: string;
  province: string;
};

export const emptyAddress: AddressValue = {
  street: "",
  extra: "",
  postalCode: "",
  city: "",
  province: "",
};

export function AddressFields({
  value,
  onChange,
}: {
  value: AddressValue;
  onChange: (patch: Partial<AddressValue>) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="field-label sm:col-span-2">
        Calle y número
        <input
          className="field"
          required
          autoComplete="address-line1"
          value={value.street}
          onChange={(event) => onChange({ street: event.target.value })}
        />
      </label>
      <label className="field-label sm:col-span-2">
        Piso, puerta o casa
        <input
          className="field"
          required
          autoComplete="address-line2"
          value={value.extra}
          onChange={(event) => onChange({ extra: event.target.value })}
        />
      </label>
      <label className="field-label">
        Código postal
        <input
          className="field"
          required
          inputMode="numeric"
          autoComplete="postal-code"
          value={value.postalCode}
          onChange={(event) => onChange({ postalCode: event.target.value })}
        />
      </label>
      <label className="field-label">
        Población
        <input
          className="field"
          required
          autoComplete="address-level2"
          value={value.city}
          onChange={(event) => onChange({ city: event.target.value })}
        />
      </label>
      <label className="field-label sm:col-span-2">
        Provincia
        <select
          className="field"
          required
          autoComplete="address-level1"
          value={value.province}
          onChange={(event) => onChange({ province: event.target.value })}
        >
          <option value="">Elige provincia</option>
          {provinces.map((province) => (
            <option key={province.name} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
