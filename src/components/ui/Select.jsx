export default function Select({ label, options, className = "", ...props }) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="text-xs uppercase tracking-wider text-on-surface-variant block font-medium">
                    {label}
                </label>
            )}
            <select
                className={`w-full h-10 px-3.5 rounded-xl bg-surface-container/80 border border-outline-variant/30 text-on-surface text-sm outline-none focus:border-primary/60 focus:bg-surface-container-high transition-all ${className}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-surface-container-high text-on-surface">
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}