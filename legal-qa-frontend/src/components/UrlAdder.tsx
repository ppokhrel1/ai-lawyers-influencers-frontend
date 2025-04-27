import { useState } from 'react'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function UrlAdder() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const API_URL = import.meta.env.VITE_API_URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post(`${API_URL}/add_url`, { url }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setMessage(response.data.message)
      setUrl('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError('Failed to add URL')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Document URL</Form.Label>
          <Form.Control
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter document URL (PDF or webpage)"
          />
        </Form.Group>
        
        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading || !url}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Adding...
            </>
          ) : 'Add URL'}
        </Button>
      </Form>
      
      {message && <Alert variant="success" className="mt-3">{message}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  )
}
