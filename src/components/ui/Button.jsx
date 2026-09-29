const VARIANTS = {
    primary: "bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-semibold shadow-md hover:brightness-110",
    secondary: "bg-surface-container border border-outline-variant/40 text-on-surface hover:bg-surface-container-high hover:border-primary/40",
    ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
    danger: "bg-error/15 border border-error/30 text-error hover:bg-error/25",
    success: "bg-tertiary/15 border border-tertiary/30 text-tertiary hover:bg-tertiary/25",
    gold: "bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30",
};

const SIZES = {
    sm: "h-8 px-3 text-xs rounded-lg",
    md: "h-10 px-4 text-sm rounded-xl",
    lg: "h-12 px-6 text-base rounded-xl font-medium",
};

export default function Button({
    variant = "primary",
    size = "md",
    icon,
    className = "",
    children,
    ...props
}) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size]} ${className}`}
            {...props}
        >
            {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
            {children}
        </button>
    );
}