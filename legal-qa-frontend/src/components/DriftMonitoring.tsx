import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

interface AnswerComparison {
  identical: boolean;
  diff: string;
}

interface RetrievedDocuments {
  production: string[];
  shadow: string[];
}

interface Metrics {
  response_time?: number;
  drift?: boolean;
  token_drift?: boolean;
}

interface DriftData {
  question_id: string;
  question: string;
  production_answer: string;
  shadow_answer: string;
  answer_comparison: AnswerComparison;
  retrieved_documents: RetrievedDocuments;
  metrics: Metrics;
  timestamp?: number;
  production_model?: boolean;
  shadow_model?: boolean;
}

interface RowProps {
  driftData: DriftData;
}

function Row({ driftData }: RowProps) {
  const [open, setOpen] = useState(false);
  const timestamp = driftData.timestamp ? new Date(driftData.timestamp * 1000) : null;

  return (
    <>
      <tr style={{ borderBottom: '1px solid #ddd' }}>
        <td>
          <button onClick={() => setOpen(!open)} style={{ border: 'none', background: 'none', padding: '0', cursor: 'pointer' }}>
            {open ? '▲' : '▼'}
          </button>
        </td>
        <td>{driftData.question_id}</td>
        <td>{driftData.question}</td>
        <td>{driftData.metrics?.drift ? 'Yes' : 'No'}</td>
        <td>{driftData.metrics?.token_drift ? 'Yes' : 'No'}</td>
        <td>{timestamp ? format(timestamp, 'yyyy-MM-dd HH:mm:ss') : 'N/A'}</td>
        <td>
          <button onClick={() => setOpen(!open)} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
            Details
          </button>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7} style={{ padding: '16px', backgroundColor: '#f9f9f9' }}>
            <h3>Detailed Analysis</h3>
            <p>Question ID: {driftData.question_id}</p>
            <p>Timestamp: {timestamp ? format(timestamp, 'yyyy-MM-dd HH:mm:ss') : 'N/A'}</p>
            <p>Production Model: {driftData.production_model ? 'Yes' : 'No'}</p>
            <p>Shadow Model: {driftData.shadow_model ? 'Yes' : 'No'}</p>

            <h4>Answers</h4>
            <p><strong>Production Answer:</strong></p>
            <ReactMarkdown>{driftData.production_answer || 'N/A'}</ReactMarkdown>
            <p><strong>Shadow Answer:</strong></p>
            <ReactMarkdown>{driftData.shadow_answer || 'N/A'}</ReactMarkdown>

            <h4>Answer Comparison</h4>
            {driftData.answer_comparison?.identical ? (
              <p style={{ color: 'green' }}>Answers are identical.</p>
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', border: '1px solid #eee', padding: '10px', backgroundColor: '#f5f5f5' }}>
                {driftData.answer_comparison?.diff || 'No significant difference.'}
              </pre>
            )}

            <h4>Retrieved Documents</h4>
            <p><strong>Production Retrieved Documents:</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', border: '1px solid #eee', padding: '10px', backgroundColor: '#f5f5f5' }}>
              {driftData.retrieved_documents?.production ? JSON.stringify(driftData.retrieved_documents.production, null, 2) : 'N/A'}
            </pre>
            <p><strong>Shadow Retrieved Documents:</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', border: '1px solid #eee', padding: '10px', backgroundColor: '#f5f5f5' }}>
              {driftData.retrieved_documents?.shadow ? JSON.stringify(driftData.retrieved_documents.shadow, null, 2) : 'N/A'}
            </pre>

            <h4>Metrics</h4>
            <p><strong>Response Time:</strong> {driftData.metrics?.response_time || 'N/A'}</p>
            <p><strong>Drift Detected:</strong> {driftData.metrics?.drift ? 'Yes' : 'No'}</p>
            <p><strong>Token Drift Detected:</strong> {driftData.metrics?.token_drift ? 'Yes' : 'No'}</p>
          </td>
        </tr>
      )}
    </>
  );
}

function DriftAnalysisPage() {
  const [driftData, setDriftData] = useState<DriftData[]>([]);
  const [fromTimestamp, setFromTimestamp] = useState('');
  const [toTimestamp, setToTimestamp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchDriftData = async () => {
    setError(null);
    let apiUrl = '/drift_explorer_with_context';
    const params = new URLSearchParams();
    if (fromTimestamp) {
      params.append('from_timestamp', (new Date(fromTimestamp).getTime() / 1000).toString());
    }
    if (toTimestamp) {
      params.append('to_timestamp', (new Date(toTimestamp).getTime() / 1000).toString());
    }

    if (params.toString()) {
      apiUrl += `?${params.toString()}`;
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch drift data');
      }
      const data: DriftData[] = await response.json();
      setDriftData(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchDriftData();
  }, []); // Fetch on initial load

  const handleFilter = () => {
    fetchDriftData();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Drift Analysis</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div>
          <label htmlFor="from-timestamp">From Timestamp:</label>
          <input
            type="datetime-local"
            id="from-timestamp"
            value={fromTimestamp}
            onChange={(e) => setFromTimestamp(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label htmlFor="to-timestamp">To Timestamp:</label>
          <input
            type="datetime-local"
            id="to-timestamp"
            value={toTimestamp}
            onChange={(e) => setToTimestamp(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button onClick={handleFilter} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Filter
        </button>
        <button onClick={() => { setFromTimestamp(''); setToTimestamp(''); fetchDriftData(); }} style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
          Reset Filters
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th></th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Question ID</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Question</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Drift</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Token Drift</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Timestamp</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {driftData.map((row) => (
            <Row key={row.question_id} driftData={row} />
          ))}
        </tbody>
      </table>

      {driftData.length === 0 && !error && (
        <p style={{ marginTop: '16px' }}>No drift data available.</p>
      )}
    </div>
  );
}

export default DriftAnalysisPage;