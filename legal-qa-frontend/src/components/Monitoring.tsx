import { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Spinner, Alert } from 'react-bootstrap'
import axios from 'axios'
import ReactApexChart from 'react-apexcharts'

interface MetricPoint {
  date: string
  count: number
  avg_response_time: number
  median_response_time: number
  p95_response_time: number
  answer_length: number
  question_length: number
  input_tokens: number
  retrieval_k: number
}

type MetricsArray = MetricPoint[]

export default function MonitoringPage() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const token = localStorage.getItem('token')

  const [dailyMetrics, setDailyMetrics] = useState<MetricsArray>([])
  const [weeklyMetrics, setWeeklyMetrics] = useState<MetricsArray>([])
  const [otherMetrics, setOtherMetrics] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const [dRes, wRes, oRes] = await Promise.all([
        axios.get(`${API_URL}/monitoring/daily_metrics`, { headers }),
        axios.get(`${API_URL}/monitoring/weekly_metrics`, { headers }),
        axios.get(`${API_URL}/monitoring/metrics`, { headers }),
      ])

      const transformMetrics = (data: any): MetricsArray => {
        return Object.entries(data).map(([date, metrics]: [string, any]) => ({
          date,
          count: metrics.count,
          avg_response_time: metrics.avg_response_time ?? 0,
          median_response_time: metrics.median_response_time ?? 0,
          p95_response_time: metrics.p95_response_time ?? 0,
          answer_length: metrics.answer_length ?? 0,
          question_length: metrics.question_length ?? 0,
          input_tokens: metrics.input_tokens ?? 0,
          retrieval_k: metrics.retrieval_k ?? 0,
        }))
      }

      setDailyMetrics(transformMetrics(dRes.data))
      setWeeklyMetrics(transformMetrics(wRes.data))
      setOtherMetrics(oRes.data)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const renderChart = (data: MetricsArray, title: string) => {
    const labels = data.map((d) => d.date)

    const series = [
      { name: 'Count', data: data.map((d) => d.count) },
      { name: 'Avg Response (s)', data: data.map((d) => d.avg_response_time) },
      { name: 'Median Response (s)', data: data.map((d) => d.median_response_time) },
      { name: 'P95 Response (s)', data: data.map((d) => d.p95_response_time) },
      { name: 'Answer Length', data: data.map((d) => d.answer_length) },
      { name: 'Question Length', data: data.map((d) => d.question_length) },
      { name: 'Input Tokens', data: data.map((d) => d.input_tokens) },
      { name: 'Retrieval K', data: data.map((d) => d.retrieval_k) },
    ]

    const options = {
      chart: {
        id: title,
        animations: { enabled: true, easing: 'easeinout', speed: 800 },
        toolbar: { show: true, tools: { zoom: true, reset: true } },
        zoom: { enabled: true },
      },
      stroke: { curve: 'smooth' },
      xaxis: { categories: labels },
      yaxis: { decimalsInFloat: 2 },
      legend: { position: 'top' },
      tooltip: { shared: true, intersect: false },
      title: {
        text: title,
        align: 'center',
        style: { fontSize: '18px' },
      },
    }

    return (
      <ReactApexChart options={options} series={series} type="line" height={350} />
    )
  }

  const renderMetricsTable = (metricsData: Record<string, any>) => {
    const keys = Object.keys(metricsData)
    return (
      <Table bordered hover responsive size="sm">
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {keys.map((key) => (
              <td key={key}>
                {typeof metricsData[key] === 'object' && !Array.isArray(metricsData[key])
                  ? JSON.stringify(metricsData[key], null, 2)
                  : typeof metricsData[key] === 'number'
                  ? metricsData[key].toFixed(3)
                  : String(metricsData[key])}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">📈 System Monitoring</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row className="g-4">
            <Col md={6}>
              {renderChart(dailyMetrics, 'Daily Metrics')}
            </Col>
            <Col md={6}>
              {renderChart(weeklyMetrics, 'Weekly Metrics')}
            </Col>
          </Row>

          <Row className="mt-5">
            <Col>
              <h5 className="mb-3">📋 Other Metrics</h5>
              {renderMetricsTable(otherMetrics)}
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

