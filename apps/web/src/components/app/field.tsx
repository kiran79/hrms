export function Field({
  label,
  type = "text",
  placeholder,
  defaultValue
}: {
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="h-11 rounded-md border border-border bg-white px-3 text-sm font-normal outline-none focus:border-primary"
      />
    </label>
  );
}
