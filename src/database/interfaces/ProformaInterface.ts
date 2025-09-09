import { ClientesInterface } from "./ClientesInterface"
import { ProformaDetailInterface } from "./ProformaDetail"
import { VendedoresInterface } from "./VendedoresInterface"

export interface ProformaInterface {
  id?: number
  asunto: string
  lugar_entrega: string
  forma_pago: string
  moneda: string
  subtotal: number
  descuento?: number
  valor_venta: number
  igv: number
  fecha_entrega: string
  fecha_inicial: string
  dias: number
  importe_total: number
  id_cliente: number
  id_vendedor: number
  detalles: ProformaDetailInterface[]

  cliente?: ClientesInterface
  vendedor?: VendedoresInterface
}