import { CotizacionCajaInterface } from "./CotizacionCajaInterface";
import { ServicioInterface } from "./ServicioInterface";


export interface CotizacionDetailInterface {
  id: number;
  descripcion: string;
  id_servicio: number;
  id_cotizacion: number;
  precio_total: number;

  created_at: string;
  updated_at: string;

  servicio?: ServicioInterface;
  cajas?: CotizacionCajaInterface[];
}