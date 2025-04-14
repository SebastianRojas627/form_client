import apiClient from "./apiClient"
import { CreateInformationRequestDto } from "./types"

export const createInformationRequest = async (createInformationRequestDto: CreateInformationRequestDto) => {
    const response = await apiClient.post("/solicitud-informacion", createInformationRequestDto);
    return response.data;
}