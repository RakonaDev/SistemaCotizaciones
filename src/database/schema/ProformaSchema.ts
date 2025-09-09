import * as Yup from "yup"

export const proformaValidationSchema = Yup.object({
  asunto: Yup.string().required("El asunto es requerido"),
  lugar_entrega: Yup.string().required("El lugar de entrega es requerido"),
  forma_pago: Yup.string().required("La forma de pago es requerida"),
  moneda: Yup.string().required("La moneda es requerida"),
  subtotal: Yup.number().min(0, "El subtotal debe ser mayor o igual a 0").required("El subtotal es requerido"),
  descuento: Yup.number().min(0, "El descuento debe ser mayor o igual a 0").nullable(),
  valor_venta: Yup.number()
    .min(0, "El valor de venta debe ser mayor o igual a 0")
    .required("El valor de venta es requerido"),
  igv: Yup.number().min(0, "El IGV debe ser mayor o igual a 0").required("El IGV es requerido"),
  importe_total: Yup.number()
    .min(0, "El importe total debe ser mayor o igual a 0")
    .required("El importe total es requerido"),
  id_cliente: Yup.number().min(1, "Debe seleccionar un cliente").required("El cliente es requerido"),
  id_vendedor: Yup.number().min(1, "Debe seleccionar un vendedor").required("El vendedor es requerido"),
  fecha_inicial: Yup.date()
    .required("La fecha inicial es requerida")
    .typeError("Formato de fecha inválido"),
  fecha_entrega: Yup.date()
    .required("La fecha de entrega es requerida")
    .typeError("Formato de fecha inválido")
    .min(Yup.ref("fecha_inicial"), "La fecha de entrega no puede ser menor que la fecha inicial"),
  
  detalles: Yup.array()
    .of(
      Yup.object({
        descripcion: Yup.string().required("La descripción es requerida"),
        UM: Yup.string().required("La unidad de medida es requerida"),
        cantidad: Yup.number()
          .min(1, "La cantidad debe ser mayor a 0")
          .integer("La cantidad debe ser un número entero")
          .required("La cantidad es requerida"),
        precio_unit: Yup.number()
          .min(0, "El precio unitario debe ser mayor o igual a 0")
          .required("El precio unitario es requerido"),
        descuento: Yup.number().min(0, "El descuento debe ser mayor o igual a 0").nullable(),
        total: Yup.number().min(0, "El total debe ser mayor o igual a 0").required("El total es requerido"),
        incluye: Yup.array()
          .of(
            Yup.object({
              nombre: Yup.string().required("El nombre es requerido"),
            }),
          )
          .default([]),
      }),
    )
    .min(1, "Debe agregar al menos un detalle")
    .required("Los detalles son requeridos"),
})
