import { useState } from 'react'
import DocumentUpload from './DocumentUpload'
import QAChat from './QAChat'
import UrlAdder from './UrlAdder'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('qa')

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="tabs mb-4">
        <button className={`tab ${activeTab === 'qa' && 'tab-active'}`} 
          onClick={() => setActiveTab('qa')}>Ask Questions</button>
        <button className={`tab ${activeTab === 'upload' && 'tab-active'}`}
          onClick={() => setActiveTab('upload')}>Upload Documents</button>
        <button className={`tab ${activeTab === 'url' && 'tab-active'}`}
          onClick={() => setActiveTab('url')}>Add URL</button>
      </div>

      {activeTab === 'qa' && <QAChat />}
      {activeTab === 'upload' && <DocumentUpload />}
      {activeTab === 'url' && <UrlAdder />}
    </div>
  )
}
