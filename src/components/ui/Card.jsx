export default function Card({ title, subtitle, actions, className = "", children }) {
    return (
        <section className={`glass-panel rounded-2xl p-5 border border-outline-variant/30 ${className}`}>
            {(title || actions || subtitle) && (
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2 pb-3 border-b border-outline-variant/20">
                    <div>
                        {title && (
                            <h2 className="font-serif font-semibold text-base text-on-surface tracking-wide">
                                {title}
                            </h2>
                        )}
                        {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
                    </div>
                    {actions}
                </div>
            )}
            {children}
        </section>
    );
}