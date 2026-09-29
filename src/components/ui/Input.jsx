export default function Input({ label, hint, icon, className = "", ...props }) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="text-xs uppercase tracking-wider text-on-surface-variant block font-medium">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {icon && (
                    <span className="material-symbols-outlined absolute left-3 text-[18px] text-primary">
                        {icon}
                    </span>
                )}
                <input
                    className={`w-full h-10 ${icon ? "pl-10" : "pl-3.5"} pr-3.5 rounded-xl bg-surface-container/80 border border-outline-variant/30 text-on-surface text-sm outline-none focus:border-primary/60 focus:bg-surface-container-high transition-all ${className}`}
                    {...props}
                />
            </div>
            {hint && <p className="text-[11px] text-on-surface-variant/80">{hint}</p>}
        </div>
    );
}