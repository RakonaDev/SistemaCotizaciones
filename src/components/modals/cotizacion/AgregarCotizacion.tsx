"use client"

import BuscarCliente from "@/components/forms/BuscarCliente";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Global } from "@/database/Global";
import { CotizacionAgregarInterface, CotizacionAgregarServicio, CotizacionCajaAgregar } from "@/database/interfaces/CotizacionGeneralInterface";
import { ServicioInterface } from "@/database/interfaces/ServicioInterface";
import { CotizacionAgregarSchema } from "@/database/schema/CotizacionSchema";
import { calcularDiasEntreFechas } from "@/logic/calcularDiasEntreFechas";
import { useLoading } from "@/zustand/useLoading";

import axios from "axios";
import { FieldArray, Form, Formik, FormikErrors, FormikProps, useFormik } from "formik";
import { Delete, Plus, Trash, X } from "lucide-react";
import { motion } from "motion/react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function AgregarCotizacion({ serviciosData }: { serviciosData: ServicioInterface[] }) {

  const [servicios,] = useState<ServicioInterface[] | null>(serviciosData)
  const router = useRouter()
  const { setLoading } = useLoading()


  const initialValues: CotizacionAgregarInterface = {
    descripcion: '',
    precio_total: 0,
    fecha_inicial: '',
    fecha_final: '',
    id_cliente: 0,
    dias: 0,

    cotizaciones: [],
  }

  const agregar = async (values: CotizacionAgregarInterface) => {
    try {
      setLoading(true)
      console.log(values)
      if (values.cotizaciones.length === 0) {
        toast.error('Al menos debe haber 1 costeo')
        return
      }

      const res = await axios.post(`${Global.api}/cotizaciones`, values, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (res.status === 201) {
        toast.success(res.data.message)
        router.push('/sistema/cotizacion')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al agregar cotización')
    } finally {
      setLoading(false)
    }
  }


  const {
    values,
    setFieldValue,
    handleChange,
    handleBlur,
  } = useFormik<CotizacionAgregarInterface>({
    initialValues: {
      descripcion: '',
      precio_total: 0,
      fecha_inicial: '',
      fecha_final: '',
      id_cliente: 0,
      dias: 0,

      cotizaciones: [],
    },
    validationSchema: CotizacionAgregarSchema,
    onSubmit: agregar,
  })

  useEffect(() => {
    setFieldValue('dias', calcularDiasEntreFechas(values.fecha_inicial, values.fecha_final))
  }, [values.fecha_inicial, values.fecha_final, setFieldValue])

  useEffect(() => {
    const cotizaciones = values.cotizaciones || [];
    const total = cotizaciones.reduce(
      (acc: number, coti) => Number(acc || 0) + (coti.precio_total || 0),
      0
    );
    setFieldValue('precio_total', total)
  }, [values.cotizaciones, setFieldValue])

  return (
    <>
      <div className="p-6">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Agregar Cotización
            </h1>
            <p className="text-primary">
              Agregar toda la información para realizar la cotización
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}

              className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-red-500 text-white font-semibold hover:bg-red-600 rounded-lg  transition-all duration-300"
            >
              <Delete className="w-5 h-5" />
              <span>Reiniciar Formulario</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              type="button"
              whileTap={{ scale: 0.95 }}
              className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-primary text-white font-semibold hover:bg-secondary rounded-lg  transition-all duration-300"
              onClick={() => setFieldValue('cotizaciones', [
                ...values.cotizaciones,
                {
                  cantidad: 1,
                  descripcion: '',
                  gg: 0,
                  id: nanoid(8),
                  precio_total: 0,
                  precio_unit: 0,
                  utilidad: 0,
                  servicios: []
                }
              ] as CotizacionCajaAgregar[])}
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Costeo</span>
            </motion.button>
          </div>
        </motion.div>

        <Formik initialValues={initialValues} validationSchema={CotizacionAgregarSchema} onSubmit={agregar} className="w-full" enableReinitialize>
          {
            (formik) => (
              <Form action="w-full">
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                >
                  <div className="w-full mb-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField label="Asunto" error={formik.touched.descripcion ? formik.errors.descripcion : undefined} required>
                      <Input
                        type="text"
                        name="descripcion"
                        value={formik.values.descripcion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={!!(formik.touched.descripcion && formik.errors.descripcion)}
                      />
                    </FormField>

                    <BuscarCliente
                      apiUrl="buscarCliente"
                      onClienteSelect={(cliente) => {
                        setFieldValue('id_cliente', cliente.id)
                      }}
                      nombreCliente=""
                    />


                    <FormField label="Fecha Inicial" error={formik.touched.fecha_inicial ? formik.errors.fecha_inicial : undefined} required>
                      <Input
                        name="fecha_inicial"
                        type="date"
                        value={formik.values.fecha_inicial}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={!!(formik.touched.fecha_inicial && formik.errors.fecha_inicial)}
                      />
                    </FormField>

                    <FormField label="Fecha Final" error={formik.touched.fecha_final ? formik.errors.fecha_final : undefined} required>
                      <Input
                        type="date"
                        name="fecha_final"
                        value={formik.values.fecha_final}
                        error={!!(formik.touched.fecha_final && formik.errors.fecha_final)}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </FormField>

                    <FormField label="Días" error={formik.touched.dias ? formik.errors.dias : undefined} required>
                      <Input
                        type="number"
                        disabled
                        name="dias"
                        value={calcularDiasEntreFechas(formik.values.fecha_inicial, formik.values.fecha_final)}
                        error={!!(formik.touched.dias && formik.errors.dias)}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </FormField>

                    <FormField label="Precio Total" error={formik.touched.precio_total ? formik.errors.precio_total : undefined} required>
                      <Input
                        type="number"
                        disabled
                        name="precio_total"
                        value={formik.values.precio_total}
                        error={!!(formik.touched.precio_total && formik.errors.precio_total)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormField>

                  </div>
                </motion.section>
                <div className="">
                  <FieldArray
                    name="cotizaciones"
                    render={() => {
                      return (
                        <div>
                          {
                            values.cotizaciones.map((cotizacion, index) => {
                              return (
                                <div key={cotizacion.id}>
                                  <CotizacionCajaForm
                                    cotizacion={cotizacion}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    servicios={servicios}
                                    setFieldValue={setFieldValue}
                                    values={values}
                                    index={index}
                                    formik={formik}
                                  />
                                </div>
                              )
                            })
                          }
                        </div>
                      )
                    }}
                  />
                </div>

                <button
                  className="px-4 py-2 bg-primary text-white rounded-xl cursor-pointer hover:bg-secondary duration-300 transition-all"
                  type="submit"
                >
                  Registrar Cotización
                </button>
              </Form>
            )
          }
        </Formik>
      </div>
    </>
  );
}

function CotizacionCajaForm({
  cotizacion,
  setFieldValue,
  handleBlur,
  handleChange,
  index,
  values,
  servicios,
  formik
}: {
  cotizacion: CotizacionCajaAgregar
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void> | Promise<FormikErrors<CotizacionAgregarInterface>>,
  values: CotizacionAgregarInterface,
  index: number,
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  },
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  },
  servicios: ServicioInterface[] | null,
  formik: FormikProps<CotizacionAgregarInterface>
}) {

  const [verServicios, setVerServicios] = useState(false)

  const cambiarEstado = () => {
    setVerServicios(!verServicios)
  }

  const borrarCosteo = () => {
    setFieldValue('cotizaciones', values.cotizaciones.filter((cotizacionI) => cotizacionI.id !== cotizacion.id))
  }

  useEffect(() => {
    setFieldValue(`cotizaciones.${index}.precio_total`, values.cotizaciones[index].cantidad * values.cotizaciones[index].precio_unit)
  }, [index, setFieldValue, values.cotizaciones])

  return (
    <div className="mt-10 space-y-3">
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl text-primary">{values.cotizaciones[index].descripcion || 'Coloca un Nombre'}</h2>

        <section className="flex gap-3 items-center">
          <button
            type="button"
            onClick={cambiarEstado}
            className={`${verServicios ? ' bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-secondary'} text-white rounded-xl cursor-pointer font-medium px-4 py-2 transition-all duration-300`}
          >
            {verServicios ? 'Desaparecer Servicios' : 'Mostrar Servicios'}
          </button>

          <button
            type="button"
            onClick={borrarCosteo}
            className={`bg-red-500 hover:bg-red-600 text-white rounded-xl cursor-pointer font-medium px-4 py-2 transition-all duration-300`}
          >
            <Trash />
          </button>
        </section>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <FormField label="Descripción" error={formik.touched.descripcion ? formik.errors.descripcion : undefined} required>
          <Input
            name={`cotizaciones.${index}.descripcion`}
            value={values.cotizaciones[index].descripcion}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Descripción"
          />
        </FormField>

        <FormField label="Cantidad" error={formik.touched.cotizaciones?.[index].cantidad ? (formik.errors.cotizaciones?.[index] as FormikErrors<CotizacionCajaAgregar>).cantidad : undefined} required>
          <Input
            name={`cotizaciones.${index}.cantidad`}
            value={values.cotizaciones[index].cantidad}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Cantidad"
          />
        </FormField>

        <FormField label="Costo Directo" error={formik.touched.cotizaciones?.[index].costo_directo ? (formik.errors.cotizaciones?.[index] as FormikErrors<CotizacionCajaAgregar>).costo_directo : undefined} required>
          <Input
            name={`cotizaciones.${index}.costo_directo`}
            value={values.cotizaciones[index].costo_directo}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Costo Directo"
            disabled
          />
        </FormField>

        <FormField label="GG" error={formik.touched.cotizaciones?.[index].gg ? (formik.errors.cotizaciones?.[index] as FormikErrors<CotizacionCajaAgregar>).gg : undefined} required>
          <Input
            name={`cotizaciones.${index}.gg`}
            value={values.cotizaciones[index].gg}
            onChange={handleChange}
            onBlur={handleBlur}
            label="GG"
            disabled
          />
        </FormField>

        <FormField label="Utilidad" error={formik.touched.cotizaciones?.[index].utilidad ? (formik.errors.cotizaciones?.[index] as FormikErrors<CotizacionCajaAgregar>).utilidad : undefined} required>
          <Input
            name={`cotizaciones.${index}.utilidad`}
            value={values.cotizaciones[index].utilidad}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Utilidad"
            disabled
          />
        </FormField>

        <FormField label="Precio Unitario" error={formik.touched.cotizaciones?.[index].precio_unit ? (formik.errors.cotizaciones?.[index] as FormikErrors<CotizacionCajaAgregar>).precio_unit : undefined} required>
          <Input
            name={`cotizaciones.${index}.precio_unit`}
            value={values.cotizaciones[index].precio_unit}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Precio Unitario"
            disabled
          />
        </FormField>

        <FormField label="Precio Total" error={formik.touched.cotizaciones?.[index].precio_total ? (formik.errors.cotizaciones?.[index] as FormikErrors<CotizacionCajaAgregar>).precio_total : undefined} required>
          <Input
            name={`cotizaciones.${index}.precio_total`}
            value={values.cotizaciones[index].precio_total}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Precio Total"
            disabled
          />
        </FormField>

      </div>

      {
        verServicios && (
          <div className="flex flex-col gap-6 my-6 mt-10">
            {
              servicios && servicios.map((servicio, indexS) => {
                return (
                  <div key={servicio.id}>
                    <div className="w-full flex justify-between ">
                      <h3 className="text-3xl font-bold text-secondary">{indexS + 1}. {servicio.nombre}</h3>
                      <button
                        className="cursor-pointer"
                        onClick={() => {
                          console.log(values.cotizaciones[index])
                          const sr = values.cotizaciones[index].servicios ?? []
                          if (!sr) {
                            values.cotizaciones[index].servicios = []
                            console.log('NO HAY SERVICIOS')
                          }
                          setFieldValue(`cotizaciones.${index}.servicios`, [
                            ...values.cotizaciones[index].servicios,
                            {
                              id: nanoid(7),
                              servicioId: servicio.id,

                              descripcion: '',
                              subtotal: 0,
                              horas: 0,
                              costo: 0,

                              cantidad: 0,
                              precio_unit: 0,

                              tipo: servicio.tipo
                            }
                          ])
                        }}
                        type="button"
                      >
                        <Plus />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 mt-3 gap-4">
                      {values.cotizaciones[index] && values.cotizaciones[index].servicios.map((servicioItem, indexSer) => {
                        if (servicioItem.servicioId === servicio.id) {

                          if (servicioItem.tipo === 'AREA') {
                            return (
                              <AreaForm
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                                index={indexSer}
                                servicioItem={servicioItem}
                                setFieldValue={setFieldValue}
                                values={values}
                                indexPadre={index}
                                key={servicioItem.id}
                                formik={formik}
                              />
                            )
                          } else if (servicioItem.tipo === 'SERVICIO') {
                            return (
                              <ServicioForm
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                                index={indexSer}
                                indexPadre={index}
                                servicioItem={servicioItem}
                                setFieldValue={setFieldValue}
                                values={values}
                                key={servicioItem.id}
                                formik={formik}
                              />
                            )
                          }
                        }
                      })}
                    </div>
                  </div>
                )
              })
            }
          </div>
        )
      }
    </div>
  )
}

