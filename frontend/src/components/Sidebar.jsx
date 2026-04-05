import { NavLink } from 'react-router-dom';
import { HiOutlineChartPie, HiOutlineMap, HiOutlineChartBar, HiOutlineLightBulb, HiOutlineLogout } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🗺️</div>
        <div>
          <h1>Travel Planner</h1>
          <span>NATPAC Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Overview</div>
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HiOutlineChartPie /> Dashboard
        </NavLink>
        <NavLink to="/trips" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HiOutlineMap /> Trip Data
        </NavLink>

        <div className="sidebar-section-label">Analysis</div>
        <NavLink to="/analytics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HiOutlineChartBar /> Analytics
        </NavLink>
        <NavLink to="/insights" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <HiOutlineLightBulb /> AI Insights
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.name?.charAt(0) || '?'}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Scientist'}</div>
            <div className="sidebar-user-role">{user?.role || 'scientist'}</div>
          </div>
          <HiOutlineLogout
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}
            onClick={logout}
            title="Logout"
          />
        </div>
      </div>
    </aside>
  );
}
