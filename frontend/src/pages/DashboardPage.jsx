import { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../api';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [modalSplit, setModalSplit] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [summaryRes, modalRes] = await Promise.all([
        api.get('/api/analytics/summary'),
        api.get('/api/analytics/modal-split'),
      ]);
      setSummary(summaryRes.data.data);
      setModalSplit(modalRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header title="Dashboard" subtitle="Overview of travel data" />
        <div className="loading"><div className="spinner" /><p>Loading dashboard…</p></div>
      </>
    );
  }

  const stats = [
    { label: 'Total Trips', value: summary?.total_trips?.toLocaleString() || '0', icon: '📊', color: '#3E92CC' },
    { label: 'Active Users', value: summary?.total_users?.toLocaleString() || '0', icon: '👥', color: '#059669' },
    { label: 'Avg Distance', value: `${summary?.avg_distance_km || 0} km`, icon: '📏', color: '#F59E0B' },
    { label: 'Total Distance', value: `${summary?.total_distance_km || 0} km`, icon: '🗺️', color: '#8B5CF6' },
    { label: 'Avg Cost', value: `₹${summary?.avg_cost_inr || 0}`, icon: '💰', color: '#EF4444' },
  ];

  return (
    <>
      <Header title="Dashboard" subtitle="Overview of travel data collected across India" />

      <div className="stats-grid">
        {stats.map(stat => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-card-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className="stat-card-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick modal split */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="card-title">Transport Mode Distribution</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
          {modalSplit.map(item => (
            <div key={item.mode} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', background: '#F0F4F8', borderRadius: 8,
            }}>
              <span style={{ fontWeight: 700, color: '#0A2463' }}>{item.percentage}%</span>
              <span style={{ fontSize: 13, color: '#64748B', textTransform: 'capitalize' }}>
                {item.mode.replace('_', ' ')}
              </span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>({item.count})</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
