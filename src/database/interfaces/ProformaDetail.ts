import { ProformaIncluyeInterface } from "./ProformaIncluyeInterface"

export interface ProformaDetailInterface {
  descripcion: string
  UM: string
  cantidad: number
  precio_unit: number
  descuento?: number
  total: number
  incluye: ProformaIncluyeInterface[]
}