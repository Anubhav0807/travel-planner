import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TripsPage from './pages/TripsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import InsightsPage from './pages/InsightsPage';
import './App.css';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout><DashboardPage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <AppLayout><TripsPage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AppLayout><AnalyticsPage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <AppLayout><InsightsPage /></AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
