import { useState } from "react";
import { createMessage, addAuditLog } from "../api/client";
import { useRole } from "../context/RoleContext";
import { PageHeader, Card, Input, TextArea, Button, Badge } from "../components/ui";

const FAQS = [
    {
        q: "¿Requiere evaluación previa la Medicina Estética?",
        a: "Sí. Todo procedimiento médico-estético incluye una valoración preliminar sin costo adicional realizada por la Directora Médica.",
    },
    {
        q: "¿Cuál es la política de cancelación o reagendamiento?",
        a: "Agradecemos notificar cambios con al menos 12 horas de anticipación a través de nuestro Concierge WhatsApp o portal web.",
    },
    {
        q: "¿Ofrecen certificados de regalo para experiencias en pareja?",
        a: "Contamos con certificados físicos de lujo en cajas serigrafiadas y versiones digitales personalizadas.",
    },
];

export default function Contacto() {
    const { role } = useRole();
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [asunto, setAsunto] = useState("Consulta General");
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);

    async function handleSend(e) {
        e.preventDefault();
        setEnviando(true);

        try {
            // Guardar mensaje en db.json y notificar al Rol Administrador
            await createMessage({
                id: `MSG-${Date.now()}`,
                remitente: nombre,
                email,
                telefono,
                tipo: "contacto",
                asunto: `Consulta: ${asunto}`,
                contenido: mensaje,
                fecha: new Date().toISOString(),
                leido: false,
                rolDestino: "super-admin"
            });

            await addAuditLog({
                id: `log-${Date.now()}`,
                accion: "CONSULTA_ENVIADA",
                actor: role.label,
                detalle: `Mensaje de contacto enviado por ${nombre} (${asunto})`,
                fecha: new Date().toISOString(),
            });

            setEnviado(true);
            setTimeout(() => {
                setNombre("");
                setEmail("");
                setTelefono("");
                setMensaje("");
                setEnviado(false);
            }, 4000);
        } catch (err) {
            console.error("Error enviando consulta:", err);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Contacto & Concierge VIP"
                subtitle="Envíe su consulta. Todos los mensajes se registran en db.json y notifican directamente al Administrador."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* INFORMACIÓN DEL SANTUARIO */}
                <div className="space-y-4">
                    <Card title="AURA Sanctuary Polanco">
                        <div className="space-y-4 text-xs">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-on-surface">Ubicación Privada</p>
                                    <p className="text-on-surface-variant leading-relaxed">
                                        Av. Presidente Masaryk #410, Suite 302<br />Polanco VIP, Ciudad de México.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-on-surface">Horarios de Atención</p>
                                    <p className="text-on-surface-variant">Lunes a Sábado: 09:00 - 20:00 hrs.</p>
                                    <p className="text-on-surface-variant">Domingos: 10:00 - 17:00 hrs.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-sm">mark_email_unread</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-on-surface">Concierge Directo</p>
                                    <p className="text-on-surface-variant">concierge@auraspa.com</p>
                                    <p className="text-primary font-medium">+52 55 9988 7766 (WhatsApp)</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* FAQ CARD */}
                    <Card title="Preguntas Frecuentes">
                        <div className="space-y-3">
                            {FAQS.map((faq, i) => (
                                <div key={i} className="p-3 rounded-xl bg-surface-container border border-outline-variant/20">
                                    <p className="font-semibold text-xs text-primary mb-1">{faq.q}</p>
                                    <p className="text-[11px] text-on-surface-variant leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* FORMULARIO DE CONTACTO */}
                <div className="lg:col-span-2">
                    <Card
                        title="Formulario de Consulta Directa al Administrador"
                        subtitle="El mensaje se almacenará en la base de datos (db.json) y notificará al Rol Principal"
                    >
                        {enviado ? (
                            <div className="p-8 text-center space-y-3 glass-panel rounded-xl border border-tertiary/40">
                                <span className="material-symbols-outlined text-4xl text-tertiary">check_circle</span>
                                <h3 className="font-serif font-bold text-lg text-on-surface">¡Mensaje Notificado al Administrador!</h3>
                                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                                    Tu mensaje ha sido guardado exitosamente en db.json y enviado a la bandeja de entrada del rol Administrador.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSend} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Nombre Completo"
                                        icon="person"
                                        placeholder="Ej. Ana Sofía Ramírez"
                                        required
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />

                                    <Input
                                        label="Correo Electrónico"
                                        icon="mail"
                                        type="email"
                                        placeholder="ana@ejemplo.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <Input
                                    label="Teléfono de Contacto"
                                    icon="phone"
                                    placeholder="+52 55 9988 7711"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                />

                                <div>
                                    <label className="text-xs uppercase tracking-wide text-on-surface-variant block mb-1">
                                        Asunto de la Consulta
                                    </label>
                                    <select
                                        value={asunto}
                                        onChange={(e) => setAsunto(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl bg-surface-container text-on-surface text-sm outline-none border border-outline-variant/30 focus:border-primary transition-colors"
                                    >
                                        <option value="Consulta General">Consulta General de Servicios</option>
                                        <option value="Cotización Spa Party">Cotización de Evento / Spa Party</option>
                                        <option value="Certificado Regalo">Adquisición de Certificado de Regalo</option>
                                        <option value="Medicina Estetica">Valoración con Directora Médica</option>
                                    </select>
                                </div>

                                <TextArea
                                    label="Mensaje o Cotización Deseada"
                                    placeholder="Escriba aquí los detalles de su cotización o requerimiento..."
                                    rows={5}
                                    required
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                />

                                <Button type="submit" size="lg" className="w-full" disabled={enviando} icon="send">
                                    {enviando ? "Guardando en DB..." : "Enviar y Notificar al Administrador"}
                                </Button>
                            </form>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
