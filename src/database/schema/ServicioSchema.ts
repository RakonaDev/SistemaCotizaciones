import * as yup from 'yup';

export const agregarServicioSchema = yup.object().shape({
  nombre: yup
    .string()
    .required('El nombre es obligatorio'),
  tipo: yup
    .string()
    .oneOf(['SERVICIO', 'AREA', 'OTROS'], 'Tipo inválido')
    .required('El tipo es obligatorio'),
});

export const editarServicioSchema = yup.object().shape({
  nombre: yup
    .string()
    .required('El nombre es obligatorio'),
  tipo: yup
    .string()
    .oneOf(['SERVICIO', 'AREA', 'OTROS'], 'Tipo inválido')
    .required('El tipo es obligatorio'),
});