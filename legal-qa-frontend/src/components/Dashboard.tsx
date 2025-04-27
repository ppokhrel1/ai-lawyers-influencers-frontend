import { Tab, Tabs } from 'react-bootstrap'
import PublicAsk from './PublicAsk'
import DocumentUpload from './DocumentUpload'
import UrlAdder from './UrlAdder'
// import MonitoringPage from './Monitoring'
import DriftAnalysisPage from './DriftMonitoring'
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
        <PublicAsk />
      </Tab>
      <Tab eventKey="upload" title="Upload Documents">
        <DocumentUpload />
      </Tab>
      <Tab eventKey="url" title="Add URL">
        <UrlAdder />
      </Tab>
{/*      <Tab eventKey="metrics" title="Monitoring">
        <MonitoringPage />
      </Tab>*/}
      <Tab eventKey="drift" title="Drift">
        <DriftAnalysisPage />
      </Tab>
    </Tabs>
  )
}