function AreaForm({
  setFieldValue,
  values,
  servicioItem,
  index,
  indexPadre,
  handleChange,
  handleBlur,
  formik
}: {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void> | Promise<FormikErrors<CotizacionAgregarInterface>>,
  values: CotizacionAgregarInterface,
  index: number,
  indexPadre: number
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  },
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  },
  servicioItem: CotizacionAgregarServicio,
  formik: FormikProps<CotizacionAgregarInterface>
}) {

  const workerRef = useRef<Worker>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('@/workers/calculoTotal.worker.ts', import.meta.url),
      { type: 'module' }
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, [])

  useEffect(() => {
    setFieldValue(`cotizaciones.${indexPadre}.servicios.${index}.subtotal`, Number(values.cotizaciones[indexPadre].servicios[index].horas) * Number(values.cotizaciones[indexPadre].servicios[index].costo))
  }, [index, indexPadre, setFieldValue, values.cotizaciones])

  useEffect(() => {

    const servicios = values.cotizaciones?.[indexPadre]?.servicios || [];
    const total = servicios.reduce(
      (acc: number, servicio) => Number(acc || 0) + (servicio.subtotal || 0),
      0
    );

    setFieldValue(`cotizaciones.${indexPadre}.gg`, total * 0.1)
    setFieldValue(`cotizaciones.${indexPadre}.utilidad`, total * 0.3)
    setFieldValue(`cotizaciones.${indexPadre}.costo_directo`, total)
    setFieldValue(`cotizaciones.${indexPadre}.precio_unit`, Number(total) + total * 0.1 + total * 0.3);

  }, [indexPadre, setFieldValue, values.cotizaciones]);

  const borrarArea = () => {
    setFieldValue(`cotizaciones.${indexPadre}.servicios`, values.cotizaciones[indexPadre].servicios.filter((item) => item.id !== servicioItem.id))
  }

  return (
    <div className="bg-white shadow-lg p-5 rounded-xl space-y-3" key={servicioItem.id}>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={borrarArea}
          className="self-end bg-red-400 p-1 text-white rounded-lg cursor-pointer hover:bg-red-500 transition-all duration-300"
        >
          <X size={25} />
        </button>
      </div>
      <FormField
        label="Descripción"
        error={formik.touched.cotizaciones?.[indexPadre].servicios?.[index].descripcion ? ((formik.errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).descripcion : undefined}
        required
      >
        <Input
          label={`Descripción`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.descripcion`}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].descripcion}
        />
      </FormField>

      <FormField label="Unidad de Medida" error={formik.touched.cotizaciones?.[indexPadre].servicios?.[index].horas ? ((formik.errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).horas : undefined} required>
        <Input
          label={`Horas`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.horas`}
          type="number"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].horas}

        />
      </FormField>

      <FormField label="Costo" error={formik.touched.cotizaciones?.[indexPadre].servicios?.[index].costo ? ((formik.errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).costo : undefined} required>
        <Input
          label={`Costo`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.costo`}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].costo}

        />
      </FormField>

      <FormField label="Subtotal" error={formik.touched.cotizaciones?.[indexPadre].servicios?.[index].subtotal ? ((formik.errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).subtotal : undefined} required>
        <Input
          label={`Subtotal`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.subtotal`}
          type="number"
          disabled
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].subtotal}

        />
      </FormField>
    </div>
  )
}

