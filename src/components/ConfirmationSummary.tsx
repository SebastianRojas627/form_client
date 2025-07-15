import { Box, Typography } from "@mui/material";
import { SolicitudInformacion, TipoSujeto } from "../api/types";

type Props = {
  data: SolicitudInformacion;
};

export function ConfirmationSummary({ data }: Props) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Confirmación
      </Typography>
      <Typography>
        Por favor revise todos los datos antes de generar el reporte.
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Servicios seleccionados:</Typography>
        <ul>
          {Object.entries(data.sistemas).map(
            ([servicio, activo]) =>
              activo && <li key={servicio}>{servicio.toUpperCase()}</li>
          )}
        </ul>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Sujetos:</Typography>
        {data.sujetos.map((sujeto, index) => (
          <Box
            key={index}
            sx={{ mb: 1, p: 1, border: "1px solid #ccc", borderRadius: 1 }}
          >
            <Typography variant="body2">
              <strong>Tipo:</strong> {sujeto.tipo}
            </Typography>
            {sujeto.tipo === TipoSujeto.PERSONA ? (
              <>
                <Typography variant="body2">
                  <strong>CI:</strong> {sujeto.ci}
                </Typography>
                <Typography variant="body2">
                  <strong>Complemento:</strong> {sujeto.complemento}
                </Typography>
              </>
            ) : (
              <Typography variant="body2">
                <strong>Placa:</strong> {sujeto.placa}
              </Typography>
            )}
            {/*sujeto.carguio_combustible && (
              <Typography variant="body2">
                <strong>Con historial de carga de combustible</strong>
              </Typography>
            )*/}
            {/*(sujeto.fechaini || sujeto.fechafin) && (
              <Typography variant="body2">
                <strong>Rango de fechas:</strong>{" "}
                {String(sujeto.fechaini) ?? "-"} hasta{" "}
                {String(sujeto.fechafin) ?? "-"}
              </Typography>
            )*/}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Datos del caso:</Typography>
        <Typography variant="body2">
          <strong>N° de caso:</strong> {data.numero_caso_unidad}
        </Typography>
        <Typography variant="body2">
          <strong>Delito:</strong> {data.delito}
        </Typography>
        <Typography variant="body2">
          <strong>Investigador:</strong> {data.investigador}
        </Typography>
        <Typography variant="body2">
          <strong>Unidad:</strong> {data.unidad_investigativa}
        </Typography>
      </Box>
    </>
  );
}
