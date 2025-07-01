export type ServicioInterface = {
  id: number
  nombre: string
  tipo: "SERVICIO" | "AREA" | "OTROS"
}

export interface ServicioErrors {
  nombre: string[]
  tipo: string[]
}