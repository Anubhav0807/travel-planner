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

  // Markdown-like rendering (bold, headers, lists)
  function renderInsightsText(text) {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];

    let listBuffer = [];
    let listType = null; // 'ul' or 'ol'

    const flushList = (key) => {
      if (listBuffer.length === 0) return null;

      const ListTag = listType === 'ol' ? 'ol' : 'ul';
      const el = (
        <ListTag key={key}>
          {listBuffer.map((item, i) => (
            <li key={i}>{parseInline(item)}</li>
          ))}
        </ListTag>
      );

      listBuffer = [];
      listType = null;
      return el;
    };

    const parseInline = (line) => {
      if (!line) return line;

      let parts = [];
      let remaining = line;

      // Handle bold (**text** or __text__)
      const boldRegex = /(\*\*|__)(.*?)\1/;

      while (remaining.length > 0) {
        const match = remaining.match(boldRegex);

        if (!match) {
          parts.push(cleanText(remaining));
          break;
        }

        const [full, , content] = match;
        const index = match.index;

        if (index > 0) {
          parts.push(cleanText(remaining.slice(0, index)));
        }

        parts.push(<strong key={parts.length}>{cleanText(content)}</strong>);
        remaining = remaining.slice(index + full.length);
      }

      return parts;
    };

    const cleanText = (text) => {
      return text
        .replace(/\*/g, '') // remove stray *
        .replace(/_/g, '')  // remove stray _
        .trim();
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();

      // Headings
      if (trimmed.startsWith('### ')) {
        elements.push(flushList(i));
        elements.push(<h3 key={i}>{parseInline(trimmed.slice(4))}</h3>);
        return;
      }

      if (trimmed.startsWith('## ')) {
        elements.push(flushList(i));
        elements.push(<h2 key={i}>{parseInline(trimmed.slice(3))}</h2>);
        return;
      }

      if (trimmed.startsWith('# ')) {
        elements.push(flushList(i));
        elements.push(<h1 key={i}>{parseInline(trimmed.slice(2))}</h1>);
        return;
      }

      // Unordered List
      if (/^[-*] /.test(trimmed)) {
        if (listType !== 'ul') {
          elements.push(flushList(i));
          listType = 'ul';
        }
        listBuffer.push(trimmed.slice(2));
        return;
      }

      // Ordered List
      if (/^\d+\. /.test(trimmed)) {
        if (listType !== 'ol') {
          elements.push(flushList(i));
          listType = 'ol';
        }
        listBuffer.push(trimmed.replace(/^\d+\. /, ''));
        return;
      }

      // Empty Line
      if (trimmed === '') {
        elements.push(flushList(i));
        elements.push(<br key={i} />);
        return;
      }

      // Horizontal Rule (--- or ***)
      if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
        elements.push(flushList(i));
        elements.push(
          <hr
            key={i}
            style={{
              border: 'none',
              borderTop: '1px solid #ccc',
              marginVertical: 12,
            }}
          />
        );
        return;
      }

      // Normal Paragraph
      elements.push(flushList(i));
      elements.push(
        <p key={i}>
          {parseInline(trimmed)}
        </p>
      );
    });

    // Flush any remaining list
    elements.push(flushList('end'));

    return elements;
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
          <p>Gemini is analyzing the travel data…</p>
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
