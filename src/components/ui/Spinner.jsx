export default function Spinner({ label = "Cargando..." }) {
    return (
        <div className="flex items-center gap-2 text-on-surface-variant text-sm py-6 justify-center">
            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            {label}
        </div>
    );
}