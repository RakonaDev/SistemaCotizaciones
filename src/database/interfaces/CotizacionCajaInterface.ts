export interface CotizacionCajaInterface {
  id: number;
  id_cotizacion_detail: number;
  total: number;

  cantidad?: number | null;
  precio_unitario?: number | null;

  horas_habiles?: number | null;
  hora_habil_costo?: number | null;

  created_at: string;
  updated_at: string;
}