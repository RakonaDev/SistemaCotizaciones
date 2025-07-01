
'use server'

import { getServerSideProps } from "@/logic/getServerSideProps";
import ClientesPage from "@/pages/ClientesPagina";

export default async function page () {

  const data = await getServerSideProps(`clientes`)
  console.log(data)
  return (
    <>
      <ClientesPage clientesData={data} />
    </>
  )
}