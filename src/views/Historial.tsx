import React, { useState } from "react";
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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InfoRequestModal, {
  SolicitudInformacion,
} from "../components/InfoRequestModal";

const mockData = Array.from({ length: 35 }, (_, i) => ({
  solicitud_informacion_id: `uuid-${i + 1}`,
  numero__caso: 1000 + i,
  nombres: `Nombre${i}`,
  apellido_paterno: `ApellidoP${i}`,
  apellido_materno: `ApellidoM${i}`,
  ci: `123456${i}`,
  complemento: null,
  fecha_nacimiento: "1990-01-01",
  placa: `XYZ-${i}`,
  delito: "Robo",
  investigador: `Invest ${i}`,
  unidad_investigativa: `Unidad ${i % 3}`,
  tipo: i % 2 === 0 ? "Persona" : "Vehículo",
  numero_caso_unidad: `UC-${i}`,
  fecha_solicitud: "2025-04-10",
  segip: true,
  sinarap: false,
  itv: true,
  impuestos: false,
  completado: i % 3 === 0,
}));

const RequestHistory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] =
    useState<SolicitudInformacion | null>(null);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = mockData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
                <TableCell>Nombre Completo</TableCell>
                <TableCell>CI</TableCell>
                <TableCell>Placa</TableCell>
                <TableCell>Delito</TableCell>
                <TableCell>Investigador</TableCell>
                <TableCell>Fecha Solicitud</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow key={row.solicitud_informacion_id}>
                  <TableCell>{`${row.nombres} ${row.apellido_paterno} ${row.apellido_materno}`}</TableCell>
                  <TableCell>{row.ci}</TableCell>
                  <TableCell>{row.placa}</TableCell>
                  <TableCell>{row.delito}</TableCell>
                  <TableCell>{row.investigador}</TableCell>
                  <TableCell>{row.fecha_solicitud}</TableCell>
                  <TableCell>
                    {row.completado ? "Completado" : "Pendiente"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      title="Ver Solicitud"
                      onClick={() => setSelectedRequest(row)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <InfoRequestModal
                      open={!!selectedRequest}
                      onClose={() => setSelectedRequest(null)}
                      request={selectedRequest}
                    />
                    <IconButton
                      title="Ver Documento"
                      onClick={() =>
                        console.log(
                          "Ver Documento",
                          row.solicitud_informacion_id
                        )
                      }
                    >
                      <DescriptionIcon />
                    </IconButton>
                    {row.completado && (
                      <IconButton
                        title="Ver Informe"
                        onClick={() =>
                          console.log(
                            "Ver Informe",
                            row.solicitud_informacion_id
                          )
                        }
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
          count={mockData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage="Filas por página"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default RequestHistory;
