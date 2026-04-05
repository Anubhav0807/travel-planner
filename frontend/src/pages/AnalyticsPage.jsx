import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Header from '../components/Header';
import api from '../api';
import { CHART_COLORS } from '../utils/constants';

export default function AnalyticsPage() {
  const [modalSplit, setModalSplit] = useState([]);
  const [temporal, setTemporal] = useState([]);
  const [odMatrix, setOdMatrix] = useState([]);
  const [purposeDist, setPurposeDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [modalRes, temporalRes, odRes, purposeRes] = await Promise.all([
        api.get('/api/analytics/modal-split'),
        api.get('/api/analytics/temporal'),
        api.get('/api/analytics/od-matrix'),
        api.get('/api/analytics/purpose'),
      ]);
      setModalSplit(modalRes.data.data);
      setTemporal(temporalRes.data.data);
      setOdMatrix(odRes.data.data);
      setPurposeDist(purposeRes.data.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header title="Analytics" subtitle="Travel pattern analysis" />
        <div className="loading"><div className="spinner" /><p>Loading analytics…</p></div>
      </>
    );
  }

  // Format modal data for pie chart
  const pieData = modalSplit.map(item => ({
    name: item.mode.replace('_', ' '),
    value: item.count,
    percent: item.percentage,
  }));

  // Format purpose data for pie chart
  const purposeData = purposeDist.map(item => ({
    name: item.purpose.replace('_', ' '),
    value: item.count,
    percent: item.percentage,
  }));

  // Format temporal data
  const barData = temporal.map(item => ({
    hour: `${String(item.hour).padStart(2, '0')}:00`,
    trips: item.count,
  }));

  return (
    <>
      <Header title="Analytics" subtitle="Deep insights into travel patterns" />

      <div className="charts-grid">
        {/* Modal Split Pie */}
        <div className="chart-card">
          <div className="chart-card-title">Transport Mode Distribution</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${percent}%`}>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} trips`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Purpose Distribution */}
        <div className="chart-card">
          <div className="chart-card-title">Trip Purpose Distribution</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={purposeData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${percent}%`}>
                {purposeData.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[(index + 3) % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} trips`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Temporal Distribution */}
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-card-title">Hourly Trip Distribution</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="hour" fontSize={11} tick={{ fill: '#64748B' }} />
            <YAxis fontSize={11} tick={{ fill: '#64748B' }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0' }} />
            <Bar dataKey="trips" fill="#3E92CC" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* OD Matrix */}
      <div className="chart-card">
        <div className="chart-card-title">Top Origin-Destination Pairs</div>
        {odMatrix.length === 0 ? (
          <p style={{ color: '#94A3B8', textAlign: 'center', padding: 40 }}>
            No OD data available yet. Trips need origin/destination addresses.
          </p>
        ) : (
          <div className="data-table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Trip Count</th>
                  <th>Avg Distance</th>
                </tr>
              </thead>
              <tbody>
                {odMatrix.map((row, i) => (
                  <tr key={i}>
                    <td>{row.origin}</td>
                    <td>{row.destination}</td>
                    <td style={{ fontWeight: 700, color: '#0A2463' }}>{row.trip_count}</td>
                    <td>{row.avg_distance_km} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
