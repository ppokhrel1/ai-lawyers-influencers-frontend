import { useState } from 'react'
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

export default function PublicAsk() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const API_URL = import.meta.env.VITE_API_URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post(`${API_URL}/ask`, { question })
      setAnswer(response.data.answer)
    } catch (err) {
      setError('Failed to get answer. Please try again or log in for more features.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mb-4">Public Legal Question Answering</h2>
      
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Your Legal Question</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a legal question..."
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Processing...
            </>
          ) : 'Ask Question'}
        </Button>
      </Form>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {answer && (
        <Card>
          <Card.Header>Answer</Card.Header>
          <Card.Body>
            <ReactMarkdown>{answer}</ReactMarkdown>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
