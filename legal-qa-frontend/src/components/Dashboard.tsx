import { Tab, Tabs } from 'react-bootstrap'
import QAChat from './QAChat'
import DocumentUpload from './DocumentUpload'
import UrlAdder from './UrlAdder'
import MonitoringPage from './Monitoring'

export default function Dashboard() {
  return (
    <Tabs
      defaultActiveKey="qa"
      id="dashboard-tabs"
      className="mb-3"
      fill       // <-- make tabs fill the width
      justify    // <-- evenly space them
    >
      <Tab eventKey="qa" title="Ask Questions">
        <QAChat />
      </Tab>
      <Tab eventKey="upload" title="Upload Documents">
        <DocumentUpload />
      </Tab>
      <Tab eventKey="url" title="Add URL">
        <UrlAdder />
      </Tab>
      <Tab eventKey="metrics" title="Monitoring">
        <MonitoringPage />
      </Tab>
    </Tabs>
  )
}
