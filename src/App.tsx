import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Edit from './pages/Edit'
import Update from './pages/Update'
import Layout from './components/Layout'

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit/:userId" element={<Edit />} />
            <Route path="/update/:userId" element={<Update />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default App
