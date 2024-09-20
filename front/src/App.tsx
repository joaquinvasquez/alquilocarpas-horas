import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Edit from "./pages/Edit"
import Layout from "./components/Layout"

function App() {
	return (
		<>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/edit-user/:userId' element={<Edit />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</>
	)
}

export default App
