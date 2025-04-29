import apiClient, { pdfClient } from "./apiClient"
import { SolicitudInformacion } from "./types"

export const createInformationRequest = async (solicitudInformacion: SolicitudInformacion) => {
    const response = await apiClient.post("/solicitud-informacion", solicitudInformacion);
    return response.data;
}

export const uploadInfoRequestDoc = async (pdfUpload: FormData) => {
    const response = await pdfClient.post("/files/upload", pdfUpload);
    return response.data;
}