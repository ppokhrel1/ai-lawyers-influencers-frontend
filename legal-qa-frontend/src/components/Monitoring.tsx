import { useState, useEffect } from 'react'
import { Card, Button, Spinner, Alert, Table, Container, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface DailyMetrics {
  [date: string]: {
    count: number
    avg_response_time: number | null
  }
}

interface MonthlyMetrics {
  [week: string]: {
    count: number
    avg_response_time: number | null
  }
}

export default function MonitoringPage() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const token = localStorage.getItem('token')

  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics | null>(null)
  const [monthlyMetrics, setMonthlyMetrics] = useState<MonthlyMetrics | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {}

      const [dRes, mRes] = await Promise.all([
        axios.get(`${API_URL}/monitoring/daily_metrics`, { headers }),
        axios.get(`${API_URL}/monitoring/weekly_metrics`, { headers }),
      ])

      setDailyMetrics(dRes.data)
      setMonthlyMetrics(mRes.data)
    } catch (err) {
      console.error(err)
      setError('Failed to load monitoring data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getChartData = (metrics: DailyMetrics | MonthlyMetrics) => {
    const labels = Object.keys(metrics)
    const counts = labels.map((label) => metrics[label]?.count)
    const avgResponseTimes = labels.map((label) => metrics[label]?.avg_response_time)

    return {
      labels,
      datasets: [
        {
          label: 'Count',
          data: counts,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          fill: true,
        },
        {
          label: 'Avg Response Time (s)',
          data: avgResponseTimes,
          borderColor: 'rgba(255,99,132,1)',
          backgroundColor: 'rgba(255,99,132,0.2)',
          fill: false,
        },
      ],
    }
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">System Monitoring</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button onClick={fetchData} disabled={loading} className="mb-4">
        {loading
          ? <>
              <Spinner animation="border" size="sm" className="me-2" />
              Refresh
            </>
          : 'Refresh'}
      </Button>

      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Header>📅 Daily Metrics</Card.Header>
            <Card.Body>
              {!dailyMetrics ? (
                <Spinner animation="border" />
              ) : (
                <div>
                  <Line data={getChartData(dailyMetrics)} options={{ responsive: true }} />
                  <Table bordered hover size="sm" className="mt-3">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Count</th>
                        <th>Avg Response (s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(dailyMetrics).map((date) => {
                        const { count, avg_response_time } = dailyMetrics[date]
                        return (
                          <tr key={date}>
                            <td>{date}</td>
                            <td>{count}</td>
                            <td>{avg_response_time?.toFixed(3) ?? '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>📅 Monthly (Weekly) Metrics</Card.Header>
            <Card.Body>
              {!monthlyMetrics ? (
                <Spinner animation="border" />
              ) : (
                <div>
                  <Line data={getChartData(monthlyMetrics)} options={{ responsive: true }} />
                  <Table bordered hover size="sm" className="mt-3">
                    <thead>
                      <tr>
                        <th>Week</th>
                        <th>Count</th>
                        <th>Avg Response (s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(monthlyMetrics).map((week) => {
                        const { count, avg_response_time } = monthlyMetrics[week]
                        return (
                          <tr key={week}>
                            <td>{week}</td>
                            <td>{count}</td>
                            <td>{avg_response_time?.toFixed(3) ?? '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

