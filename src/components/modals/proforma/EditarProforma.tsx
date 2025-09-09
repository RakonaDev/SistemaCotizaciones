'use client'

import type React from "react"
import { useState } from "react"
import { Formik, Form, FieldArray, type FormikProps } from "formik"
import { motion, AnimatePresence } from "framer-motion"
import { ProformaDetailInterface } from "@/database/interfaces/ProformaDetail"
import { proformaValidationSchema } from "@/database/schema/ProformaSchema"
import { ProformaInterface } from "@/database/interfaces/ProformaInterface"
import { FormField } from "@/components/ui/form-field"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { SearchSelect } from "@/components/ui/search"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Global } from "@/database/Global"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { calcularDiasEntreFechas } from "@/logic/calcularDiasEntreFechas"

interface ProformaFormProps {
  initialValues?: Partial<ProformaInterface>
  onSubmit?: (values: ProformaInterface) => Promise<void>
  isEditing?: boolean
  proforma: ProformaInterface
}

const initialFormValues: ProformaInterface = {
  asunto: "",
  lugar_entrega: "",
  forma_pago: "",
  moneda: "PEN",
  fecha_entrega: "",
  fecha_inicial: "",
  dias: 0,
  subtotal: 0,
  descuento: 0,
  valor_venta: 0,
  igv: 0,
  importe_total: 0,
  id_cliente: 0,
  id_vendedor: 0,
  detalles: [
    {
      descripcion: "",
      UM: "",
      cantidad: 1,
      precio_unit: 0,
      descuento: 0,
      total: 0,
      incluye: [],
    },
  ],
}

const formasPago = [
  { value: "contado", label: "Contado" },
  { value: "credito", label: "Crédito" },
  { value: "transferencia", label: "Transferencia" },
]

const monedas = [
  { value: "PEN", label: "Soles (PEN)" },
  { value: "USD", label: "Dólares (USD)" },
]

const unidadesMedida = [
  { value: "UND", label: "Unidad" },
  { value: "KG", label: "Kilogramo" },
  { value: "M", label: "Metro" },
  { value: "M2", label: "Metro cuadrado" },
  { value: "L", label: "Litro" },
]

