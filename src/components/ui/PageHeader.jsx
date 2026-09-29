export default function PageHeader({ title, subtitle, actions }) {
    return (
        <div className="flex items-center justify-between flex-wrap gap-4 pb-2">
            <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold gold-gradient-text tracking-tight">
                    {title}
                </h1>
                {subtitle && <p className="text-xs md:text-sm text-on-surface-variant mt-1">{subtitle}</p>}
            </div>
            {actions}
        </div>
    );
}