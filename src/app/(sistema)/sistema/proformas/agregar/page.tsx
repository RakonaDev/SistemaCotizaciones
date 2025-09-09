"use client"

import { ProformaForm } from "@/components/ui/proforma-form"
import { Global } from "@/database/Global"
import { ProformaInterface } from "@/database/interfaces/ProformaInterface"
import { calcularDiasEntreFechas } from "@/logic/calcularDiasEntreFechas"
import axios from "axios"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export default function ProformaPage() {

  const router = useRouter()

  const handleSubmit = async (values: ProformaInterface) => {
    try {
      console.log("Datos del formulario:", values)
      const newValues = {
        ...values,
        dias: calcularDiasEntreFechas(values.fecha_inicial, values.fecha_entrega),
      }
      // Aquí harías la llamada a tu API Laravel
      const response = await axios.post(`${Global.api}/proformas`,newValues , {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
      const result = response.data

      if (response.status === 201) {
        router.push('/sistema/proformas')
      }
      Swal.fire(`✅ Proforma creada exitosamente. ID: ${result.proforma_id}`, "Success", "success")
    } catch (error) {
      console.error("Error:", error)
      Swal.fire({
        icon: "error",
        title: "❌ Error al crear la proforma",
        text: (error as Error).message,
      })
    }
  }

  return <ProformaForm onSubmit={handleSubmit} />
}
