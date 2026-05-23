import Domain1Page from './domain1'
import Domain2Page from './domain2'
import Domain3Page from './domain3'
import Domain4Page from './domain4'
import Domain5Page from './domain5'
import Domain6Page from './domain6'

interface DomainPageProps {
  domainId: number
}

export default function DomainPage({ domainId }: DomainPageProps) {
  switch (domainId) {
    case 1:
      return <Domain1Page />
    case 2:
      return <Domain2Page />
    case 3:
      return <Domain3Page />
    case 4:
      return <Domain4Page />
    case 5:
      return <Domain5Page />
    case 6:
      return <Domain6Page />
    default:
      return (
        <div className="flex items-center justify-center min-h-[calc(100dvh-60px)]">
          <p style={{ color: 'var(--text-secondary)' }}>Domain not found.</p>
        </div>
      )
  }
}
