import { useEffect, useState } from "react";
import { getRequests, updateRequestStatus, addAuditLog } from "../api/client";
import { useRole } from "../context/RoleContext";
import { PageHeader, Card, Badge, EstadoBadge, Button, EmptyState, Spinner } from "../components/ui";

const COLUMNS = [
    { key: "pendiente", label: "Pendientes Concierge", icon: "hourglass_top", color: "warning" },
    { key: "confirmado", label: "Citas Confirmadas", icon: "event_available", color: "primary" },
    { key: "en_tratamiento", label: "En Tratamiento / Sala", icon: "spa", color: "rose" },
    { key: "completado", label: "Completadas", icon: "task_alt", color: "success" },
];

export default function AprobacionesKanban() {
    const { role } = useRole();
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    const isClient = role.id === "cliente";
    const canEdit = !isClient && (role.canEditKanban !== false);

    async function load() {
        setLoading(true);
        const data = await getRequests();
        setCitas(data || []);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    async function cambiarEstado(id, nuevoEstado, clienteNombre) {
        if (!canEdit) return;
        await updateRequestStatus(id, nuevoEstado);
        await addAuditLog({
            id: `log-${Date.now()}`,
            accion: `ESTADO_CAMBIADO_${nuevoEstado.toUpperCase()}`,
            actor: role.label,
            detalle: `Actualizó cita ${id} (${clienteNombre}) a estado ${nuevoEstado}`,
            fecha: new Date().toISOString(),
        });
        load();
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={isClient ? "Consulta de Citas & Disponibilidad" : "Tablero de Gestión de Citas & Cabinas"}
                subtitle={isClient ? "Vista informativa de solicitudes registradas en AURA Sanctuary" : "Monitoreo en tiempo real del flujo de atenciones y salas en AURA Sanctuary"}
                actions={
                    <div className="flex items-center gap-2">
                        {isClient && (
                            <Badge tone="rose" dot>Solo Consulta / Sin edición</Badge>
                        )}
                        <Button variant="secondary" icon="refresh" onClick={load}>
                            Actualizar
                        </Button>
                    </div>
                }
            />

            {isClient && (
                <div className="p-4 rounded-xl bg-surface-container border border-primary/20 text-xs text-on-surface-variant flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">info</span>
                    <span>
                        Estás navegando con el rol <strong className="text-primary">Cliente / Usuario Común</strong>. Puedes consultar el estado de las citas y cotizar, pero la edición de estados está reservada para el rol Administrador.
                    </span>
                </div>
            )}

            {loading ? (
                <Spinner label="Cargando tablero..." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {COLUMNS.map((col) => {
                        const itemsInCol = citas.filter((item) => {
                            if (col.key === "confirmado") {
                                return item.estado === "confirmado" || item.estado === "aprobado";
                            }
                            return item.estado === col.key;
                        });

                        return (
                            <Card
                                key={col.key}
                                title={col.label}
                                actions={<Badge tone={col.color}>{itemsInCol.length}</Badge>}
                                className="h-full flex flex-col justify-start"
                            >
                                {itemsInCol.length === 0 ? (
                                    <EmptyState icon={col.icon} title="Sin citas en esta etapa" />
                                ) : (
                                    <div className="space-y-3 mt-1">
                                        {itemsInCol.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-surface-container/70 rounded-xl p-4 border border-outline-variant/30 hover:border-primary/40 transition-all space-y-2.5"
                                            >
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-mono text-primary font-medium">{item.id}</span>
                                                    <Badge tone="gold">{item.categoria || "SPA"}</Badge>
                                                </div>

                                                <div>
                                                    <p className="font-serif font-bold text-on-surface text-sm">{item.cliente}</p>
                                                    <p className="text-xs text-primary font-medium mt-0.5">{item.servicio}</p>
                                                </div>

                                                <div className="text-[11px] text-on-surface-variant space-y-1 bg-surface/50 p-2 rounded-lg border border-outline-variant/20">
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs text-primary">calendar_today</span>
                                                        <span>{item.fecha} · {item.hora}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs text-secondary">person</span>
                                                        <span>{item.especialista}</span>
                                                    </div>
                                                    {item.notas && (
                                                        <p className="italic text-[10px] text-on-surface-variant/80 border-t border-outline-variant/20 pt-1 mt-1">
                                                            "{item.notas}"
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-center pt-1">
                                                    <span className="font-serif font-bold text-xs gold-gradient-text">
                                                        ${item.montoFinal} USD
                                                    </span>
                                                    <EstadoBadge estado={item.estado} />
                                                </div>

                                                {/* ACCIONES DE ESTADO SOLO PARA ADMIN */}
                                                {canEdit && (
                                                    <div className="pt-2 border-t border-outline-variant/20 flex flex-wrap gap-1.5">
                                                        {col.key === "pendiente" && (
                                                            <>
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    className="flex-1 text-[11px]"
                                                                    onClick={() => cambiarEstado(item.id, "confirmado", item.cliente)}
                                                                >
                                                                    Confirmar
                                                                </Button>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    className="flex-1 text-[11px]"
                                                                    onClick={() => cambiarEstado(item.id, "rechazado", item.cliente)}
                                                                >
                                                                    Cancelar
                                                                </Button>
                                                            </>
                                                        )}

                                                        {col.key === "confirmado" && (
                                                            <Button
                                                                variant="gold"
                                                                size="sm"
                                                                className="w-full text-[11px]"
                                                                icon="play_arrow"
                                                                onClick={() => cambiarEstado(item.id, "en_tratamiento", item.cliente)}
                                                            >
                                                                Iniciar en Cabina
                                                            </Button>
                                                        )}

                                                        {col.key === "en_tratamiento" && (
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                className="w-full text-[11px]"
                                                                icon="check_circle"
                                                                onClick={() => cambiarEstado(item.id, "completado", item.cliente)}
                                                            >
                                                                Finalizar Tratamiento
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}