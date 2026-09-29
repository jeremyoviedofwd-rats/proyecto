const TONES = {
    neutral: "bg-surface-container-highest text-on-surface-variant border-outline-variant/40",
    primary: "bg-primary/15 text-primary border-primary/30",
    gold: "bg-primary/20 text-primary border-primary/40",
    success: "bg-tertiary/15 text-tertiary border-tertiary/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    danger: "bg-error/15 text-error border-error/30",
    rose: "bg-secondary/15 text-secondary border-secondary/30",
};

export default function Badge({ tone = "neutral", dot = false, children }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide border ${TONES[tone] || TONES.neutral}`}
        >
            {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
            {children}
        </span>
    );
}

export function EstadoBadge({ estado }) {
    const map = {
        pendiente: { tone: "warning", label: "Pendiente" },
        confirmado: { tone: "primary", label: "Confirmada" },
        en_tratamiento: { tone: "rose", label: "En Tratamiento" },
        completado: { tone: "success", label: "Completada" },
        aprobado: { tone: "success", label: "Confirmada" },
        rechazado: { tone: "danger", label: "Cancelada" },
    };
    const cfg = map[estado] || { tone: "neutral", label: estado };
    return (
        <Badge tone={cfg.tone} dot>
            {cfg.label}
        </Badge>
    );
}