import { useState, useEffect } from 'react';
import { Form, Button, Card, Spinner, Alert, ListGroup, Modal } from 'react-bootstrap';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function PublicAsk() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const [questionId, setQuestionId] = useState('');
  const [retrievedDocs, setRetrievedDocs] = useState([]);
  const [showRetrievalContext, setShowRetrievalContext] = useState(false);
  const [feedback, setFeedback] = useState(null); // null, true (positive), false (negative)
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [currentUser, setCurrentUser] = useState('guest'); // Default to 'guest'

  useEffect(() => {
    const userName = localStorage.getItem('username');
    if (userName) {
      // You might want to decode the token to get user information
      // or fetch user data from an API endpoint here.
      // For simplicity, we'll just consider the presence of a token as logged in.
      // A more robust solution would involve a dedicated authentication context.
      setCurrentUser(userName); // Replace with actual user info if available
    } else {
      setCurrentUser('guest');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');
    setRetrievedDocs([]);
    setFeedback(null);
    setFeedbackMessage('');

    try {
      const token = localStorage.getItem('token');
      console.log("Token:", token);
      const response = await axios.post(
        `${API_URL}/ask`,
        { question, user: currentUser }, // Send user info with the question
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token if necessary
            'Content-Type': 'application/json'
          }
        }
      );
      setAnswer(response.data.answer);
      setQuestionId(response.data.question_id);
    } catch (err) {
      setError('Failed to get answer. Please try again or log in for more features.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRetrievalContext = async () => {
    if (!questionId) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/transparency/retrieval_context/${questionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setRetrievedDocs(response.data.retrieved_documents);
      setShowRetrievalContext(true);
    } catch (err) {
      setError('Failed to fetch retrieval context.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (isPositive: boolean) => {
    if (!questionId) return;
    setFeedback(isPositive);
  };

  useEffect(() => {
    if (feedback !== null && questionId) {
      const submitFeedback = async () => {
        setSubmittingFeedback(true);
        setFeedbackMessage('');
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            `${API_URL}/feedback/submit_feedback`,
            { question_id: questionId, feedback: feedback, user: currentUser }, // Send user info with feedback
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          setFeedbackMessage('Feedback submitted. Thank you!');
        } catch (err) {
          setFeedbackMessage('Failed to submit feedback.');
          console.error(err);
        } finally {
          setSubmittingFeedback(false);
          // Optionally reset feedback state after a delay
          setTimeout(() => setFeedbackMessage(''), 3000);
        }
      };
      submitFeedback();
    }
  }, [feedback, questionId, currentUser]);

  return (
    <div>
      <h2 className="mb-4">Public Legal Question Answering ({currentUser})</h2>

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
        <Card className="mb-4">
          <Card.Header>
            Answer
            {localStorage.getItem('token') && (
              <Button variant="outline-info" size="sm" className="ms-2" onClick={fetchRetrievalContext} disabled={loading || !questionId}>
                Why did you answer that?
              </Button>
            )}
          </Card.Header>
          <Card.Body>
            <ReactMarkdown>{answer}</ReactMarkdown>
          </Card.Body>
          {localStorage.getItem('token') && (
            <Card.Footer className="d-flex justify-content-end gap-2">
              <small className="text-muted">Was this helpful?</small>
              <Button
                variant={feedback === true ? 'success' : 'outline-success'}
                size="sm"
                onClick={() => handleFeedback(true)}
                disabled={submittingFeedback}
              >
                👍
              </Button>
              <Button
                variant={feedback === false ? 'danger' : 'outline-danger'}
                size="sm"
                onClick={() => handleFeedback(false)}
                disabled={submittingFeedback}
              >
                👎
              </Button>
            </Card.Footer>
          )}
        </Card>
      )}

      <Modal show={showRetrievalContext} onHide={() => setShowRetrievalContext(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Why Did the AI Answer That?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {retrievedDocs && retrievedDocs.length > 0 ? (
            <ListGroup>
              {retrievedDocs.map((doc, index) => (
                <ListGroup.Item key={index}>
                  <p><strong>Content:</strong> <span dangerouslySetInnerHTML={{ __html: doc.content }} /></p>
                  {doc.metadata && Object.keys(doc.metadata).length > 0 && (
                    <p>
                      <strong>Metadata:</strong>
                      <ul>
                        {Object.entries(doc.metadata).map(([key, value]) => (
                          <li key={key}>
                            {key}: {value}
                          </li>
                        ))}
                      </ul>
                    </p>
                  )}
                  {doc.relevance_score !== undefined && (
                    <p><strong>Relevance Score:</strong> {(doc.relevance_score * 100).toFixed(2)}%</p>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No retrieval context available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRetrievalContext(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {feedbackMessage && (
        <Alert variant={feedback === true ? 'success' : 'danger'} className="mt-3">
          {feedbackMessage}
        </Alert>
      )}
    </div>
  );
}