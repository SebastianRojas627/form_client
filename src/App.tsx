import Layout from "./components/Layout";
import { createTheme, ThemeProvider } from "@mui/material";
import SolicitudForm from "./views/SolicitudForm";
import { Navigate, Route, Routes } from "react-router";
import Dashboard from "./views/Dashboard";
import Historial from "./views/Historial";
import LoadingRedirect from "./components/LoadingRedirect";
import { Urls } from "./utils/routes";
import { UserConfigView } from "./components/UserConfigView";
import DocumentReport from "./views/DocumentReport";
import ResultsPage from "./components/ResultsPage";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    },
    palette: {
      mode: "light",
      primary: {
        main: "#1B5E20",
        light: "#4CAF50",
        dark: "#003300",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#B71C1C",
        light: "#FF8A80",
        contrastText: "#ffffff",
      },
      info: {
        main: "#0288D1",
      },
      success: {
        main: "#388E3C",
      },
      warning: {
        main: "#F9A825",
      },
      background: {
        default: "#F4F6F3",
        paper: "#ffffff",
      },
      text: {
        primary: "#1B1B1B",
        secondary: "#555555",
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <Layout>
          <Routes>
            <Route path="/auth/initialize" element={<LoadingRedirect />} />
            <Route path={Urls.NUEVA} element={<SolicitudForm />} />
            <Route path={Urls.HISTORY} element={<Historial />} />
            <Route path={Urls.REPORTS} element={<DocumentReport />} />
            <Route path={Urls.HOME} element={<Dashboard />} />
            <Route path={Urls.SETTINGS} element={<UserConfigView />} />
            <Route
              path={Urls.RESULTS + "/:solicitudId"}
              element={<ResultsPage />}
            />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default App;
