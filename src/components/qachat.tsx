import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import useAuth from '../context/AuthContext'

export default function QAChat() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const API_URL = import.meta.env.VITE_API_URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/ask`, { question }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setAnswer(response.data.answer)
    } catch (error) {
      console.error('Error asking question:', error)
      setAnswer('Error getting answer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="textarea textarea-bordered w-full mb-2"
          placeholder="Ask a legal question..."
          rows={3}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Asking...' : 'Ask Question'}
        </button>
      </form>
      
      {answer && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <ReactMarkdown className="prose">{answer}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
