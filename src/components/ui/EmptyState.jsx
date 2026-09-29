export default function EmptyState({ icon = "inbox", title = "Sin registros", description }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            {icon && (
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-2">
                    {icon}
                </span>
            )}
            <p className="text-sm font-medium text-on-surface-variant">{title}</p>
            {description && (
                <p className="text-xs text-on-surface-variant/70 mt-1 max-w-xs">{description}</p>
            )}
        </div>
    );
}
