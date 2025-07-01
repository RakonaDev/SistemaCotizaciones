
'use server'

import { getServerSideProps } from "@/logic/getServerSideProps"
import ServiciosPage from "@/pages/ServiciosPagina"

export default async function page () {
  const data = await getServerSideProps(`servicios`)

  return (
    <>
      <ServiciosPage servicioData={data} />
    </>
  )
}