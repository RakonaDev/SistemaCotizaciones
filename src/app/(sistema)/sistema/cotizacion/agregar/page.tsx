
'use server'

import AgregarCotizacion from "@/components/modals/cotizacion/AgregarCotizacion"
import { getServerSideProps } from "@/logic/getServerSideProps"

export default async function AgregarCotizacionPagina() {

    const data = await getServerSideProps('servicios')

    return (
        <>
            <AgregarCotizacion serviciosData={data} />
        </>
    )
}