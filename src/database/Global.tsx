
/*
export const Global = {
  api: 'http://localhost:8000/api',
  apiImagen: 'http://localhost:8000/'
}
*/

export const Global = {
  api: process.env.NEXT_PUBLIC_API,
  apiImagen: process.env.NEXT_PUBLIC_API_IMAGEN
}

