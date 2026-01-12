import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/shared/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "./pages/Dashboard";
import type { ReactNode } from "react";
import GigDetails from "./pages/GigDetails";
import PostGig from "./pages/PostGig";
import { SocketProvider } from "./context/SocketContext";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route
                path="/"
                element={
                  <Home/>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-gig"
                element={
                  <ProtectedRoute>
                    <PostGig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gigs/:id"
                element={
                  <ProtectedRoute>
                    <GigDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
