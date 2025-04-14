import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SolicitudFormData } from '../interfaces/api_interfaces';

const SolicitudForm: React.FC = () => {
  const [formData, setFormData] = useState<SolicitudFormData>({
    numero__caso: 0,
    fecha_nacimiento: null,
    fecha_solicitud: dayjs(),
    segip: false,
    sinarap: false,
    itv: false,
    impuestos: false,
    completado: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (name: keyof SolicitudFormData, date: Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: date || null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      ...formData,
      fecha_nacimiento: formData.fecha_nacimiento?.format('YYYY-MM-DD'),
      fecha_solicitud: formData.fecha_solicitud?.format('YYYY-MM-DD'),
    });
    // Submit logic here
  };

  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Formulario de Solicitud de Información
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }} component="div">
            <TextField fullWidth label="Número de Caso" name="numero__caso" type="number" value={formData.numero__caso} onChange={handleChange} required />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Nombres" name="nombres" value={formData.nombres || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Apellido Paterno" name="apellido_paterno" value={formData.apellido_paterno || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Apellido Materno" name="apellido_materno" value={formData.apellido_materno || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="CI" name="ci" value={formData.ci || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Complemento" name="complemento" value={formData.complemento || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de Nacimiento"
              value={formData.fecha_nacimiento}
              onChange={date => handleDateChange('fecha_nacimiento', date)}
            />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, md: 6 , }}>
            <TextField fullWidth label="Placa del Vehículo" name="placa" value={formData.placa || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Delito" name="delito" value={formData.delito || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Investigador" name="investigador" value={formData.investigador || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Tipo de Solicitud" name="tipo" value={formData.tipo || ''} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Solicitud"
                value={formData.fecha_solicitud}
                onChange={date => handleDateChange('fecha_solicitud', date)}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={<Checkbox checked={formData.segip || false} name="segip" onChange={handleChange} />}
              label="Incluir SEGIP"
            />
            <FormControlLabel
              control={<Checkbox checked={formData.sinarap || false} name="sinarap" onChange={handleChange} />}
              label="Incluir SINARAP"
            />
            <FormControlLabel
              control={<Checkbox checked={formData.itv || false} name="itv" onChange={handleChange} />}
              label="Incluir ITV"
            />
            <FormControlLabel
              control={<Checkbox checked={formData.impuestos || false} name="impuestos" onChange={handleChange} />}
              label="Incluir Impuestos"
            />
            <FormControlLabel
              control={<Checkbox checked={formData.completado || false} name="completado" onChange={handleChange} />}
              label="¿Solicitud Completada?"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button type="submit" variant="contained" fullWidth>
              Enviar Solicitud
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SolicitudForm;
