import { Tab, Tabs } from 'react-bootstrap'
import QAChat from './QAChat'
import DocumentUpload from './DocumentUpload'
import UrlAdder from './UrlAdder'

export default function Dashboard() {
  return (
    <Tabs defaultActiveKey="qa" className="mb-3">
      <Tab eventKey="qa" title="Ask Questions">
        <QAChat />
      </Tab>
      <Tab eventKey="upload" title="Upload Documents">
        <DocumentUpload />
      </Tab>
      <Tab eventKey="url" title="Add URL">
        <UrlAdder />
      </Tab>
    </Tabs>
  )
}
