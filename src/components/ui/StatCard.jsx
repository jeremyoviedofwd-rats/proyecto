const COLORS = {
    primary: "text-primary bg-primary/10 border-primary/20",
    success: "text-tertiary bg-tertiary/10 border-tertiary/20",
    danger: "text-error bg-error/10 border-error/20",
    rose: "text-secondary bg-secondary/10 border-secondary/20",
    neutral: "text-on-surface bg-surface-container border-outline-variant/30",
};

export default function StatCard({ label, value, color = "neutral", icon, subtitle }) {
    return (
        <div className="glass-panel rounded-2xl p-5 border border-outline-variant/30 flex items-center justify-between hover:border-primary/30 transition-all duration-300">
            <div>
                <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant block mb-1">
                    {label}
                </span>
                <p className="font-serif text-3xl font-bold gold-gradient-text tracking-tight">{value}</p>
                {subtitle && <p className="text-[11px] text-on-surface-variant/80 mt-1">{subtitle}</p>}
            </div>
            {icon && (
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${COLORS[color]}`}>
                    <span className="material-symbols-outlined text-[26px]">{icon}</span>
                </div>
            )}
        </div>
    );
}