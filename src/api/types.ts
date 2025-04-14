export interface CreateInformationRequestDto {
    "numero__caso": number,
    "nombres": string,
    "apellido_paterno": string,
    "apellido_materno": string,
    "ci": string,
    "complemento": string,
    "fecha_nacimiento": Date,
    "placa": string,
    "delito": string,
    "investigador": string,
    "tipo": string,
    "fecha_solicitud": Date,
    "segip": boolean,
    "sinarap": boolean,
    "itv": boolean,
    "impuestos": boolean,
    "completado": boolean
}