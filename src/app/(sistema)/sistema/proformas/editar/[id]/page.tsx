import EditarProforma from "@/components/modals/proforma/EditarProforma"
import { getServerSideProps } from "@/logic/getServerSideProps"

export default async function page({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params

  const response = await getServerSideProps(`proformas/${id}`)
  console.log(response)
  return (
    <>
      <EditarProforma isEditing={true} proforma={response} />
    </>
  )
}