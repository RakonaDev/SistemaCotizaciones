export interface VendedoresInterface {
  id?: number
  nombre: string;
  apellido: string;
  correo: string;
  direccion: string;
  telefono: string;
}

export interface VendedorErrors {
  nombre: string[]
  direccion: string[]
  apellido: string[]
  correo: string[]
  telefono: string[]
}