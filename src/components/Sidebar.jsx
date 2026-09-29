import { NavLink } from "react-router-dom";
import { useRole } from "../context/RoleContext";

const linkBase =
    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200";
const linkActive = "bg-primary/15 text-primary font-semibold border-l-2 border-primary shadow-sm";

export default function Sidebar() {
    const { role } = useRole();

    const isCliente = role.id === "cliente";

    const NAV_ITEMS = [
        { to: "/", icon: "spa", label: "Inicio & Sanctuary", public: true },
        { to: "/catalogo", icon: "auto_awesome", label: "Catálogo & Cotizador", public: true },
        { to: "/nueva-solicitud", icon: "calendar_add_on", label: "Agendar Cita", public: true },
        { to: "/aprobaciones", icon: "view_kanban", label: isCliente ? "Ver Mis Citas (Solo Lectura)" : "Tablero de Citas (Admin)", public: true },
        { to: "/contacto", icon: "mark_email_unread", label: "Contacto Concierge", public: true },
        ...(!isCliente
            ? [
                { to: "/roles", icon: "badge", label: "Especialistas & Roles" },
                { to: "/auditoria", icon: "history_edu", label: "Centro de Auditoría" },
            ]
            : []),
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 glass-panel border-r border-outline-variant/30 flex flex-col z-50">
            <div className="h-16 px-5 flex items-center gap-3 border-b border-outline-variant/30">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-inner">
                    <span className="material-symbols-outlined text-[22px]">spa</span>
                </div>
                <div className="flex flex-col leading-none">
                    <span className="font-serif font-bold text-lg tracking-wider gold-gradient-text">AURA</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-sans mt-0.5">
                        Estética &amp; Spa
                    </span>
                </div>
            </div>
            <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : ""}`
                        }
                    >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-outline-variant/30 m-3 rounded-xl bg-surface-container/50 border">
                <div className="flex items-center gap-2 text-xs text-primary mb-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                    <span>{isCliente ? "Modo Cliente VIP" : "Modo Administrador"}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                    {isCliente
                        ? "Permisos restringidos. Formularios envían notificación al Admin."
                        : "Acceso total a gestión de citas, avisos y roles."}
                </p>
            </div>
        </aside>
    );
}