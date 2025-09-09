"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { X, User, MapPin, FileText, Mail, Phone, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { InputIcon } from "./InputIcon"
import { useFormik } from "formik"
import { AxiosError } from "axios"
import { Global } from "@/database/Global"
import { toast } from "sonner"
import { apiAuth } from "@/axios/apiAuth"
import { VendedorErrors, VendedoresInterface } from "@/database/interfaces/VendedoresInterface"
import { createVendedorSchema, editVendedorSchema } from "@/database/schema/VendedorSchema"

interface ClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vendedor: VendedoresInterface) => void
  vendedor?: VendedoresInterface | null
  mode: "create" | "edit"
}

export default function VendedorModal({ isOpen, onClose, onSave, vendedor, mode }: ClienteModalProps) {

  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<VendedorErrors>({
    correo: [],
    direccion: [],
    nombre: [],
    apellido: [],
    telefono: []
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
      nombre: vendedor?.nombre || '',
      direccion: vendedor?.direccion || '',
      apellido: vendedor?.apellido || '',
      correo: vendedor?.correo || '',
      telefono: vendedor?.telefono || '',
    },
    validationSchema: mode === 'edit' ? editVendedorSchema : createVendedorSchema,
    onSubmit: async (values) => {
      if (loading) return
      setLoading(true)
      if (mode === 'edit') {
        try {
          const response = await apiAuth.put(`${Global.api}/vendedores/${vendedor?.id}`, values)
          toast.success('Se ha editado correctamente el vendedor')
          if (response.status === 200) {
            onSave({ ...response.data, id: vendedor?.id })
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
          const response = await apiAuth.post(`${Global.api}/vendedores`, values)
          toast.success('Se ha creado correctamente el vendedor')

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
    if (vendedor && mode === "edit") {
      setTouched({
        nombre: false,
        direccion: false,
        apellido: false,
        correo: false,
        telefono: false,
      })
      setErrores({
        nombre: [],
        direccion: [],
        apellido: [],
        correo: [],
        telefono: [],
      })
      setValues({
        nombre: vendedor.nombre,
        direccion: vendedor.direccion,
        apellido: vendedor.apellido,
        correo: vendedor.correo,
        telefono: vendedor.telefono,
      })
    } else {
      setTouched({
        nombre: false,
        direccion: false,
        apellido: false,
        correo: false,
        telefono: false,
      })
      setErrores({
        nombre: [],
        direccion: [],
        apellido: [],
        correo: [],
        telefono: [],
      })
      setValues({
        nombre: "",
        direccion: "",
        apellido: "",
        correo: "",
        telefono: "",
      })
    }
  }, [vendedor, mode, isOpen])

  /*
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "edit" && vendedor) {
      onSave({ ...formData, id: vendedor.id })
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
                {mode === "create" ? "Nuevo Vendedor" : "Editar Vendedor"}
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
                Icono={User}
                label="Nombre"
                inputMode="text"
                name="nombre"
                placeholder="Nombre del Vendedor"
                value={values.nombre}
                error={errors.nombre}
                touched={touched.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                
                errores={errores.nombre}
              />

              {/* Dirección */}
              <InputIcon
                type="text"
                Icono={MapPin}
                label="Dirección"
                inputMode="text"
                name="direccion"
                placeholder="Dirección del Vendedor"
                value={values.direccion}
                error={errors.direccion}
                touched={touched.direccion}
                onChange={handleChange}
                onBlur={handleBlur}
                errores={errores.direccion}
                disabled={loading}
              />

              {/* RUC */}
              <InputIcon
                type="text"
                Icono={FileText}
                label="Apellido"
                inputMode="text"
                name="apellido"
                placeholder="Apellido del Vendedor"
                value={values.apellido}
                error={errors.apellido}
                touched={touched.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
                errores={errores.apellido}
                disabled={loading}
              />

              {/* Correo */}
              <InputIcon
                type="email"
                Icono={Mail}
                label="Correo"
                inputMode="email"
                name="correo"
                placeholder="Correo del Vendedor"
                value={values.correo}
                error={errors.correo}
                touched={touched.correo}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                errores={errores.correo}
              />

              {/* Teléfono */}
              <InputIcon
                type="tel"
                Icono={Phone}
                label="Telefono"
                name="telefono"
                inputMode="tel"
                placeholder="Telefono del Vendedor"
                value={values.telefono}
                error={errors.telefono}
                touched={touched.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                errores={errores.telefono}
              />

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
