import type { FC, ReactNode } from "react"
import Header from "./Header"
import SidePanel from "./SidePanel"

interface Props {
	children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
	return (
		<>
			<Header />
			<SidePanel />
			<main>{children}</main>
		</>
	)
}

export default Layout
