import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-surface relative selection:bg-primary/30 selection:text-primary">
            {/* Ambient subtle background glow spots */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0" />
            <div className="fixed bottom-0 right-10 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[160px] pointer-events-none z-0" />

            <Sidebar />
            <div className="pl-64 relative z-10">
                <Topbar />
                <main className="pt-20 px-8 pb-12 max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}