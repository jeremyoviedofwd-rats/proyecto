import { useEffect, useState } from "react";
import { getRoles } from "../api/client";
import { PageHeader, Card, Badge } from "../components/ui";

const TEAM_MEMBERS = [
    {
        nombre: "Dra. Sofía Valenzuela",
        rol: "Directora Médica & Especialista (Admin)",
        especialidad: "Medicina Estética & Armonización Facial",
        imagen: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
        certificados: ["Receptora de Notificaciones de Clientes", "Gestión Completa de Citas"],
    },
    {
        nombre: "Lic. Valentina Ríos",
        rol: "Cosmiatra Senior & Therapist",
        especialidad: "Tratamientos Faciales de Alta Tecnología & Drenaje",
        imagen: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        certificados: ["Atención en Cabina", "Gestión de Estado de Citas"],
    },
    {
        nombre: "Cliente / Usuario Común",
        rol: "Usuario Registrado / Visitante VIP",
        especialidad: "Cotización, Reserva de Citas y Consultas Concierge",
        imagen: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        certificados: ["Acceso Restringido", "Envío de Mensajes a Admin"],
    },
];

export default function RolesRBAC() {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        getRoles().then((res) => setRoles(res || []));
    }, []);

    return (
        <div className="space-y-8">
            <PageHeader
                title="Equipo de Especialistas & Matriz de Roles RBAC"
                subtitle="Definición de perfiles de usuario, permisos y receptor de notificaciones de formularios"
            />

            {/* TEAM CARDS */}
            <div>
                <h2 className="font-serif text-lg font-bold gold-gradient-text mb-4">Perfiles de Sistema</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TEAM_MEMBERS.map((member, idx) => (
                        <div key={idx} className="glass-panel p-5 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center">
                            <img
                                src={member.imagen}
                                alt={member.nombre}
                                className="w-24 h-24 rounded-full object-cover border-2 border-primary/40 mb-3 shadow-md"
                            />
                            <h3 className="font-serif font-bold text-on-surface text-base">{member.nombre}</h3>
                            <p className="text-xs text-primary font-medium mb-1">{member.rol}</p>
                            <p className="text-[11px] text-on-surface-variant mb-4 leading-relaxed">{member.especialidad}</p>
                            <div className="w-full border-t border-outline-variant/20 pt-3 flex flex-wrap justify-center gap-1">
                                {member.certificados.map((cert, i) => (
                                    <Badge key={i} tone="gold">{cert}</Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PERMISSIONS MATRIX */}
            <Card title="Matriz de Permisos & Control de Acceso (db.json)">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {roles.map((r) => (
                        <div key={r.id} className="bg-surface-container/60 rounded-xl p-4 border border-outline-variant/30">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-serif font-bold text-on-surface text-sm">{r.nombre}</h3>
                                <Badge tone={r.esAdmin ? "gold" : r.id === "cliente" ? "rose" : "neutral"}>
                                    {r.id}
                                </Badge>
                            </div>
                            <p className="text-xs text-primary mb-3">{r.especialista} ({r.experiencia})</p>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant block mb-2">
                                Permisos Asignados:
                            </span>
                            <ul className="space-y-1.5 text-xs text-on-surface-variant">
                                {r.permisos?.map((p) => (
                                    <li key={p} className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-tertiary text-[16px]">
                                            check_circle
                                        </span>
                                        <span className="capitalize">{p.replace("_", " ")}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}