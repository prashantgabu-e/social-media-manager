import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { useAuth } from "./hooks/useAuth";
import { LoadingState } from "./components/ui/LoadingState";
import { ToastProvider } from "./hooks/useToast";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CalendarPage } from "./pages/CalendarPage";
import { ContentPage } from "./pages/ContentPage";
import { ContentEditorPage } from "./pages/ContentEditorPage";
import { CampaignsPage } from "./pages/CampaignsPage";
import { ProductsPage } from "./pages/ProductsPage";
import { SettingsPage } from "./pages/SettingsPage";

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper p-4">
        <LoadingState label="Checking authentication" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout />;
}

export function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route index element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="content/new" element={<ContentEditorPage />} />
          <Route path="content/:id" element={<ContentEditorPage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}
