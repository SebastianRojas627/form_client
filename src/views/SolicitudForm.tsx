import {
  Container,
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

function jsonToFormData(json: any, formData = new FormData(), parentKey = "") {
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof Date) {
        formData.append(fullKey, value.toISOString());
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // Recurse for nested objects
        jsonToFormData(value, formData, fullKey);
      } else if (Array.isArray(value)) {
        // Append arrays with indexes
        value.forEach((item, index) => {
          jsonToFormData(item, formData, `${fullKey}[${index}]`);
        });
      } else {
        formData.append(fullKey, value);
      }
    }
  }
  return formData;
}

const mockInvestigadores = [
  "Sargento Perez",
  "Tte. Rodriguez",
  "Cap. Mamani",
];

const mockDelitos = ["Hurto", "Robo agravado", "Estafa", "Homicidio"];

export default function InfoRequestForm() {

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [formValues, setFormValues] = useState<any>(null);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      servicios: {
        segip: false,
        sinarap: false,
        itv: false,
        impuestos: false,
      },
      sujetos: [
        {
          tipo: "persona",
          nombres: "",
          apellido_paterno: "",
          apellido_materno: "",
          ci: "",
          fecha_nacimiento: null,
          placa: "",
        },
      ],
      caso_unidad: "",
      delito: "", 
      investigador: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sujetos",
  });

  const servicioFields = ["segip", "sinarap", "itv", "impuestos"] as const;
  type ServicioField = typeof servicioFields[number];

  const servicios = watch("servicios");
  const sujetos = watch("sujetos");

  const onSubmit = (data: any) => {
    console.log("Form data submitted:", data);
    const pdf = generatePdf(data);
    setPdfBlob(pdf);
    setFormValues(data);
    setShowConfirmButtons(true);

    const pdfUrl = URL.createObjectURL(pdf);
    const win = window.open(pdfUrl, "_blank");
    if (win) {
      win.opener = null;
      win.document.title = "Vista previa de PDF";
    }
  };

  const confirmSubmission = async () => {
    if (!formValues || !pdfBlob) return;

    const formData = jsonToFormData(formValues);
    formData.append("pdf", new File([pdfBlob], "solicitud.pdf", { type: "application/pdf" }));

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    setShowConfirmButtons(false);
  };

  const cancelSubmission = () => {
    setPdfBlob(null);
    setFormValues(null);
    setShowConfirmButtons(false);
  };

  const canAddMore = fields.length < 12;

  return (
    <Container>
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
                    {...register(`servicios.${field}` as const, {
                      validate: (value) => {
                        const atLeastOne = Object.values(servicios).some(Boolean);
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
        {errors.servicios?.root && (
          <Typography color="error">{errors.servicios.root.message}</Typography>
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
                      onChange={() => setValue(`sujetos.${index}.tipo`, "persona")}
                    />
                  }
                  label="Persona"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tipo === "vehiculo"}
                      onChange={() => setValue(`sujetos.${index}.tipo`, "vehiculo")}
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
                tipo: "persona",
                nombres: "",
                apellido_paterno: "",
                apellido_materno: "",
                ci: "",
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
          {...register("caso_unidad", { required: true })}
          error={!!errors?.caso_unidad}
          helperText={errors?.caso_unidad && "Requerido"}
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

      {showConfirmButtons && (
        <div style={{ marginTop: 16 }}>
          <button onClick={confirmSubmission} style={{ marginRight: 8 }}>Confirmar y Enviar</button>
          <button onClick={cancelSubmission}>Cancelar</button>
        </div>
      )}
      </Box>
    </Container>
  );
}
