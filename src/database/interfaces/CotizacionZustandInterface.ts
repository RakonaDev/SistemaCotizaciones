export interface CotizacionZustandInterface {
  cotizacionGeneral: CotizacionForm[]
  total: number
  resetForm: () => void
  agregarCotizacion: (cotizacionNueva: CotizacionForm) => void
  eliminarCotizacion: (id: string) => void
}

export interface CotizacionForm {
  id?: string
  descripcion: string
  servicioId: number;
  subTotal: number

  // Area
  horas?: number
  precioHoras?: number

  // servicio
  cantidad?: number
  precio_unit?: number
}
