import Layout from "./components/Layout"
import { createTheme, ThemeProvider } from '@mui/material'
import SolicitudForm from "./views/SolicitudForm"
import { Route, Routes } from "react-router"
import Dashboard from "./views/Dashboard"

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
            <Route path="/solicitudes" element={<SolicitudForm />} />
            <Route path="/pendientes" element={<SolicitudForm />} />
            <Route path="/home" element={<Dashboard />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </>
  )
}

export default App
