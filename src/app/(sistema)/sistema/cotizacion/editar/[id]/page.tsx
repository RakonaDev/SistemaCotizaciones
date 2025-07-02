
'use server'

import EditarCotizacionForm from "@/components/modals/cotizacion/EditarCotizacion"
import { getServerSideProps } from "@/logic/getServerSideProps"

export default async function EditarCotizacion ({
    params
}: {
    params: Promise<{ id: string }>
}) {

    const { id } = await params

    const data = await getServerSideProps(`cotizaciones/${id}`)
    const dataServicio = await getServerSideProps(`servicios`)
    console.log(data)

    return (
        <>
            <EditarCotizacionForm
                cotizacionData={data}
                serviciosData={dataServicio}
            />
        </>
    )
}