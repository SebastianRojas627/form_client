import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloseIcon from "@mui/icons-material/Close";
import { getResultadosSolicitudCompleta, getSolicitudes } from "../api/informationRequest";
import { SolicitudInformacion } from "../api/types";
import SolicitudDetail from "../components/SolicitudDetail";
import { useNavigate } from "react-router";

const RequestHistory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [responseRows, setResponseRows] = useState<SolicitudInformacion[]>([]);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState<string | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogCaso, setDialogCaso] = useState(0)
  const navigate = useNavigate();

  const handleOpenDetail = (id: string) => {
    setSelectedSolicitudId(id);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedSolicitudId(null);
  };

  const fetchSolicitudes = async (
    newPage: number = page,
    newRowsPerPage: number = rowsPerPage
  ) => {
    const offset: number = newPage * newRowsPerPage;
    const limit: number = newRowsPerPage;

    try {
      const response = await getSolicitudes(offset, limit);
      setTotal(response.total);
      setResponseRows(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleChangePage = async (_: any, newPage: number) => {
    setPage(newPage);
    await fetchSolicitudes(newPage);
  };

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRows = parseInt(event.target.value, 10);
    setRowsPerPage(newRows);
    setPage(0);
    await fetchSolicitudes(0, newRows);
  };

  const handleGetResults = async () => {
    setConfirmOpen(true);
    const data = await getResultadosSolicitudCompleta(dialogCaso)
    const { solicitud_informacion_id, ...results} = data;
    navigate(`/results/${solicitud_informacion_id}`, { state: { results } });
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setDialogCaso(0)
  };

  const handleVerResultados = (numero_caso: number) => {
    setConfirmOpen(true)
    setDialogCaso(numero_caso)
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Historial de Solicitudes de Información
      </Typography>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Numero de Caso</TableCell>
                <TableCell>Completado Por</TableCell>
                <TableCell>Delito</TableCell>
                <TableCell>Numero de Copias</TableCell>
                <TableCell>Fecha Solicitud</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responseRows.map((row) => (
                <TableRow key={row.solicitud_informacion_id}>
                  <TableCell>{row.numero_caso}</TableCell>
                  <TableCell>{row.analista_cfi}</TableCell>
                  <TableCell>{row.delito}</TableCell>
                  <TableCell>{row.numero_copias}</TableCell>
                  <TableCell>{new Date(row.fecha_solicitud).toISOString().split('T')[0]}</TableCell>
                  <TableCell>
                    {row.completado ? "Completado" : "Pendiente"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      title="Ver Solicitud"
                      onClick={() =>
                        handleOpenDetail(row.solicitud_informacion_id)
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {row.completado && (
                      <IconButton
                        title="Ver Resultados"
                        onClick={() => handleVerResultados(row.numero_caso)}
                      >
                        <AssignmentIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage="Filas por página"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog
          open={detailOpen}
          onClose={handleCloseDetail}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Detalles de Solicitud
            <IconButton
              onClick={handleCloseDetail}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedSolicitudId && (
              <SolicitudDetail solicitudId={selectedSolicitudId} />
            )}
          </DialogContent>
        </Dialog>
      </Paper>
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Confirmar búsqueda</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea ver los resultados del caso #{dialogCaso}
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleGetResults} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestHistory;
