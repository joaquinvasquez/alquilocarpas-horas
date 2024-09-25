import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Edit from "./pages/Edit"
import Layout from "./components/Layout"
import View from "./pages/View"

function App() {
	return (
		<>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/view/:userId' element={<View />} />
						<Route path='/edit/:userId' element={<Edit />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</>
	)
}

export default App

//.TODO:
// restringir acceso a rutas sólo desde esp8266 y app
// firebase auth
// reglas de seguridad firebase
