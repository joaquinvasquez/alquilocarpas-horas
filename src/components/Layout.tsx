import Header from './Header'
import SidePanel from './SidePanel'

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <SidePanel />
      {children}
    </>
  )
}

export default Layout
