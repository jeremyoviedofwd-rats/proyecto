export default function TextArea({ label, maxLength, value, className = "", ...props }) {
    return (
        <div className="space-y-1.5">
            {label && (
                <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">
                        {label}
                    </label>
                    {maxLength && (
                        <span className="text-[11px] font-mono text-on-surface-variant/70">
                            {(value || "").length}/{maxLength}
                        </span>
                    )}
                </div>
            )}
            <textarea
                value={value}
                maxLength={maxLength}
                className={`w-full p-3 rounded-xl bg-surface-container/80 border border-outline-variant/30 text-on-surface text-sm resize-none outline-none focus:border-primary/60 focus:bg-surface-container-high transition-all leading-relaxed ${className}`}
                {...props}
            />
        </div>
    );
}