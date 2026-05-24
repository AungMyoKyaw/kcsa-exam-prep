import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import DomainPage from './pages/DomainPage'
import PracticeExam from './pages/PracticeExam'
import CheatSheet from './pages/CheatSheet'
import Glossary from './pages/Glossary'
import QuickRecall from './pages/QuickRecall'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/domain1" element={<DomainPage domainId={1} />} />
        <Route path="/domain1/*" element={<DomainPage domainId={1} />} />
        <Route path="/domain2" element={<DomainPage domainId={2} />} />
        <Route path="/domain2/*" element={<DomainPage domainId={2} />} />
        <Route path="/domain3" element={<DomainPage domainId={3} />} />
        <Route path="/domain3/*" element={<DomainPage domainId={3} />} />
        <Route path="/domain4" element={<DomainPage domainId={4} />} />
        <Route path="/domain4/*" element={<DomainPage domainId={4} />} />
        <Route path="/domain5" element={<DomainPage domainId={5} />} />
        <Route path="/domain5/*" element={<DomainPage domainId={5} />} />
        <Route path="/domain6" element={<DomainPage domainId={6} />} />
        <Route path="/domain6/*" element={<DomainPage domainId={6} />} />
        <Route path="/practice-exam" element={<PracticeExam />} />
        <Route path="/cheat-sheet" element={<CheatSheet />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/quick-recall" element={<QuickRecall />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}
