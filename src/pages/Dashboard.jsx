import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRequests, getServices } from "../api/client";
import { PageHeader, StatCard, Card, Table, EstadoBadge, Button } from "../components/ui";

const HERO_IMAGE = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80";

const REVIEWS = [
    {
        name: "Valeria Gomez",
        treatment: "HydraGlow Luxury Facial",
        comment: "La atención en AURA es inigualable. Mi piel quedó radiante desde la primera sesión. Un ambiente verdaderamente sanador.",
        rating: 5,
    },
    {
        name: "Carlos Villareal",
        treatment: "Masaje Holístico con Piedras Volcánicas",
        comment: "El mejor masaje de liberación de tensión que he experimentado. La música, los aromas y la técnica de la terapeuta fueron sublimes.",
        rating: 5,
    }
];

export default function Dashboard() {
    const [citas, setCitas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getRequests(), getServices()])
            .then(([resCitas, resServicios]) => {
                setCitas(resCitas || []);
                setServicios(resServicios || []);
            })
            .finally(() => setLoading(false));
    }, []);

    const contar = (estado) => citas.filter((i) => i.estado === estado).length;
    const destacados = servicios.filter((s) => s.destacado);

    const columns = [
        { key: "id", header: "Cód. Cita", render: (r) => <span className="font-mono text-xs text-primary">{r.id}</span> },
        { key: "cliente", header: "Cliente VIP", render: (r) => <span className="font-medium">{r.cliente}</span> },
        { key: "servicio", header: "Servicio Reservado", render: (r) => <span className="text-on-surface">{r.servicio}</span> },
        { key: "fecha", header: "Fecha / Hora", render: (r) => `${r.fecha} · ${r.hora}` },
        {
            key: "montoFinal",
            header: "Inversión",
            render: (r) => <span className="font-serif font-bold text-primary">${r.montoFinal} USD</span>,
        },
        { key: "estado", header: "Estado Cita", render: (r) => <EstadoBadge estado={r.estado} /> },
    ];

    return (
        <div className="space-y-8">
            {/* HERO BANNER */}
            <div className="relative rounded-3xl overflow-hidden glass-panel border border-primary/20 shadow-2xl">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform hover:scale-100 transition-transform duration-1000"
                    style={{ backgroundImage: `url(${HERO_IMAGE})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent" />

                <div className="relative z-10 p-8 md:p-12 max-w-2xl">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs uppercase tracking-widest font-semibold mb-4">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        Sanctuary &amp; High-End Wellness
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-4 leading-tight">
                        El arte de la belleza <br />
                        <span className="gold-gradient-text">holística &amp; rejuvenecimiento</span>
                    </h1>
                    <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-6">
                        Experimenta protocolos faciales avanzados, medicina estética sin cirugía y ceremonias de masaje diseñadas exclusivamente para revitalizar cuerpo y alma.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/nueva-solicitud">
                            <Button size="lg" icon="calendar_month">
                                Agendar Experiencia VIP
                            </Button>
                        </Link>
                        <Link to="/catalogo">
                            <Button variant="secondary" size="lg" icon="grid_view">
                                Explorar Menú de Servicios
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* METRIC STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Citas Pendientes"
                    value={contar("pendiente")}
                    color="warning"
                    icon="hourglass_top"
                    subtitle="Por confirmar por concierge"
                />
                <StatCard
                    label="Citas Confirmadas"
                    value={contar("confirmado")}
                    color="primary"
                    icon="check_circle"
                    subtitle="Programadas para atención"
                />
                <StatCard
                    label="Tratamientos Completados"
                    value={contar("completado")}
                    color="success"
                    icon="task_alt"
                    subtitle="Sesiones finalizadas"
                />
                <StatCard
                    label="Satisfacción VIP"
                    value="99.4%"
                    color="rose"
                    icon="star"
                    subtitle="Valoración de nuestros socios"
                />
            </div>

            {/* TRATAMIENTOS DESTACADOS */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="font-serif text-xl font-bold gold-gradient-text">Rituales &amp; Tratamientos Insignia</h2>
                        <p className="text-xs text-on-surface-variant">Selección preferida por nuestros miembros este mes</p>
                    </div>
                    <Link to="/catalogo" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                        Ver catálogo completo
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {destacados.map((s) => (
                        <div
                            key={s.id}
                            className="glass-panel rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={s.imagen}
                                    alt={s.nombre}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur px-3 py-1 rounded-full border border-primary/30 text-xs font-serif font-bold text-primary">
                                    ${s.precio} USD
                                </div>
                                <div className="absolute bottom-3 left-3 bg-surface/80 backdrop-blur px-2.5 py-0.5 rounded-full text-[11px] text-on-surface-variant flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs text-primary">schedule</span>
                                    {s.duracion}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-serif font-semibold text-lg text-on-surface group-hover:text-primary transition-colors mb-2">
                                        {s.nombre}
                                    </h3>
                                    <p className="text-xs text-on-surface-variant leading-relaxed mb-4 line-clamp-2">
                                        {s.descripcion}
                                    </p>
                                </div>
                                <Link to="/nueva-solicitud" state={{ selectedServiceId: s.id }}>
                                    <Button variant="gold" size="sm" className="w-full" icon="event">
                                        Agendar este Tratamiento
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TABLA DE CITAS RECIENTES */}
            <Card
                title="Agenda & Citas Recientes"
                subtitle="Listado actualizado de servicios agendados en el santuario"
                actions={
                    <Link to="/aprobaciones">
                        <Button variant="ghost" size="sm" icon="view_kanban">
                            Ver Tablero Kanban
                        </Button>
                    </Link>
                }
            >
                {loading ? (
                    <p className="text-sm text-on-surface-variant py-6 text-center">Cargando agenda...</p>
                ) : (
                    <Table columns={columns} data={citas} emptyText="No hay citas registradas" />
                )}
            </Card>

            {/* RESEÑAS VIP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REVIEWS.map((rev, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-2xl border border-primary/10 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-1 text-primary mb-2">
                                {[...Array(rev.rating)].map((_, i) => (
                                    <span key={i} className="material-symbols-outlined text-sm">star</span>
                                ))}
                            </div>
                            <p className="text-xs italic text-on-surface-variant leading-relaxed mb-4">
                                "{rev.comment}"
                            </p>
                        </div>
                        <div className="flex justify-between items-center text-xs border-t border-outline-variant/20 pt-3">
                            <span className="font-medium text-on-surface">{rev.name}</span>
                            <span className="text-primary font-serif">{rev.treatment}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}