function ServicioForm({
  setFieldValue,
  values,
  servicioItem,
  index,
  handleChange,
  indexPadre,
  handleBlur,
  formik
}: {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void> | Promise<FormikErrors<CotizacionAgregarInterface>>,
  values: CotizacionAgregarInterface,
  index: number,
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  },
  indexPadre: number,
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  },
  servicioItem: CotizacionAgregarServicio,
  formik: FormikProps<CotizacionAgregarInterface>
}) {

  useEffect(() => {
    setFieldValue(`cotizaciones.${indexPadre}.servicios.${index}.subtotal`, Number(values.cotizaciones[indexPadre].servicios[index].precio_unit) * Number(values.cotizaciones[indexPadre].servicios[index].cantidad))
  }, [index, indexPadre, setFieldValue, values.cotizaciones])

  useEffect(() => {
    const servicios = values.cotizaciones?.[indexPadre]?.servicios || [];
    const total = servicios.reduce(
      (acc: number, servicio) => Number(acc || 0) + (servicio.subtotal || 0),
      0
    );
    setFieldValue(`cotizaciones.${indexPadre}.costo_directo`, total)
    setFieldValue(`cotizaciones.${indexPadre}.precio_unit`, Number(total) + total * 0.1 + total * 0.3);
    setFieldValue(`cotizaciones.${indexPadre}.gg`, total * 0.1)
    setFieldValue(`cotizaciones.${indexPadre}.utilidad`, total * 0.3)
  }, [indexPadre, setFieldValue, values.cotizaciones]);

  return (
    <div className="bg-white shadow-lg p-5 rounded-xl space-y-3" key={servicioItem.id}>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setFieldValue(`cotizaciones.${indexPadre}.servicios`, values.cotizaciones[indexPadre].servicios.filter((item) => item.id !== servicioItem.id))
          }}
          className="self-end bg-red-400 p-1 text-white rounded-lg cursor-pointer hover:bg-red-500 transition-all duration-300"
        >
          <X size={25} />
        </button>
      </div>
      <FormField label="Descripción" error={formik.touched.cotizaciones?.[indexPadre].servicios?.[index].descripcion ? ((formik.errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).descripcion : undefined} required>
        <Input
          label={`Descripción`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.descripcion`}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].descripcion}
        />
      </FormField>

      <FormField label="Cantidad" error={formik.touched.cotizaciones?.[indexPadre].servicios?.[index].cantidad ? ((formik.errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).cantidad : undefined} required>
        <Input
          label={`Cantidad`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.cantidad`}
          type="number"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].cantidad}

        />
      </FormField>

      <FormField label="Precio Unitario" error={formik.touched.cotizaciones?.[indexPadre].servicios?.[index].precio_unit ? ((formik.errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).precio_unit : undefined} required>
        <Input
          label={`Precio Unitario`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.precio_unit`}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].precio_unit}
        />
      </FormField>

      <FormField label="Precio Total" error={formik.touched.cotizaciones?.[indexPadre].servicios?.[index].subtotal ? ((formik.errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).subtotal : undefined} required>
        <Input
          label={`Precio Total`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.subTotal`}
          type="number"
          disabled
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].subtotal}

        />
      </FormField>
    </div>
  )
}
