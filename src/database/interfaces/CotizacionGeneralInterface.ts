import { ClientesInterface } from "./ClientesInterface";
import { CotizacionInterface } from "./CotizacionInterface";


export interface CotizacionGeneralInterface {
  id: number;
  fecha_inicial: Date;
  fecha_final: Date
  precio_total: number
  dias_entrega: number;
  descripcion: string;
  monto_total: number;
  id_cliente: number;

  created_at: string;
  updated_at: string;

  cliente?: ClientesInterface;
  cotizaciones?: CotizacionInterface[];
}


export interface CotizacionAgregarInterface {
  id?: number
  descripcion: string,
  precio_total: number,
  fecha_inicial: string,
  fecha_final: string,
  id_cliente: number,
  dias: number,
  cliente?: ClientesInterface,
  cotizaciones: CotizacionCajaAgregar[]
}

export interface CotizacionAgregarServicio {
  id: string
  servicioId: number
  descripcion: string
  subtotal: number
  tipo: 'AREA' | 'SERVICIO' | 'OTROS'

  horas: number
  costo: number

  cantidad: number
  precio_unit: number

}

export interface CotizacionCajaAgregar {
  id: string
  descripcion: string
  cantidad: number
  costo_directo: number
  utilidad: number
  gg: number
  precio_unit: number
  precio_total: number

  servicios: CotizacionAgregarServicio[]
}