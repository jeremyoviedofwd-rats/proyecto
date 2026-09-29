import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createRequest, createMessage, addAuditLog, getServices, getRoles } from "../api/client";
import { useRole } from "../context/RoleContext";
import { PageHeader, Card, Input, TextArea, Button, Select, Badge } from "../components/ui";

const HORARIOS = [
    "09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"
];

export default function NuevaSolicitud() {
    const navigate = useNavigate();
    const location = useLocation();
    const { role } = useRole();

    const isClient = role.id === "cliente";

    const [servicios, setServicios] = useState([]);
    const [especialistas, setEspecialistas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [servicioId, setServicioId] = useState("");
    const [cliente, setCliente] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [especialista, setEspecialista] = useState("");
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
    const [hora, setHora] = useState("10:30 AM");
    const [notas, setNotas] = useState("");

    const [enviando, setEnviando] = useState(false);
    const [exito, setExito] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([getServices(), getRoles()])
            .then(([resServicios, resRoles]) => {
                setServicios(resServicios || []);
                const espList = (resRoles || [])
                    .filter((r) => r.especialista)
                    .map((r) => r.especialista);
                setEspecialistas(espList);

                const preselected = location.state?.selectedServiceId || (resServicios?.[0]?.id || "");
                setServicioId(preselected);
                if (espList.length > 0) setEspecialista(espList[0]);
            })
            .finally(() => setLoading(false));
    }, [location.state]);

    const servicioSeleccionado = servicios.find((s) => s.id === servicioId) || servicios[0];
    const precio = servicioSeleccionado ? servicioSeleccionado.precio : 0;

    async function handleSubmit(e) {
        e.preventDefault();
        if (!cliente || !email || !servicioSeleccionado) {
            setError("Por favor completa todos los campos requeridos.");
            return;
        }

        setEnviando(true);
        setError(null);

        const idCita = `CITA-${Math.floor(1000 + Math.random() * 9000)}`;

        const nuevaCita = {
            id: idCita,
            cliente,
            email,
            telefono,
            servicio: servicioSeleccionado.nombre,
            categoria: servicioSeleccionado.categoria,
            especialista: especialista || "Asignación Automática VIP",
            fecha,
            hora,
            montoFinal: precio,
            estado: "pendiente",
            notas,
            solicitante: role.label,
            creadoEn: new Date().toISOString(),
        };

        try {
            // 1. Guardar la cita en db.json
            const creada = await createRequest(nuevaCita);

            // 2. Enviar Mensaje de Notificación al Rol Principal / Administrador
            await createMessage({
                id: `MSG-${Date.now()}`,
                remitente: cliente,
                email,
                telefono,
                tipo: "cita",
                asunto: `Nueva Solicitud de Cita: ${servicioSeleccionado.nombre} (${idCita})`,
                contenido: `El cliente ${cliente} solicitó una cita para el tratamiento ${servicioSeleccionado.nombre} ($${precio} USD) el día ${fecha} a las ${hora}. Notas: ${notas || "Sin especificaciones"}`,
                fecha: new Date().toISOString(),
                leido: false,
                rolDestino: "super-admin"
            });

            // 3. Registrar en Auditoría
            await addAuditLog({
                id: `log-${Date.now()}`,
                accion: "CITA_SOLICITADA",
                actor: role.label,
                detalle: `Solicitud enviada para ${creada.servicio} (${creada.id}) por ${cliente}`,
                fecha: new Date().toISOString(),
            });

            setExito(true);
            setTimeout(() => {
                navigate("/aprobaciones");
            }, 2500);
        } catch (err) {
            setError("No se pudo registrar la solicitud. Verifique su conexión.");
        } finally {
            setEnviando(false);
        }
    }

    if (loading) {
        return <div className="text-center py-12 text-on-surface-variant">Cargando cotizador de reserva...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            <PageHeader
                title={isClient ? "Cotizar & Solicitud de Cita" : "Reserva de Experiencia VIP"}
                subtitle={isClient ? "Solicita la disponibilidad de tu tratamiento. Tu petición llegará de inmediato al Administrador." : "Registro directo en la agenda de AURA Sanctuary"}
            />

            {error && (
                <div className="p-4 rounded-xl bg-error/15 border border-error/30 text-error text-xs font-medium">
                    {error}
                </div>
            )}

            {exito && (
                <div className="p-5 rounded-2xl bg-tertiary/15 border border-tertiary/40 text-tertiary text-sm font-semibold text-center space-y-1 animate-pulse">
                    <p className="text-base font-serif">¡Solicitud Registrada y Notificada con Éxito!</p>
                    <p className="text-xs text-on-surface-variant font-normal">
                        Tu solicitud ha sido guardada en la base de datos y enviada como mensaje de notificación al rol Administrador. Redirigiendo...
                    </p>
                </div>
            )}

            {/* PASO 01: SELECCIÓN DE SERVICIO */}
            <Card title="Paso 01 — Tratamiento Seleccionado" actions={<Badge tone="gold">Cotización en Vivo</Badge>}>
                <div className="space-y-4">
                    <Select
                        label="Seleccione el Servicio de Estética o Spa"
                        value={servicioId}
                        onChange={(e) => setServicioId(e.target.value)}
                        options={servicios.map((s) => ({
                            value: s.id,
                            label: `${s.nombre} — $${s.precio} USD (${s.duracion})`,
                        }))}
                    />

                    {servicioSeleccionado && (
                        <div className="p-4 rounded-xl bg-surface-container border border-primary/20 flex flex-col md:flex-row gap-4 items-center">
                            <img
                                src={servicioSeleccionado.imagen}
                                alt={servicioSeleccionado.nombre}
                                className="w-full md:w-32 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h4 className="font-serif font-bold text-on-surface">{servicioSeleccionado.nombre}</h4>
                                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                                    {servicioSeleccionado.descripcion}
                                </p>
                                <div className="flex items-center gap-3 text-xs mt-2">
                                    <span className="text-primary font-bold font-serif">${precio} USD</span>
                                    <span className="text-on-surface-variant">• {servicioSeleccionado.duracion}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* PASO 02: FECHA, HORA Y ESPECIALISTA */}
            <Card title="Paso 02 — Fecha, Horario & Especialista">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Fecha Estimada"
                        type="date"
                        icon="calendar_today"
                        required
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />

                    <Select
                        label="Horario Preferido"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        options={HORARIOS.map((h) => ({ value: h, label: h }))}
                    />

                    <div className="md:col-span-2">
                        <Select
                            label="Especialista Preferido"
                            value={especialista}
                            onChange={(e) => setEspecialista(e.target.value)}
                            options={especialistas.map((esp) => ({ value: esp, label: esp }))}
                        />
                    </div>
                </div>
            </Card>

            {/* PASO 03: DATOS DEL CLIENTE */}
            <Card title="Paso 03 — Datos del Solicitante">
                <div className="space-y-4">
                    <Input
                        label="Nombre Completo"
                        icon="person"
                        placeholder="Ej. Camila Mendoza"
                        required
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Correo Electrónico"
                            icon="mail"
                            type="email"
                            placeholder="cliente@ejemplo.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Teléfono / WhatsApp"
                            icon="phone"
                            placeholder="+52 55 1234 5678"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>

                    <TextArea
                        label="Notas o Especificaciones Especiales"
                        placeholder="Mencione alergias, tipo de piel o indicaciones para el especialista..."
                        rows={3}
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                    />
                </div>
            </Card>

            {/* RESUMEN Y ENVÍO */}
            <div className="glass-panel p-5 rounded-2xl border border-primary/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <span className="text-xs uppercase text-on-surface-variant block">Valor Total Cotizado</span>
                    <span className="font-serif text-3xl font-bold gold-gradient-text">${precio} USD</span>
                </div>
                <Button type="submit" size="lg" disabled={enviando || exito} icon="send">
                    {enviando ? "Guardando & Notificando..." : "Enviar Solicitud al Administrador"}
                </Button>
            </div>
        </form>
    );
}