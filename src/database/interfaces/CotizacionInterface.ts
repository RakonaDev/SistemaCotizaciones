import { CotizacionDetailInterface } from "./CotizacionDetailInterface";

export interface CotizacionInterface {
  id: number;
  id_cotizacion_general: number;
  gg: number;
  utilidad: number;
  total_cotizaciones: number;

  created_at: string;
  updated_at: string;

  detalles?: CotizacionDetailInterface[];
}