export default function EditarProforma({ proforma, isEditing }: ProformaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const formInitialValues: ProformaInterface = {
    ...initialFormValues,
    id_cliente: proforma.id_cliente,
    id_vendedor: proforma.id_vendedor,
    asunto: proforma.asunto,
    lugar_entrega: proforma.lugar_entrega,
    forma_pago: proforma.forma_pago,
    moneda: proforma.moneda,
    subtotal: proforma.subtotal,
    descuento: proforma.descuento,
    valor_venta: proforma.valor_venta,
    igv: proforma.igv,
    importe_total: proforma.importe_total,
    detalles: proforma.detalles,
    fecha_entrega: proforma.fecha_entrega,
    fecha_inicial: proforma.fecha_inicial,
    dias: proforma.dias,
  }

  const calculateDetailTotal = (cantidad: number, precioUnit: number, descuento = 0): number => {
    const subtotal = cantidad * precioUnit
    return subtotal - descuento
  }

  const calculateFormTotals = (detalles: ProformaDetailInterface[]) => {
    const subtotal = detalles.reduce((sum, detalle) => sum + detalle.total, 0)
    const igv = subtotal * 0.18 // 18% IGV
    const valorVenta = subtotal
    const importeTotal = valorVenta + igv

    return {
      subtotal,
      valor_venta: valorVenta,
      igv,
      importe_total: importeTotal,
    }
  }

  const handleSubmit = async (values: ProformaInterface) => {
    setIsSubmitting(true)
    try {
      // await onSubmit(values)
      console.log("Datos del formulario:", values)

      // Aquí harías la llamada a tu API Laravel
      const response = await axios.put(`${Global.api}/proformas/${proforma.id}`, values, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })

      if (response.status === 200) {
        router.push('/sistema/proformas')
      }
      Swal.fire(`✅ Proforma creada exitosamente. ID: ${proforma.id}`, "Success", "success")
    } catch (error) {
      console.error("Error:", error)
      Swal.fire({
        icon: "error",
        title: "❌ Error al crear la proforma",
        text: (error as Error).message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-secondary text-white px-6 py-4 shadow-sm">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold">{isEditing ? "Editar Proforma" : "Nueva Proforma"}</h1>
          <p className="text-blue-100 text-sm mt-1">Complete todos los campos requeridos para crear la proforma</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Formik
          initialValues={formInitialValues}
          validationSchema={proformaValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formik: FormikProps<ProformaInterface>) => (
            <Form className="space-y-8">
              {/* Información General */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">Información General</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <FormField label="Asunto" error={formik.touched.asunto ? formik.errors.asunto : undefined} required>
                      <Input
                        name="asunto"
                        value={formik.values.asunto}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={!!(formik.touched.asunto && formik.errors.asunto)}
                        placeholder="Ingrese el asunto de la proforma"
                      />
                    </FormField>
                  </div>

                  <FormField label="Moneda" error={formik.touched.moneda ? formik.errors.moneda : undefined} required>
                    <Select
                      name="moneda"
                      value={formik.values.moneda}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={!!(formik.touched.moneda && formik.errors.moneda)}
                      options={monedas}
                    />
                  </FormField>

                  <FormField
                    label="Lugar de Entrega"
                    error={formik.touched.lugar_entrega ? formik.errors.lugar_entrega : undefined}
                    required
                  >
                    <Input
                      name="lugar_entrega"
                      value={formik.values.lugar_entrega}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={!!(formik.touched.lugar_entrega && formik.errors.lugar_entrega)}
                      placeholder="Dirección de entrega"
                    />
                  </FormField>

                  <FormField
                    label="Forma de Pago"
                    error={formik.touched.forma_pago ? formik.errors.forma_pago : undefined}
                    required
                  >
                    <Select
                      name="forma_pago"
                      value={formik.values.forma_pago}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={!!(formik.touched.forma_pago && formik.errors.forma_pago)}
                      options={formasPago}
                      placeholder="Seleccione forma de pago"
                    />
                  </FormField>

                  <FormField
                    label="Cliente"
                    error={formik.touched.id_cliente ? formik.errors.id_cliente : undefined}
                    required
                  >
                    <SearchSelect
                      name="id_cliente"
                      value={formik.values.id_cliente}
                      queryClient={proforma.cliente?.nombre}
                      onChange={(name, value) => formik.setFieldValue(name, value)}
                      onBlur={(name) => formik.setFieldTouched(name, true)}
                      error={!!(formik.touched.id_cliente && formik.errors.id_cliente)}
                      searchUrl="buscarCliente"
                      searchParam="q"
                      placeholder="Buscar cliente..."
                    />
                    {/* <Select
                      name="id_cliente"
                      value={formik.values.id_cliente}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={!!(formik.touched.id_cliente && formik.errors.id_cliente)}
                      options={clientes.map((cliente) => ({
                        value: cliente.id,
                        label: cliente.nombre,
                      }))}
                      placeholder="Seleccione un cliente"
                    /> */}
                  </FormField>

                  <FormField
                    label="Vendedor"
                    error={formik.touched.id_vendedor ? formik.errors.id_vendedor : undefined}
                    required
                  >
                    <SearchSelect
                      name="id_vendedor"
                      value={formik.values.id_vendedor}
                      queryClient={proforma.vendedor?.nombre}
                      onChange={(name, value) => formik.setFieldValue(name, value)}
                      onBlur={(name) => formik.setFieldTouched(name, true)}
                      error={!!(formik.touched.id_vendedor && formik.errors.id_vendedor)}
                      searchUrl="buscarVendedor"
                      searchParam="q"
                      placeholder="Buscar vendedor..."
                    />
                    {/* <Select
                      name="id_vendedor"
                      value={formik.values.id_vendedor}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={!!(formik.touched.id_vendedor && formik.errors.id_vendedor)}
                      options={vendedores.map((vendedor) => ({
                        value: vendedor.id,
                        label: vendedor.nombre,
                      }))}
                      placeholder="Seleccione un vendedor"
                    /> */}
                  </FormField>

                  <FormField
                    label="Fecha de Inicial"
                    error={formik.touched.fecha_inicial ? formik.errors.fecha_inicial : undefined}
                    required
                  >
                    <Input
                      name="fecha_inicial"
                      value={formik.values.fecha_inicial}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={!!(formik.touched.fecha_inicial && formik.errors.fecha_inicial)}
                      placeholder="Fecha Inicial"
                      type="date"
                    />
                  </FormField>

                  <FormField
                    label="Fecha de Entrega"
                    error={formik.touched.fecha_inicial ? formik.errors.fecha_entrega : undefined}
                    required
                  >
                    <Input
                      name="fecha_entrega"
                      value={formik.values.fecha_entrega}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={!!(formik.touched.fecha_entrega && formik.errors.fecha_entrega)}
                      placeholder="Fecha de entrega"
                      type="date"
                    />
                  </FormField>

                  <FormField
                    label="Días"
                    error={formik.touched.dias ? formik.errors.dias : undefined}
                    required
                  >
                    <Input
                      name="dias"
                      value={calcularDiasEntreFechas(formik.values.fecha_inicial, formik.values.fecha_entrega)}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={!!(formik.touched.dias && formik.errors.dias)}
                      disabled
                      placeholder="Días"
                      type="number"
                    />
                  </FormField>
                </div>
              </motion.section>

              {/* Detalles */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-600 rounded"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900">Detalles de la Proforma</h2>
                  </div>
                </div>

                <FieldArray name="detalles">
                  {({ push, remove }) => (
                    <div className="space-y-6">
                      <AnimatePresence>
                        {formik.values.detalles.map((detalle, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-50 rounded-lg border border-slate-200 p-6"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-medium text-slate-900">Detalle {index + 1}</h3>
                              {formik.values.detalles.length > 1 && (
                                <Button type="button" className="bg-red-600 hover:bg-red-700 cursor-pointer" size="sm" onClick={() => remove(index)}>
                                  Eliminar
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                              <div className="lg:col-span-2">
                                <FormField
                                  label="Descripción"
                                  error={
                                    formik.touched.detalles?.[index]?.descripcion
                                      ? (formik.errors.detalles as any)?.[index]?.descripcion
                                      : undefined
                                  }
                                  required
                                >
                                  <Input
                                    name={`detalles.${index}.descripcion`}
                                    value={detalle.descripcion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Descripción del producto/servicio"
                                  />
                                </FormField>
                              </div>

                              <FormField
                                label="Unidad de Medida"
                                error={
                                  formik.touched.detalles?.[index]?.UM
                                    ? (formik.errors.detalles as any)?.[index]?.UM
                                    : undefined
                                }
                                required
                              >
                                <Select
                                  name={`detalles.${index}.UM`}
                                  value={detalle.UM}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  options={unidadesMedida}
                                  placeholder="Seleccione UM"
                                />
                              </FormField>

                              <FormField
                                label="Cantidad"
                                error={
                                  formik.touched.detalles?.[index]?.cantidad
                                    ? (formik.errors.detalles as any)?.[index]?.cantidad
                                    : undefined
                                }
                                required
                              >
                                <Input
                                  type="number"
                                  name={`detalles.${index}.cantidad`}
                                  value={detalle.cantidad}
                                  onChange={(e) => {
                                    formik.handleChange(e)
                                    const cantidad = Number.parseInt(e.target.value) || 0
                                    const total = calculateDetailTotal(cantidad, detalle.precio_unit, detalle.descuento)
                                    formik.setFieldValue(`detalles.${index}.total`, total)

                                    // Recalcular totales del formulario
                                    const newDetalles = [...formik.values.detalles]
                                    newDetalles[index] = { ...detalle, cantidad, total }
                                    const totals = calculateFormTotals(newDetalles)
                                    Object.keys(totals).forEach((key) => {
                                      formik.setFieldValue(key, totals[key as keyof typeof totals])
                                    })
                                  }}
                                  onBlur={formik.handleBlur}
                                  min="1"
                                />
                              </FormField>

                              <FormField
                                label="Precio Unitario"
                                error={
                                  formik.touched.detalles?.[index]?.precio_unit
                                    ? (formik.errors.detalles as any)?.[index]?.precio_unit
                                    : undefined
                                }
                                required
                              >
                                <Input
                                  type="number"
                                  step="0.01"
                                  name={`detalles.${index}.precio_unit`}
                                  value={detalle.precio_unit}
                                  onChange={(e) => {
                                    formik.handleChange(e)
                                    const precioUnit = Number.parseFloat(e.target.value) || 0
                                    const total = calculateDetailTotal(detalle.cantidad, precioUnit, detalle.descuento)
                                    formik.setFieldValue(`detalles.${index}.total`, total)

                                    // Recalcular totales del formulario
                                    const newDetalles = [...formik.values.detalles]
                                    newDetalles[index] = { ...detalle, precio_unit: precioUnit, total }
                                    const totals = calculateFormTotals(newDetalles)
                                    Object.keys(totals).forEach((key) => {
                                      formik.setFieldValue(key, totals[key as keyof typeof totals])
                                    })
                                  }}
                                  onBlur={formik.handleBlur}
                                  min="0"
                                />
                              </FormField>

                              <FormField
                                label="Descuento"
                                error={
                                  formik.touched.detalles?.[index]?.descuento
                                    ? (formik.errors.detalles as any)?.[index]?.descuento
                                    : undefined
                                }
                              >
                                <Input
                                  type="number"
                                  step="0.01"
                                  name={`detalles.${index}.descuento`}
                                  value={detalle.descuento || ""}
                                  onChange={(e) => {
                                    formik.handleChange(e)
                                    const descuento = Number.parseFloat(e.target.value) || 0
                                    const total = calculateDetailTotal(detalle.cantidad, detalle.precio_unit, descuento)
                                    formik.setFieldValue(`detalles.${index}.total`, total)

                                    // Recalcular totales del formulario
                                    const newDetalles = [...formik.values.detalles]
                                    newDetalles[index] = { ...detalle, descuento, total }
                                    const totals = calculateFormTotals(newDetalles)
                                    Object.keys(totals).forEach((key) => {
                                      formik.setFieldValue(key, totals[key as keyof typeof totals])
                                    })
                                  }}
                                  onBlur={formik.handleBlur}
                                  min="0"
                                />
                              </FormField>

                              <FormField
                                label="Total"
                                error={
                                  formik.touched.detalles?.[index]?.total
                                    ? (formik.errors.detalles as any)?.[index]?.total
                                    : undefined
                                }
                                required
                              >
                                <Input
                                  type="number"
                                  step="0.01"
                                  name={`detalles.${index}.total`}
                                  value={detalle.total}
                                  readOnly
                                  className="font-semibold bg-green-50 border-green-200 text-green-800"
                                />
                              </FormField>
                            </div>

                            {/* Incluye Items */}
                            <div className="border-t border-slate-200 pt-4">
                              <h4 className="text-sm font-medium text-slate-700 mb-3">Items Incluidos</h4>
                              <FieldArray name={`detalles.${index}.incluye`}>
                                {({ push: pushIncluye, remove: removeIncluye }) => (
                                  <div className="space-y-2">
                                    <AnimatePresence>
                                      {detalle.incluye.map((incluye, incluyeIndex) => (
                                        <motion.div
                                          key={incluyeIndex}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -20 }}
                                          className="flex gap-2 items-center"
                                        >
                                          <Input
                                            name={`detalles.${index}.incluye.${incluyeIndex}.nombre`}
                                            value={incluye.nombre}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Nombre del item incluido"
                                            className="flex-1"
                                          />
                                          <Button
                                            type="button"

                                            size="sm"
                                            onClick={() => removeIncluye(incluyeIndex)}
                                            className="px-3 bg-red-500 hover:bg-red-600"
                                          >
                                            ×
                                          </Button>
                                        </motion.div>
                                      ))}
                                    </AnimatePresence>
                                    <Button
                                      type="button"

                                      size="sm"
                                      onClick={() => pushIncluye({ nombre: "" })}
                                      className="text-xs bg-primary hover:bg-secondary cursor-pointer"
                                    >
                                      + Agregar Item
                                    </Button>
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <Button
                        type="button"
                        onClick={() =>
                          push({
                            descripcion: "",
                            UM: "",
                            cantidad: 1,
                            precio_unit: 0,
                            descuento: 0,
                            total: 0,
                            incluye: [],
                          })
                        }
                        className="w-full border-2 z-40 !text-secondary border-dashed border-slate-300 hover:border-slate-400 bg-transparent hover:bg-slate-50"
                      >
                        + Agregar Nuevo Detalle
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </motion.section>

              {/* Totales */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">Resumen de Totales</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <FormField label="Subtotal">
                    <Input
                      type="number"
                      step="0.01"
                      name="subtotal"
                      value={Number(formik.values.subtotal).toFixed(2)}
                      readOnly
                      className="font-semibold"
                    />
                  </FormField>

                  <FormField label="Descuento General">
                    <Input
                      type="number"
                      step="0.01"
                      name="descuento"
                      value={formik.values.descuento || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      min="0"
                    />
                  </FormField>

                  <FormField label="Valor de Venta">
                    <Input
                      type="number"
                      step="0.01"
                      name="valor_venta"
                      value={Number(formik.values.valor_venta).toFixed(2)}
                      readOnly
                      className="font-semibold"
                    />
                  </FormField>

                  <FormField label="IGV (18%)">
                    <Input
                      type="number"
                      step="0.01"
                      name="igv"
                      value={Number(formik.values.igv).toFixed(2)}
                      readOnly
                      className="font-semibold"
                    />
                  </FormField>

                  <FormField label="Importe Total">
                    <Input
                      type="number"
                      step="0.01"
                      name="importe_total"
                      value={Number(formik.values.importe_total).toFixed(2)}
                      readOnly
                      className="font-bold text-lg bg-blue-100 border-blue-300 text-blue-900"
                    />
                  </FormField>
                </div>
              </motion.section>

              {/* Botones de Acción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || !formik.isValid}
                  className="px-8 py-3 text-base font-semibold min-w-[200px]"
                >
                  {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Proforma" : "Crear Proforma"}
                </Button>

                <Button
                  type="button"
                  onClick={() => formik.resetForm()}
                  className="px-8 py-3 text-base bg-red-500 hover:bg-red-600"
                >
                  Limpiar Formulario
                </Button>
              </motion.div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}