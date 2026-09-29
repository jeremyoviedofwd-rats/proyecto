import { useState, useEffect } from "react";
import { useRole } from "../context/RoleContext";
import { Link } from "react-router-dom";
import { getMessages, markMessageAsRead } from "../api/client";
import { Modal, Badge, Button } from "./ui";

export default function Topbar() {
    const { role, setRole, ROLES } = useRole();
    const [mensajes, setMensajes] = useState([]);
    const [showInbox, setShowInbox] = useState(false);

    const isClient = role.id === "cliente";

    async function loadMessages() {
        try {
            const data = await getMessages();
            setMensajes(data || []);
        } catch {
            setMensajes([]);
        }
    }

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    const noLeidos = mensajes.filter((m) => !m.leido).length;

    async function handleMarkRead(id) {
        await markMessageAsRead(id);
        loadMessages();
    }

    return (
        <header className="fixed top-0 left-64 right-0 h-16 glass-panel border-b border-outline-variant/30 px-6 flex items-center justify-between z-40">
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                <span className="font-medium text-on-surface">AURA Polanco Sanctuary</span>
                <span className="text-outline-variant">/</span>
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${isClient
                        ? "text-secondary bg-secondary/10 border-secondary/20"
                        : "text-primary bg-primary/10 border-primary/20"
                    }`}>
                    {role.label}
                </span>
            </div>

            <div className="flex items-center gap-4">
                {/* SELECTOR DE ROLES */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs">
                    <span className="text-[11px] text-on-surface-variant px-2 uppercase font-medium hidden sm:inline">Perfil:</span>
                    {ROLES.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => setRole(r)}
                            className={`px-3 py-1.5 rounded-lg transition-all text-xs font-medium ${role.id === r.id
                                    ? "bg-primary text-on-primary-container font-semibold shadow"
                                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                {/* NOTIFICACIONES PARA ADMIN/STAFF */}
                {!isClient && (
                    <button
                        onClick={() => setShowInbox(true)}
                        className="relative p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary/40 text-on-surface-variant hover:text-on-surface transition-all"
                        title="Bandeja de Mensajes de Clientes"
                    >
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        {noLeidos > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error text-white font-bold text-[10px] flex items-center justify-center animate-bounce shadow">
                                {noLeidos}
                            </span>
                        )}
                    </button>
                )}

                <Link
                    to="/nueva-solicitud"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary-container text-xs font-semibold px-4 py-2 rounded-xl shadow-md hover:brightness-110 transition-all"
                >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    <span>{isClient ? "Cotizar / Reservar" : "Agendar Cita VIP"}</span>
                </Link>
            </div>

            {/* MODAL DE BANDEJA DE MENSAJES DE CLIENTES */}
            <Modal
                open={showInbox}
                title="Bandeja de Mensajes & Notificaciones de Clientes"
                onClose={() => setShowInbox(false)}
                footer={
                    <Button variant="ghost" className="w-full" onClick={() => setShowInbox(false)}>
                        Cerrar Bandeja
                    </Button>
                }
            >
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {mensajes.length === 0 ? (
                        <p className="text-center py-6 text-xs text-on-surface-variant">
                            No hay mensajes recibidos de los usuarios.
                        </p>
                    ) : (
                        mensajes.map((m) => (
                            <div
                                key={m.id}
                                className={`p-3.5 rounded-xl border transition-all ${m.leido
                                        ? "bg-surface-container/40 border-outline-variant/20 opacity-70"
                                        : "bg-primary/5 border-primary/40 shadow-sm"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <Badge tone={m.tipo === "cita" ? "gold" : "rose"}>
                                            {m.tipo === "cita" ? "NUEVA CITA" : "CONSULTA"}
                                        </Badge>
                                        <span className="font-semibold text-xs text-on-surface">{m.remitente}</span>
                                    </div>
                                    <span className="text-[10px] text-on-surface-variant font-mono">
                                        {m.fecha ? new Date(m.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Hoy"}
                                    </span>
                                </div>

                                <p className="text-xs font-medium text-primary mb-1">{m.asunto}</p>
                                <p className="text-xs text-on-surface-variant leading-relaxed mb-2 bg-surface/50 p-2 rounded-lg">
                                    {m.contenido}
                                </p>

                                <div className="flex justify-between items-center text-[11px] pt-1">
                                    <span className="text-on-surface-variant/80">{m.email} {m.telefono && `· ${m.telefono}`}</span>
                                    {!m.leido && (
                                        <button
                                            onClick={() => handleMarkRead(m.id)}
                                            className="text-tertiary font-semibold hover:underline flex items-center gap-1 text-[11px]"
                                        >
                                            <span className="material-symbols-outlined text-xs">done_all</span>
                                            Marcar leido
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </header>
    );
}