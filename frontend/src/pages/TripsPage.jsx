import { useState, useEffect } from 'react';
import Header from '../components/Header';
import api from '../api';
import { TRAVEL_MODES, TRIP_PURPOSES, IONICON_COMPONENTS } from '../utils/constants';

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modeFilter, setModeFilter] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('');

  useEffect(() => {
    loadTrips();
  }, [page, modeFilter, purposeFilter]);

  async function loadTrips() {
    setLoading(true);
    try {
      const params = { page, per_page: 20 };
      if (modeFilter) params.mode = modeFilter;
      if (purposeFilter) params.purpose = purposeFilter;
      const res = await api.get('/api/trips', { params });
      const data = res.data.data;
      setTrips(data.trips);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(str) {
    return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function formatTime(str) {
    return new Date(str).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <>
      <Header title="Trip Data" subtitle={`${total} trips recorded by travellers`} />

      <div className="filter-bar">
        <select className="filter-select" value={modeFilter} onChange={e => { setModeFilter(e.target.value); setPage(1); }}>
          <option value="">All Modes</option>
          {TRAVEL_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select className="filter-select" value={purposeFilter} onChange={e => { setPurposeFilter(e.target.value); setPage(1); }}>
          <option value="">All Purposes</option>
          {TRIP_PURPOSES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /><p>Loading trips…</p></div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Time</th>
                <th>Mode</th>
                <th>Purpose</th>
                <th>Distance</th>
                <th>Cost</th>
                <th>Companions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip.id}>
                  <td style={{ fontWeight: 700, color: '#0A2463' }}>{trip.trip_number}</td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {trip.origin?.address || `${trip.origin?.lat?.toFixed(3)}, ${trip.origin?.lng?.toFixed(3)}`}
                  </td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {trip.destination?.address || `${trip.destination?.lat?.toFixed(3)}, ${trip.destination?.lng?.toFixed(3)}`}
                  </td>
                  <td>{formatDate(trip.start_time)}</td>
                  <td>{formatTime(trip.start_time)}</td>
                  <td>
                    <span className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {(() => { const m = TRAVEL_MODES.find(x => x.value === trip.mode); const Icon = m ? IONICON_COMPONENTS[m.icon] : null; return Icon ? <Icon style={{ fontSize: 14 }} /> : null; })()}
                      {trip.mode?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {(() => { const p = TRIP_PURPOSES.find(x => x.value === trip.purpose); const Icon = p ? IONICON_COMPONENTS[p.icon] : null; return Icon ? <Icon style={{ fontSize: 14 }} /> : null; })()}
                      {trip.purpose?.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#3E92CC' }}>{trip.distance} km</td>
                  <td style={{ fontWeight: 600, color: '#059669' }}>{trip.cost > 0 ? `₹${trip.cost}` : 'Free'}</td>
                  <td style={{ textAlign: 'center' }}>{trip.companions}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="data-table-pagination">
            <span>Page {page} of {totalPages} ({total} total)</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </button>
              <button className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
