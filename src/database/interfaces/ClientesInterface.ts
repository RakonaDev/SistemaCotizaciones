export interface ClientesInterface {
  id: number
  nombre: string
  direccion: string
  ruc: string
  correo: string
  telefono: number
}

export interface ClientesErrors {
  nombre: string[]
  direccion: string[]
  ruc: string[]
  correo: string[]
  telefono: string[]
}