import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../api/client";
import { PageHeader, Card, Button, Input, Modal, Badge } from "../components/ui";

const CATEGORIAS = [
    { id: "todos", label: "Todos los Tratamientos", icon: "all_inclusive" },
    { id: "faciales", label: "Cuidado Facial", icon: "face_3" },
    { id: "masajes", label: "Masajes & Holístico", icon: "self_improvement" },
    { id: "corporales", label: "Modelado Corporal", icon: "accessibility_new" },
    { id: "medicina", label: "Medicina Estética", icon: "medical_services" },
];

export default function Catalogo() {
    const [servicios, setServicios] = useState([]);
    const [categoria, setCategoria] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        getServices()
            .then((res) => setServicios(res || []))
            .finally(() => setLoading(false));
    }, []);

    const filtrados = servicios.filter((s) => {
        const matchCat = categoria === "todos" || s.categoria === categoria;
        const matchBusqueda =
            s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            s.descripcion.toLowerCase().includes(busqueda.toLowerCase());
        return matchCat && matchBusqueda;
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Catálogo de Servicios & Experiencias VIP"
                subtitle="Diseño de tratamientos personalizados para la salud cutánea y serenidad física"
                actions={
                    <Link to="/nueva-solicitud">
                        <Button icon="calendar_month">Agendar Cita Directa</Button>
                    </Link>
                }
            />

            {/* CONTROLES DE FILTRADO Y BÚSQUEDA */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Categorías */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {CATEGORIAS.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategoria(cat.id)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${categoria === cat.id
                                    ? "bg-primary text-on-primary-container font-semibold shadow-md"
                                    : "bg-surface-container/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                                }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Búsqueda */}
                <div className="w-full md:w-72">
                    <Input
                        placeholder="Buscar tratamiento..."
                        icon="search"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* CATALOG GRID */}
            {loading ? (
                <div className="text-center py-12 text-on-surface-variant">Cargando catálogo de servicios...</div>
            ) : filtrados.length === 0 ? (
                <Card className="text-center py-12">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">search_off</span>
                    <p className="text-sm font-medium text-on-surface-variant">
                        No encontramos servicios en la categoría o búsqueda seleccionada.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtrados.map((s) => (
                        <div
                            key={s.id}
                            className="glass-panel rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={s.imagen}
                                        alt={s.nombre}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
                                    <div className="absolute top-3 left-3">
                                        <Badge tone="gold">{s.categoria.toUpperCase()}</Badge>
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur px-3 py-1 rounded-full text-xs font-serif font-bold text-primary border border-primary/30">
                                        ${s.precio} USD
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="font-serif font-bold text-lg text-on-surface mb-2 group-hover:text-primary transition-colors">
                                        {s.nombre}
                                    </h3>
                                    <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                                        {s.descripcion}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-on-surface-variant font-medium">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                                            {s.duracion}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm text-tertiary">verified</span>
                                            Protocolo VIP
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 pt-0 flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setSelectedService(s)}
                                >
                                    Ver Detalles
                                </Button>
                                <Link to="/nueva-solicitud" state={{ selectedServiceId: s.id }} className="flex-1">
                                    <Button variant="primary" size="sm" className="w-full" icon="calendar_month">
                                        Reservar
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL DE DETALLES */}
            <Modal
                open={!!selectedService}
                title={selectedService?.nombre || "Detalle de Tratamiento"}
                onClose={() => setSelectedService(null)}
                footer={
                    <div className="flex gap-2 w-full">
                        <Button variant="ghost" onClick={() => setSelectedService(null)} className="flex-1">
                            Cerrar
                        </Button>
                        <Link
                            to="/nueva-solicitud"
                            state={{ selectedServiceId: selectedService?.id }}
                            className="flex-1"
                            onClick={() => setSelectedService(null)}
                        >
                            <Button variant="primary" className="w-full" icon="calendar_month">
                                Reservar Cita
                            </Button>
                        </Link>
                    </div>
                }
            >
                {selectedService && (
                    <div className="space-y-4 text-sm">
                        <img
                            src={selectedService.imagen}
                            alt={selectedService.nombre}
                            className="w-full h-44 object-cover rounded-xl border border-outline-variant/30"
                        />
                        <div className="flex justify-between items-center font-serif">
                            <span className="text-xl font-bold gold-gradient-text">${selectedService.precio} USD</span>
                            <span className="text-xs text-on-surface-variant font-sans flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                                Duración: {selectedService.duracion}
                            </span>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed">{selectedService.descripcion}</p>
                        <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 text-xs space-y-1">
                            <p className="font-semibold text-primary">Incluye en el Santuario:</p>
                            <ul className="list-disc list-inside text-on-surface-variant space-y-0.5">
                                <li>Diagnóstico dermoestético computarizado previo.</li>
                                <li>Bebida botánica o infusión relajante de bienvenida.</li>
                                <li>Uso de aceites esenciales puros de grado terapéutico.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
