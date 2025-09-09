import * as Yup from 'yup'

const CotizacionAgregarServicioSchema = Yup.object().shape({
  id: Yup.string().required('ID requerido'),
  servicioId: Yup.number().required('Servicio requerido'),
  descripcion: Yup.string().required('Descripción requerida'),
  subtotal: Yup.number().min(0, 'Debe ser mayor o igual a 0').required('Subtotal requerido'),
  tipo: Yup.mixed<'AREA' | 'SERVICIO' | 'OTROS'>()
    .oneOf(['AREA', 'SERVICIO', 'OTROS'], 'Tipo inválido')
    .required('Tipo requerido'),
  horas: Yup.number().min(0, 'Horas no válidas').required('Horas requeridas'),
  costo: Yup.number().min(0, 'Costo no válido').required('Costo requerido'),
  cantidad: Yup.number().min(0, 'Cantidad no válida').required('Cantidad requerida'),
  precio_unit: Yup.number().min(0, 'Precio unitario no válido').required('Precio unitario requerido'),
});

const CotizacionCajaAgregarSchema = Yup.object().shape({
  id: Yup.string().required('ID requerido'),
  descripcion: Yup.string().required('Descripción requerida'),
  cantidad: Yup.number().min(1, 'Cantidad mínima es 1').required('Cantidad requerida'),
  utilidad: Yup.number().min(0, 'Utilidad no válida').required('Utilidad requerida'),
  gg: Yup.number().min(0, 'Gastos generales no válidos').required('Gastos generales requeridos'),
  precio_unit: Yup.number().min(0, 'Precio unitario no válido').required('Precio unitario requerido'),
  precio_total: Yup.number().min(0, 'Precio total no válido').required('Precio total requerido'),

  servicios: Yup.array().of(CotizacionAgregarServicioSchema)
});

export const CotizacionAgregarSchema = Yup.object().shape({
  descripcion: Yup.string().required('Descripción requerida'),
  precio_total: Yup.number().min(0, 'Precio total no válido').required('Precio total requerido'),
  fecha_inicial: Yup.string().required('Fecha inicial requerida'),
  fecha_final: Yup.string().required('Fecha final requerida'),
  id_cliente: Yup.number().required('ID de cliente requerido'),
  dias: Yup.number().min(0, 'Días no válidos').required('Número de días requerido'),

  cotizaciones: Yup.array().of(CotizacionCajaAgregarSchema)
});

/**
 * 
 * descripcion: Yup.string().required('Descripción requerida'),
  precio_total: Yup.number().min(0, 'Precio total no válido').required('Precio total requerido'),
  fecha_inicial: Yup.string().required('Fecha inicial requerida'),
  fecha_final: Yup.string().required('Fecha final requerida'),
  id_cliente: Yup.number().required('ID de cliente requerido'),
  dias: Yup.number().min(0, 'Días no válidos').required('Número de días requerido'),

  cotizaciones: Yup.array().of(CotizacionCajaAgregarSchema)
 */