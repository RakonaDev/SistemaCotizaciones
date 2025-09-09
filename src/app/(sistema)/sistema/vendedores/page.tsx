'use server'

import { getServerSideProps } from "@/logic/getServerSideProps"
import VendedoresPage from "@/pages/VendedoresPagina"

export default async function page() {
  
  const data = await getServerSideProps('vendedores')
  console.log(data)

  return (
    <>
      <VendedoresPage vendedoresData={data} />
    </>
  )
}