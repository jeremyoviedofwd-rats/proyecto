import { useEffect, useState } from "react";
import { getAuditLogs } from "../api/client";
import { PageHeader, Card, Badge, Table } from "../components/ui";

export default function Auditoria() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuditLogs()
            .then((res) => setLogs(res || []))
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        {
            key: "fecha",
            header: "Fecha / Hora",
            render: (r) => (
                <span className="font-mono text-xs text-on-surface-variant">
                    {r.fecha ? new Date(r.fecha).toLocaleString("es-MX") : "Reciente"}
                </span>
            ),
        },
        {
            key: "accion",
            header: "Acción Registrada",
            render: (r) => <Badge tone="gold">{r.accion}</Badge>,
        },
        {
            key: "actor",
            header: "Usuario / Concierge",
            render: (r) => <span className="font-medium text-on-surface">{r.actor}</span>,
        },
        {
            key: "detalle",
            header: "Detalle de la Operación",
            render: (r) => <span className="text-on-surface-variant text-xs">{r.detalle}</span>,
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Centro de Auditoría & Trazabilidad"
                subtitle="Registro inmutable de actividades, reservas y cambios de estado en el santuario"
            />

            <Card title="Historial Operativo de Eventos">
                {loading ? (
                    <p className="text-sm text-on-surface-variant py-6 text-center">Cargando registros de auditoría...</p>
                ) : (
                    <Table columns={columns} data={logs} emptyText="Sin eventos registrados" />
                )}
            </Card>
        </div>
    );
}