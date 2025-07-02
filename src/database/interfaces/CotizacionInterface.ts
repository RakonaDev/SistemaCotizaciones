import { CotizacionDetailInterface } from "./CotizacionDetailInterface";

export interface CotizacionInterface {
  id: number;
  id_cotizacion_general: number;
  descripcion: string
  gg: number;
  utilidad: number;
  costo_directo: number
  cantidad: number
  total_cotizaciones: number;

  created_at: string;
  updated_at: string;

  detalles?: CotizacionDetailInterface[];
}