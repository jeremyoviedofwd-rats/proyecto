import { createContext, useContext, useState } from "react";

const RoleContext = createContext(null);

const ROLES = [
    {
        id: "super-admin",
        label: "Directora Médica & Admin",
        esAdmin: true,
        canEditKanban: true,
        canAccessAdminPanels: true
    },
    {
        id: "manager",
        label: "Cosmiatra Senior",
        esAdmin: false,
        canEditKanban: true,
        canAccessAdminPanels: false
    },
    {
        id: "cliente",
        label: "Cliente / Usuario Común",
        esAdmin: false,
        canEditKanban: false,
        canAccessAdminPanels: false
    },
];

export function RoleProvider({ children }) {
    const [role, setRole] = useState(ROLES[0]);

    return (
        <RoleContext.Provider value={{ role, setRole, ROLES }}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    const ctx = useContext(RoleContext);
    if (!ctx) throw new Error("useRole debe usarse dentro de RoleProvider");
    return ctx;
}