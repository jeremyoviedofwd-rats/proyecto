import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Catalogo from "./pages/Catalogo";
import NuevaSolicitud from "./pages/NuevaSolicitud";
import AprobacionesKanban from "./pages/AprobacionesKanban";
import Contacto from "./pages/Contacto";
import RolesRBAC from "./pages/RolesRBAC";
import Auditoria from "./pages/Auditoria";

export default function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/nueva-solicitud" element={<NuevaSolicitud />} />
            <Route path="/aprobaciones" element={<AprobacionesKanban />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/roles" element={<RolesRBAC />} />
            <Route path="/auditoria" element={<Auditoria />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RoleProvider>
  );
}