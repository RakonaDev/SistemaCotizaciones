'use server'

import { getServerSideProps } from "@/logic/getServerSideProps";
import DashboardContent from "@/pages/DashboardPagina";

export default async function page() {

  const data = await getServerSideProps('dashboard/resumen')
  const dataCotizacion = await getServerSideProps('dashboard/cotizaciones')
  console.log(dataCotizacion)

  return (
    <>
      <DashboardContent stats={data} dataCotizacion={dataCotizacion} />
    </>
  )
}