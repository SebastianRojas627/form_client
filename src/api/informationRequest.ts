import apiClient from "./apiClient";
import {
  CalendarioCount,
  ConteoSolicitudes,
  GenerateReport,
  RespuestaReporte,
  ResultadosSolicitudCompleta,
  SolicitudInformacion,
  TableRequest,
} from "./types";

export const getSolicitudes = async (offset: number, limit: number) => {
  const response = await apiClient.get("/solicitud-informacion", {
    params: { limit, offset },
  });
  return response.data;
};

export const getGeneratedReport = async (
  generateReportRequest: GenerateReport
) => {
  const response = await apiClient.post(
    "/doc-logs",
    generateReportRequest,
    {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob",
      timeout: 5000000,
    }
  );
  return response.data;
};

export const createInformationRequest = async (
  solicitudInformacion: SolicitudInformacion
) => {
  const response = await apiClient.post(
    "/solicitud-informacion",
    solicitudInformacion
  );
  return response.data;
};

export const getSolicitudesCount = async () => {
  const response = await apiClient.get<ConteoSolicitudes>(
    "/solicitud-informacion/count"
  );
  return response.data;
};

export const ultimasSolicitues = async () => {
  const response = await apiClient.get<SolicitudInformacion[]>(
    "/solicitud-informacion/last"
  );
  return response.data;
};

export const getCalendarCount = async (periodo: "week" | "month" | "year") => {
  const response = await apiClient.get<CalendarioCount[]>(
    `/solicitud-informacion/calendar/${periodo}`
  );
  return response.data;
};

export const getSolicitudById = async (id: string) => {
  const response = await apiClient.get(`/solicitud-informacion/${id}`);
  return response.data;
};

export const getReportes = async (query: TableRequest) => {
  const response = await apiClient.post<RespuestaReporte>(
    "/doc-logs/logs",
    query
  );
  return response.data;
};

export const getReportesSolicitud = async (offset: number, limit: number) => {
  const response = await apiClient.get("/solicitud-informacion", {
    params: { limit, offset },
  });
  return response.data;
};

export const getResultadosSolicitudCompleta = async (numero_caso: number) => {
  const response = await apiClient.get<ResultadosSolicitudCompleta>(
    `/respuestas/${numero_caso}`
  );
  return response.data;
};
