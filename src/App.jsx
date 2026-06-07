import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage     from "./pages/LoginPage";
import RegisterPage  from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BooksPage     from "./pages/BooksPage";
import BorrowsPage   from "./pages/BorrowsPage";
import MembersPage   from "./pages/MembersPage";
import ProfilePage   from "./pages/ProfilePage";
import { Spinner }   from "./components/UI";

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Spinner size={40} />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />

      <Route path="/" element={
        <ProtectedRoute roles={["admin","librarian","member"]}>
          <DashboardPage />
        </ProtectedRoute>
      }/>
      <Route path="/books" element={
        <ProtectedRoute roles={["admin","librarian","member"]}>
          <BooksPage />
        </ProtectedRoute>
      }/>
      <Route path="/borrows" element={
        <ProtectedRoute roles={["admin","librarian","member"]}>
          <BorrowsPage />
        </ProtectedRoute>
      }/>
      <Route path="/members" element={
        <ProtectedRoute roles={["admin","librarian"]}>
          <MembersPage />
        </ProtectedRoute>
      }/>
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }/>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
