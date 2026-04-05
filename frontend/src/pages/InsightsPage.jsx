import { useState } from 'react';
import { IoSparkles, IoHourglass } from 'react-icons/io5';
import Header from '../components/Header';
import api from '../api';

export default function InsightsPage() {
  const [prompt, setPrompt] = useState('');
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/insights/generate', {
        prompt: prompt || undefined,
      });
      setInsights(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate insights.');
    } finally {
      setLoading(false);
    }
  }

  // Simple markdown-like rendering (bold, headers, lists)
  function renderInsightsText(text) {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i}>{line.slice(2)}</li>;
      if (line.match(/^\d+\. /)) return <li key={i}>{line.replace(/^\d+\. /, '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      // Bold markdown
      const bolded = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} dangerouslySetInnerHTML={{ __html: bolded }} />;
    });
  }

  return (
    <>
      <Header title="AI Insights" subtitle="Gemini-powered planning recommendations" />

      <div className="insights-prompt">
        <input
          className="form-input"
          placeholder="Optional: Focus on a specific area (e.g., public transport, sustainability, peak hours)"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
        />
        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {loading ? <><IoHourglass /> Generating...</> : <><IoSparkles /> Generate Insights</>}
        </button>
      </div>

      {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Gemini is analyzing your travel data…</p>
        </div>
      )}

      {insights && !loading && (
        <>
          {/* Summary stats */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-card-value">{insights.data_summary?.total_trips || 0}</div>
              <div className="stat-card-label">Trips Analyzed</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">{insights.data_summary?.total_users || 0}</div>
              <div className="stat-card-label">Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">{insights.model}</div>
              <div className="stat-card-label">AI Model</div>
            </div>
          </div>

          {/* AI Response */}
          <div className="insights-content">
            {renderInsightsText(insights.insights)}
          </div>
        </>
      )}

      {!insights && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>
          <div style={{ fontSize: 48, marginBottom: 16, display: 'flex', justifyContent: 'center' }}><IoSparkles /></div>
          <h3 style={{ color: '#1E293B', marginBottom: 8 }}>Generate AI Insights</h3>
          <p>Click the button above to analyze your travel data using Google Gemini AI</p>
        </div>
      )}
    </>
  );
}
