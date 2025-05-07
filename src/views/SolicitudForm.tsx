import {
  Grid,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  MenuItem,
  IconButton,
  FormGroup,
} from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";
import { generatePdf } from "../utils/generatePdf";
import dayjs from "dayjs";
import { SolicitudInformacion, TipoSujeto } from '../api/types'
import { createInformationRequest, uploadInfoRequestDoc } from "../api/informationRequest";

const mockInvestigadores = [
  "Sargento Perez",
  "Tte. Rodriguez",
  "Cap. Mamani",
];

const mockDelitos = ["Hurto", "Robo agravado", "Estafa", "Homicidio"];

export default function InfoRequestForm() {

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SolicitudInformacion>({
    defaultValues: {
      sistemas: {
        segip: false,
        sinarap: false,
        itv: false,
        impuestos: false,
      },
      sujetos: [
        {
          tipo: TipoSujeto.PERSONA,
          nombres: "",
          apellido_paterno: "",
          apellido_materno: "",
          ci: "",
          fecha_nacimiento: null,
          placa: "",
        },
      ],
      numero_caso_unidad: "",
      delito: "", 
      investigador: "",
      unidad_investigativa: "test"
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sujetos",
  });

  const servicioFields = ["segip", "sinarap", "itv", "impuestos"] as const;

  const sistemas = watch("sistemas");

  const onSubmit = async (data: SolicitudInformacion) => {
    console.log("Form data submitted:", data);
    const pdf = generatePdf(data);
    setPdfBlob(pdf);

    const response = await createInformationRequest(data);
    const solicitud_id = response.solicitud_informacion_id;
    console.log('response', response)

    const pdfUrl = URL.createObjectURL(pdf);
    const win = window.open(pdfUrl, "_blank");
    if (win) {
      win.opener = null;
      win.document.title = "Vista previa de PDF";
    }

    const formData = new FormData()
    formData.append("solicitud_id", String(solicitud_id))
    formData.append("tipo", 'solicitud')
    formData.append("file", new File([pdfBlob!], "solicitud.pdf", { type: "application/pdf" }));

    console.log(await uploadInfoRequestDoc(formData))

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
  };

  const canAddMore = fields.length < 12;

  return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Se solicita al Sr. Jefe del CENTRO DE FUSION DE INFORMACION DE LA FELCC la información de:
        </Typography>
        <Grid container spacing={2}>
          {servicioFields.map((field) => (
            <Grid size={{ xs: 6, md: 3 }} key={field}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...register(`sistemas.${field}` as const, {
                      validate: () => {
                        const atLeastOne = Object.values(sistemas).some(Boolean);
                        return atLeastOne || "Seleccione al menos una opción";
                      },
                    })}
                  />
                }
                label={`Incluir ${field.toUpperCase()}`}
              />
            </Grid>
          ))}
        </Grid>
        {errors.sistemas?.root && (
          <Typography color="error">{errors.sistemas.root.message}</Typography>
        )}

        <Typography variant="h6" mt={4} gutterBottom>
          De las siguientes personas o placa:
        </Typography>

        {fields.map((field, index) => {
          const tipo = watch(`sujetos.${index}.tipo`);
          return (
            <Box key={field.id} sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
              <FormGroup row sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tipo === "persona"}
                      onChange={() => setValue(`sujetos.${index}.tipo`, TipoSujeto.PERSONA)}
                    />
                  }
                  label="Persona"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tipo === "vehiculo"}
                      onChange={() => setValue(`sujetos.${index}.tipo`, TipoSujeto.VEHICULO)}
                    />
                  }
                  label="Vehículo"
                />
                {index > 0 && (
                  <IconButton onClick={() => remove(index)}>
                    <RemoveIcon />
                  </IconButton>
                )}
              </FormGroup>

              {tipo === "persona" ? (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Nombres"
                      {...register(`sujetos.${index}.nombres`, { required: true })}
                      error={!!errors?.sujetos?.[index]?.nombres}
                      helperText={errors?.sujetos?.[index]?.nombres && "Requerido"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Apellido Paterno"
                      {...register(`sujetos.${index}.apellido_paterno`, { required: true })}
                      error={!!errors?.sujetos?.[index]?.apellido_paterno}
                      helperText={errors?.sujetos?.[index]?.apellido_paterno && "Requerido"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Apellido Materno"
                      {...register(`sujetos.${index}.apellido_materno`)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="C.I."
                      {...register(`sujetos.${index}.ci`, { required: true })}
                      error={!!errors?.sujetos?.[index]?.ci}
                      helperText={errors?.sujetos?.[index]?.ci && "Requerido"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Controller
                      name={`sujetos.${index}.fecha_nacimiento`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="F/N"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => {
                              const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null
                              field.onChange(formattedDate)
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                </Grid>
              ) : (
                <TextField
                  fullWidth
                  label="Placa"
                  sx={{ mt: 2 }}
                  {...register(`sujetos.${index}.placa`, { required: true })}
                  error={!!errors?.sujetos?.[index]?.placa}
                  helperText={errors?.sujetos?.[index]?.placa && "Requerido"}
                />
              )}
            </Box>
          );
        })}

        {canAddMore && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() =>
              append({
                tipo: TipoSujeto.PERSONA,
                nombres: "",
                apellido_paterno: "",
                apellido_materno: "",
                ci: "",
                complemento: "",
                fecha_nacimiento: null,
                placa: "",
              })
            }
            sx={{ mb: 4 }}
          >
            Agregar
          </Button>
        )}

        <Typography>
          Los mismos que servirán para proseguir con las investigaciones en el caso N°
        </Typography>

        <TextField
          fullWidth
          label="Número de Caso de la Unidad"
          {...register("numero_caso_unidad", { required: true })}
          error={!!errors?.numero_caso_unidad}
          helperText={errors?.numero_caso_unidad && "Requerido"}
          sx={{ mt: 2, mb: 2 }}
        />

        <Typography>
          Por el delito de
        </Typography>

        <TextField
          select
          fullWidth
          label="Delito"
          {...register("delito", { required: true })}
          error={!!errors?.delito}
          helperText={errors?.delito && "Requerido"}
          sx={{ mt: 1, mb: 2 }}
          value={watch("delito") || ""}
        >
          {mockDelitos.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>

        <Typography>
          a cargo del Sr.(a)
        </Typography>

        <TextField
          select
          fullWidth
          label="Investigador"
          {...register("investigador", { required: true })}
          error={!!errors?.investigador}
          helperText={errors?.investigador && "Requerido"}
          sx={{ mt: 1, mb: 3 }}
          value={watch("investigador") || ""}
        >
          {mockInvestigadores.map((inv) => (
            <MenuItem key={inv} value={inv}>
              {inv}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" type="submit">
          Generar Vista Previa PDF
        </Button>
      </Box>
  );
}
