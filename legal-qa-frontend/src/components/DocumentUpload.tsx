import { useState } from 'react'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function DocumentUpload() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')
    
    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }

      const response = await axios.post(`${API_URL}/upload_documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })

      setMessage(response.data.message)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError('Failed to upload documents')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <Form onSubmit={handleUpload}>
        <Form.Group className="mb-3">
          <Form.Label>Upload Documents (PDF or Images)</Form.Label>
          <Form.Control 
            type="file" 
            multiple 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles(e.target.files)}
          />
        </Form.Group>
        
        <Button 
          variant="success" 
          type="submit" 
          disabled={uploading || !files}
        >
          {uploading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Uploading...
            </>
          ) : 'Upload Documents'}
        </Button>
      </Form>
      
      {message && <Alert variant="success" className="mt-3">{message}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  )
}
