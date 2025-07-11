'use server'

import { getServerSideProps } from "@/logic/getServerSideProps"
import CotizacionPagina from "@/pages/CotizacionPagina"

export default async function CotizacionPage () {

  const data = await getServerSideProps('cotizaciones')
  console.log(data)
  return (
    <>
      <CotizacionPagina cotizacionData={data} />
    </>
  )
}