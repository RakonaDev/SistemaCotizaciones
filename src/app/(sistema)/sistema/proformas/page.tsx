'use server'

import { getServerSideProps } from "@/logic/getServerSideProps"
import ProformaPagina from "@/pages/ProFormaPagina"

export default async function page () {

  const data = await getServerSideProps('proformas')

  return (
    <>
      <ProformaPagina proformaData={data} />
    </>
  )
}