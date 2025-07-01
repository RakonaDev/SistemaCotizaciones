
'use client'

import { nanoid } from 'nanoid'
import { CotizacionZustandInterface } from "@/database/interfaces/CotizacionZustandInterface";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCotizacionForm = create(
  persist<CotizacionZustandInterface>(
    (set) => ({
      cotizacionGeneral: [],
      total: 0,
      resetForm() {
        set({ cotizacionGeneral: [] })
      },
      agregarCotizacion(cotizacionNueva) {
        set((state) => {
          // Establezco la id
          const id = nanoid(7)

          const arrayActual = state.cotizacionGeneral
          arrayActual.push({
            ...cotizacionNueva,
            id: id
          })

          return {
            ...state,
            cotizacionGeneral: arrayActual
          }
        })
      },
      eliminarCotizacion(id) {
        set((state) => {

          const arrayActual = state.cotizacionGeneral

          return {
            ...state,
            cotizacionGeneral: arrayActual.filter((item) => item.id !== id)
          }
        })
      },
    }),
    {
      name: 'cotizacion-props',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)