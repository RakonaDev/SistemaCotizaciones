"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, File, Box } from "lucide-react"
import { useEffect, useState } from "react"
import { ServicioErrors, ServicioInterface } from "@/database/interfaces/ServicioInterface"
import { InputIcon } from "./InputIcon"
import { useFormik } from "formik"
import axios, { AxiosError } from "axios"
import { Global } from "@/database/Global"
import { toast } from "sonner"
import { agregarServicioSchema, editarServicioSchema } from "@/database/schema/ServicioSchema"


interface ClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (servicio: ServicioInterface) => void
  servicio?: ServicioInterface | null
  mode: "create" | "edit"
}

export default function ServiciosModal({ isOpen, onClose, onSave, servicio, mode }: ClienteModalProps) {

  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<ServicioErrors>({
    nombre: [],
    tipo: []
  })

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
    setValues,
    setTouched
  } = useFormik({
    initialValues: {
      nombre: servicio?.nombre || '',
      tipo: servicio?.tipo || '',
    },
    validationSchema: mode === 'edit' ? editarServicioSchema : agregarServicioSchema,
    onSubmit: async (values) => {
      if (loading) return
      setLoading(true)
      if (mode === 'edit') {
        try {
          const response = await axios.put(`${Global.api}/servicios/${servicio?.id}`, values, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')
            }
          })
          toast.success('Se ha editado correctamente el servicio')
          if (response.status === 200) {
            onSave({ ...response.data, id: servicio?.id })
            onClose()
          }
        } catch (err) {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data.message)
            if (err.status === 422) {
              setErrores(err.response?.data.errors)
            }
          }
        } finally {
          setLoading(false)
        }
      } else {

        try {
          const response = await axios.post(`${Global.api}/servicios`, values, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')
            }
          })
          toast.success('Se ha creado correctamente el servicio')

          if (response.status === 201) {
            onSave(response.data)
            onClose()
          }

        } catch (err) {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data.message)
            if (err.status === 422) {
              setErrores(err.response?.data.errors)
            }
          }
        } finally {
          setLoading(false)
        }
      }
    },
  })

  useEffect(() => {
    if (servicio && mode === "edit") {
      setTouched({
        nombre: false,
        tipo: false,
      })
      setErrores({
        nombre: [],
        tipo: []
      })
      setValues({
        nombre: servicio.nombre,
        tipo: servicio.tipo
      })
    } else {
      setTouched({
        nombre: false,
        tipo: false
      })
      setErrores({
        nombre: [],
        tipo: []
      })
      setValues({
        nombre: "",
        tipo: ""
      })
    }
  }, [servicio, mode, isOpen])

  /*
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "edit" && servicio) {
      onSave({ ...formData, id: servicio.id })
    } else {
      onSave(formData)
    }
    onClose()
  }
  */
  /*
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target
     setFormData((prev) => ({
       ...prev,
       [name]: name === "telefono" ? Number(value) : value,
     }))
   }
   */

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white border border-[#576CBC]/30 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#576CBC]/30">
              <h2 className="text-xl font-bold text-secondary">
                {mode === "create" ? "Nuevo Servicio" : "Editar Servicio"}
              </h2>
              <button onClick={onClose} className="text-secondary/70 hover:text-terciary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nombre */}
              <InputIcon
                type="text"
                Icono={File}
                label="Nombre"
                name="nombre"
                inputMode="text"
                placeholder="Nombre del Servicio"
                value={values.nombre}
                error={errors.nombre}
                touched={touched.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                errores={errores.nombre}
              />
              

              <div>
                <label className={`block text-sm font-medium mb-2 ${loading ? 'text-gray-400' : 'text-secondary'}`}>Tipo</label>
                <div className="relative">
                  {/* <Icono className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70" /> */}
                  <Box
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 
              ${loading ? 'text-gray-400' : 'text-primary/70'}`}
                  />
                  <select
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.tipo}
                    name="tipo"
                    disabled={loading}
                    className={`
              w-full pl-12 pr-4 py-3 rounded-lg placeholder-primary focus:outline-none
              transition-all duration-300
              bg-slate-200 text-secondary
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400
            `}
                  >
                    <option value="">----</option>
                    <option value="SERVICIO">Servicio</option>
                    <option value="AREA">Area</option>
                    <option value="OTROS">Otros</option>
                  </select>
                </div>
                {
                  errors.tipo && touched.tipo && (
                    <span className="text-xs text-red-400 italic">{errors.tipo}</span>
                  )
                }
                {
                  errores.tipo && errores?.tipo?.map((item, index) => (
                    <span key={index} className="text-xs text-red-400 italic">{item}</span>
                  ))
                }
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className={`flex-1 py-3 px-4 bg-red-500 text-white rounded-lg transition-all duration-300
          hover:bg-red-600 ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-4 text-white font-semibold rounded-lg transition-all duration-300
          bg-[#0B2447] hover:bg-[#102c5a] flex items-center justify-center space-x-2
          ${loading ? 'opacity-80 cursor-wait' : ''}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Cargando...</span>
                    </>
                  ) : (
                    mode === "create" ? "Crear" : "Guardar"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
