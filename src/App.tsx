import Layout from "./components/Layout"
import { createTheme, ThemeProvider } from '@mui/material'
import SolicitudForm from "./views/SolicitudForm"
import { Navigate, Route, Routes } from "react-router"
import Dashboard from "./views/Dashboard"
import Historial from "./views/Historial"

function App() {

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50'
    },
    secondary: {
      main: '#fefefe'
    }
  }
})

  return (
    <>
      <ThemeProvider theme={theme}>
        <Layout>
          <Routes>
            <Route path="/form" element={<SolicitudForm />} />
            <Route path="/history" element={<Historial />} />
            <Route path="/pending" element={<SolicitudForm />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </>
  )
}

export default App
