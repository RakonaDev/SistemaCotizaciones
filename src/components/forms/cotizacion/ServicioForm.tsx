
'use client'

import { ServicioInterface } from "@/database/interfaces/ServicioInterface";
import { useCotizacionForm } from "@/zustand/useCotizacionForm";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function ServicioForm({
  servicio,
}: {
  servicio: ServicioInterface;
}) {

  const { agregarCotizacion, cotizacionGeneral } = useCotizacionForm()
  const [cotizacionForm, setCotizacionForm] = useState(cotizacionGeneral.filter((cotizacion) => cotizacion.servicioId === servicio.id))

  

  const agregarCotizacionHandler = () => {
    agregarCotizacion({
      descripcion: '',
      horas: 0,
      servicioId: servicio.id,
      precioHoras: 0,
      subTotal: 0,

      cantidad: 0,
      precio_unit: 0
    })
  }

  return (
    <>
      <div className="w-full">
        <div className="flex gap-4">
          <h3 className="text-3xl font-semibold">{servicio.nombre}</h3>
          <button
            className="bg-primary p-2 rounded-xl text-white cursor-pointer"
            onClick={agregarCotizacionHandler}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="w-full flex gap-4 flex-wrap">
          {
            cotizacionForm.map(
              (cotizacion) => {
                if (servicio.tipo === 'AREA') {
                  return (
                    <>
                      <div className="">
                        <input type="text" name="" id="" value={cotizacion.descripcion} />
                      </div>
                    </>
                  )
                } else if (servicio.tipo === 'SERVICIO') {
                  return (
                    <>
                      <div className="">
                        <input type="text" name="" id="" value={cotizacion.descripcion} />
                      </div>
                    </>
                  )
                }
              }
            )
          }
        </div>
      </div>
    </>
  );
}
