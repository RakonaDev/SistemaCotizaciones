
import * as Yup from 'yup';

export const createClienteSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  direccion: Yup.string().required('La dirección es obligatoria'),
  ruc: Yup.string().required('El RUC es obligatorio'),
  correo: Yup.string().email('Correo inválido').required('El correo es obligatorio'),
  telefono: Yup.number().typeError('Debe ser un número').max(999999999, 'Debe tener como máximo 9 dígitos').required('El teléfono es obligatorio'),
});

export const editClienteSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  direccion: Yup.string().required('La dirección es obligatoria'),
  ruc: Yup.string(),
  correo: Yup.string().email('Correo inválido'),
  telefono: Yup.number().typeError('Debe ser un número').max(999999999, 'Debe tener como máximo 9 dígitos'),
});