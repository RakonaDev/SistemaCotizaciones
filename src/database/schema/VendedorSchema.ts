import * as Yup from 'yup';

export const createVendedorSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  direccion: Yup.string().required('La dirección es obligatoria'),
  apellido: Yup.string().required('El apellido es obligatorio'),
  correo: Yup.string().email('Correo inválido').required('El correo es obligatorio'),
  telefono: Yup.number().typeError('Debe ser un número').max(999999999, 'Debe tener como máximo 9 dígitos').required('El teléfono es obligatorio'),
});

export const editVendedorSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  direccion: Yup.string().required('La dirección es obligatoria'),
  apellido: Yup.string(),
  correo: Yup.string().email('Correo inválido'),
  telefono: Yup.number().typeError('Debe ser un número').max(999999999, 'Debe tener como máximo 9 dígitos'),
});