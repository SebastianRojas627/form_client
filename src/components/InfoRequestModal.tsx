import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface SolicitudInformacion {
  solicitud_informacion_id: string | null;
  numero__caso: number | null;
  nombres: string | null;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  ci: string | null;
  complemento: string | null;
  fecha_nacimiento: string | null;
  placa: string | null;
  delito: string | null;
  investigador: string | null;
  unidad_investigativa: string | null;
  tipo: string | null;
  numero_caso_unidad: string | null;
  fecha_solicitud: string | null;
  segip: boolean | null;
  sinarap: boolean | null;
  itv: boolean | null;
  impuestos: boolean | null;
  completado: boolean | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  request: SolicitudInformacion | null;
}

const InfoRequestModal: React.FC<Props> = ({ open, onClose, request }) => {
  if (!request) return null;

  const fullName = `${request.nombres} ${request.apellido_paterno ?? ""} ${
    request.apellido_materno ?? ""
  }`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Detalles de la Solicitud
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 3 }}>
            <Typography>
              <strong>SEGIP:</strong> {request.segip ? "Sí" : "No"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Typography>
              <strong>SINARAP:</strong> {request.sinarap ? "Sí" : "No"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Typography>
              <strong>ITV:</strong> {request.itv ? "Sí" : "No"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Typography>
              <strong>Impuestos:</strong> {request.impuestos ? "Sí" : "No"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Nombre Completo:</strong> {fullName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Typography>
              <strong>CI:</strong> {request.ci}
            </Typography>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Typography>
              <strong>Complemento:</strong> {request.complemento ?? "-"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Typography>
              <strong>Fecha de Nacimiento:</strong> {request.fecha_nacimiento}
            </Typography>
          </Grid>

          <Grid size={{ xs: 3 }}>
            <Typography>
              <strong>Placa:</strong> {request.placa}
            </Typography>
          </Grid>

          <Grid size={{ xs: 3 }}>
            <Typography>
              <strong>Tipo:</strong> {request.tipo}
            </Typography>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Typography>
              <strong>Nº Caso:</strong> {request.numero__caso}
            </Typography>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Typography>
              <strong>Caso Unidad:</strong> {request.numero_caso_unidad}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Delito:</strong> {request.delito}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Fecha Solicitud:</strong> {request.fecha_solicitud}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Investigador:</strong> {request.investigador}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Unidad Investigativa:</strong>{" "}
              {request.unidad_investigativa}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default InfoRequestModal;
