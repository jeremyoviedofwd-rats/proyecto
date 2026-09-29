export default function Modal({ open, title, onClose, children, footer }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md bg-surface-container-high rounded-xl border border-outline-variant/30 shadow-lg">
                <div className="flex items-center justify-between px-4 h-12 border-b border-outline-variant/30">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-on-surface-variant hover:text-on-surface"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                <div className="p-4">{children}</div>
                {footer && (
                    <div className="px-4 py-3 border-t border-outline-variant/30 flex justify-end gap-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}