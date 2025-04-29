import { Dayjs } from "dayjs";

export interface SolicitudFormData {
  numero_caso: number;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  ci?: string;
  complemento?: string;
  fecha_nacimiento?: Dayjs | null;
  placa?: string;
  delito?: string;
  investigador?: string;
  tipo?: string;
  fecha_solicitud?: Dayjs | null;
  segip?: boolean;
  sinarap?: boolean;
  itv?: boolean;
  impuestos?: boolean;
  completado?: boolean;
}