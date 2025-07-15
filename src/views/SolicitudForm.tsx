import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Dialog,
} from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { SolicitudInformacion, TipoSujeto } from "../api/types";
import { SujetoForm } from "../components/SujetoForm";
import { ServicioSelector } from "../components/ServiciosSelector";
import { ConfirmationSummary } from "../components/ConfirmationSummary";
import { getSelectedServiceTypes } from "../utils/serviceUtils";
import { useNavigate } from "react-router-dom";
import { createInformationRequest } from "../api/informationRequest";
import { useAuth } from "../hooks/useAuth";

const mockDelitos = ["Hurto", "Robo agravado", "Estafa", "Homicidio"];

export default function InfoRequestForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  const navigate = useNavigate();

  const {
    control,
    register,
    watch,
    setError,
    clearErrors,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SolicitudInformacion>({
    mode: "onSubmit",
    defaultValues: {
      delito: "",
      investigador: user ? user.fullName : 'Investigador Prueba',
      unidad_investigativa: user ? user.organismoFullName : 'Unidad investigador',
      numero_caso_unidad: "",
      consulta_libre: false,
      sistemas: {
        segip: false,
        sinarap: false,
        itv: false,
        // anh: false,
      },
      sujetos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sujetos",
  });

  const sistemas = watch("sistemas") ?? {};
  const { personaEnabled, vehiculoEnabled, anhSelected } =
    getSelectedServiceTypes(sistemas);

  const steps = [
    "Seleccionar servicios",
    "Ingresar sujetos",
    "Información del caso",
    "Confirmación",
  ];

  const handleAddSujeto = () => {
    const defaultTipo = personaEnabled
      ? TipoSujeto.PERSONA
      : vehiculoEnabled
      ? TipoSujeto.VEHICULO
      : TipoSujeto.PERSONA;

    append({
      tipo: defaultTipo,
      ci: null,
      complemento: null,
      placa: null,
      // carguio_combustible: false,
      // fechaini: null,
      // fechafin: null,
    });
  };

  const handleNext = async () => {
    let valid = false;

    if (activeStep === 0) {
      const atLeastOne = Object.values(watch("sistemas") || {}).some(Boolean);
      if (!atLeastOne) {
        setError("sistemas", {
          type: "manual",
          message: "Seleccione al menos un servicio.",
        });
        return;
      } else {
        clearErrors("sistemas");
        valid = true;
        handleAddSujeto();
      }
    } else if (activeStep === 1) {
      valid = await trigger("sujetos");
    } else if (activeStep === 2) {
      valid = await trigger(["numero_caso_unidad", "delito"]);
    } else {
      valid = true;
    }

    if (!valid) return;

    if (activeStep === steps.length - 1) {
      setOpenConfirmDialog(true);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 1) setValue("sujetos", []);
    setActiveStep((prev) => prev - 1);
  };

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    setOpenConfirmDialog(false);

    const valid = await trigger();
    if (!valid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const data = watch();
      console.log(data);
      await createInformationRequest(data);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/history");
      }, 2000);
    } catch (error) {
      console.error("Error al enviar los datos", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      {!submitted && (
        <>
          <Box sx={{ pt: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box sx={{ mt: 4 }}>
            {activeStep === 0 && (
              <ServicioSelector
                register={register}
                watch={watch}
                errors={errors}
                setValue={setValue}
              />
            )}

            {activeStep === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  De las siguientes personas o placa:
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Los campos marcados con * son obligatorios
                </Typography>

                {fields.map((field, index) => (
                  <SujetoForm
                    key={field.id}
                    index={index}
                    field={field}
                    remove={remove}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    personaEnabled={personaEnabled}
                    vehiculoEnabled={vehiculoEnabled}
                    anhSelected={anhSelected}
                  />
                ))}

                {fields.length < 12 && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddSujeto}
                    sx={{ mt: 2 }}
                  >
                    Agregar
                  </Button>
                )}
              </>
            )}

            {activeStep === 2 && (
              <>
                <Typography>
                  Los mismos que servirán para proseguir con las investigaciones
                  en el caso N°
                </Typography>

                <TextField
                  fullWidth
                  label="Número de Caso de la Unidad"
                  {...register("numero_caso_unidad", {
                    required: true,
                  })}
                  error={!!errors?.numero_caso_unidad}
                  helperText={
                    errors?.numero_caso_unidad ? "Requerido" : ""
                  }
                  sx={{ mt: 2, mb: 2 }}
                />

                <Typography>Por el delito de</Typography>

                <TextField
                  select
                  fullWidth
                  label="Delito"
                  {...register("delito", { required: true })}
                  error={!!errors?.delito}
                  helperText={errors?.delito ? "Requerido" : ""}
                  sx={{ mt: 2, mb: 2 }}
                  value={watch("delito") || ""}
                >
                  {mockDelitos.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}

            {activeStep === 3 && <ConfirmationSummary data={watch()} />}

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Atrás
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={handleNext}
                variant="contained"
                type="button"
                disabled={isSubmitting}
              >
                {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </Box>
          </Box>
        </>
      )}

      {submitted && (
        <Box sx={{ mt: 10, textAlign: "center" }}>
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            stroke="green"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Información enviada exitosamente
          </Typography>
        </Box>
      )}

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            ¿Está seguro que desea enviar esta información?
          </Typography>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpenConfirmDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="contained" onClick={confirmSubmission}>
              Confirmar
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
}
