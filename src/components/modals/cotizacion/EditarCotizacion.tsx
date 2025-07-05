"use client";

import BuscarCliente from "@/components/forms/BuscarCliente";

import { Input } from "@/components/forms/Input";
import { Global } from "@/database/Global";
import { CotizacionAgregarInterface, CotizacionAgregarServicio, CotizacionCajaAgregar } from "@/database/interfaces/CotizacionGeneralInterface";
import { ServicioInterface } from "@/database/interfaces/ServicioInterface";
import { CotizacionAgregarSchema } from "@/database/schema/CotizacionSchema";
import { calcularDiasEntreFechas } from "@/logic/calcularDiasEntreFechas";
import { parseDate } from "@/logic/parseDate";
import { useLoading } from "@/zustand/useLoading";

import axios from "axios";
import { FieldArray, Formik, FormikErrors, useFormik } from "formik";
import { Delete, Plus, Trash, X } from "lucide-react";
import { motion } from "motion/react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function EditarCotizacionForm({ serviciosData, cotizacionData }: { serviciosData: ServicioInterface[], cotizacionData: CotizacionAgregarInterface }) {

  const [servicios,] = useState<ServicioInterface[] | null>(serviciosData ?? [])
  const [cotizacion,] = useState<CotizacionAgregarInterface>(cotizacionData ?? {})
  const router = useRouter()
  const { setLoading } = useLoading()


  const initialValues: CotizacionAgregarInterface = {
    descripcion: cotizacion.descripcion,
    precio_total: cotizacion.precio_total,
    fecha_inicial: String(cotizacion.fecha_inicial),
    fecha_final: String(cotizacion.fecha_final),
    id_cliente: cotizacion.id_cliente,
    dias: cotizacion.dias,

    cotizaciones: cotizacion.cotizaciones,
  }

  const agregar = async (values: CotizacionAgregarInterface) => {
    try {
      setLoading(true)
      console.log(values)
      if (values.cotizaciones.length === 0) {
        toast.error('Al menos debe haber 1 costeo')
        return
      }

      const res = await axios.put(`${Global.api}/cotizaciones/${cotizacion.id}`, values, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (res.status === 200) {
        toast.success(res.data.message)
        router.push('/sistema/cotizacion')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al editar cotización')
    } finally {
      setLoading(false)
    }
  }

  const {
    values,
    setFieldValue,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,

  } = useFormik<CotizacionAgregarInterface>({
    initialValues: {
      descripcion: cotizacion.descripcion,
      precio_total: cotizacion.precio_total,
      fecha_inicial: parseDate(cotizacion.fecha_inicial),
      fecha_final: parseDate(cotizacion.fecha_final),
      id_cliente: cotizacion.id_cliente,
      dias: cotizacion.dias,

      cotizaciones: cotizacion.cotizaciones,
    },
    validationSchema: CotizacionAgregarSchema,
    onSubmit: agregar,
  })

  useEffect(() => {
    setFieldValue('dias', calcularDiasEntreFechas(values.fecha_inicial, values.fecha_final))
  }, [values.fecha_inicial, values.fecha_final])

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
        {/* Header */}
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

        <Formik initialValues={initialValues} onSubmit={agregar} className="w-full">
          <form action="w-full" onSubmit={handleSubmit}>
            <div className="w-full mb-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                type="text"
                label="Descripción"
                name="descripcion"
                value={values.descripcion}
                error={errors.descripcion}
                touched={touched.descripcion}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <BuscarCliente
                apiUrl="buscarCliente"
                onClienteSelect={(cliente) => {
                  setFieldValue('id_cliente', cliente.id)
                }}
                nombreCliente={cotizacion.cliente?.nombre}
              />

              <Input
                type="date"
                label="Fecha Inicial"
                name="fecha_inicial"
                value={values.fecha_inicial}
                error={errors.fecha_inicial}
                touched={touched.fecha_inicial}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Input
                type="date"
                label="Fecha Final"
                name="fecha_final"
                value={values.fecha_final}
                error={errors.fecha_final}
                touched={touched.fecha_final}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Input
                type="number"
                label="Días"
                disabled
                name="dias"
                value={values.dias}
                error={errors.dias}
                touched={touched.dias}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Input
                type="number"
                label="Total"
                disabled
                name="precio_total"
                value={values.precio_total}
                error={errors.precio_total}
                touched={touched.precio_total}
                onChange={handleChange}
                onBlur={handleBlur}
              />

            </div>

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
              className="px-4 py-2 bg-primary mt-10 text-white rounded-xl cursor-pointer hover:bg-secondary duration-300 transition-all"
              type="submit"
            >
              Editar Cotización
            </button>
          </form>
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
  servicios
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
  servicios: ServicioInterface[] | null
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
  }, [values.cotizaciones[index].cantidad, values.cotizaciones[index].precio_unit])

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
        <Input
          name={`cotizaciones.${index}.descripcion`}
          value={values.cotizaciones[index].descripcion}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Descripción"
        />

        <Input
          name={`cotizaciones.${index}.cantidad`}
          value={values.cotizaciones[index].cantidad}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Cantidad"
        />

        <Input
          name={`cotizaciones.${index}.costo_directo`}
          value={values.cotizaciones[index].costo_directo}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Costo Directo"
          disabled
        />

        <Input
          name={`cotizaciones.${index}.gg`}
          value={values.cotizaciones[index].gg}
          onChange={handleChange}
          onBlur={handleBlur}
          label="GG"
          disabled
        />

        <Input
          name={`cotizaciones.${index}.utilidad`}
          value={values.cotizaciones[index].utilidad}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Utilidad"
          disabled
        />

        <Input
          name={`cotizaciones.${index}.precio_unit`}
          value={values.cotizaciones[index].precio_unit}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Precio Unitario"
          disabled
        />

        <Input
          name={`cotizaciones.${index}.precio_total`}
          value={values.cotizaciones[index].precio_total}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Precio Total"
          disabled
        />
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
  handleBlur
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
  servicioItem: CotizacionAgregarServicio
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
  }, [values.cotizaciones[indexPadre].servicios[index].horas, values.cotizaciones[indexPadre].servicios[index].costo])

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

  }, [values.cotizaciones?.[indexPadre]?.servicios, indexPadre, setFieldValue]);

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
      <Input
        label={`Descripción`}
        name={`cotizaciones.${indexPadre}.servicios.${index}.descripcion`}
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.cotizaciones[indexPadre].servicios[index].descripcion}

      />
      <Input
        label={`Horas`}
        name={`cotizaciones.${indexPadre}.servicios.${index}.horas`}
        type="number"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.cotizaciones[indexPadre].servicios[index].horas}

      />
      <Input
        label={`Costo`}
        name={`cotizaciones.${indexPadre}.servicios.${index}.costo`}
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.cotizaciones[indexPadre].servicios[index].costo}

      />
      <Input
        label={`Subtotal`}
        name={`cotizaciones.${indexPadre}.servicios.${index}.subtotal`}
        type="number"
        disabled
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.cotizaciones[indexPadre].servicios[index].subtotal}

      />
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
  handleBlur
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
  servicioItem: CotizacionAgregarServicio
}) {

  useEffect(() => {
    setFieldValue(`cotizaciones.${indexPadre}.servicios.${index}.subtotal`, Number(values.cotizaciones[indexPadre].servicios[index].precio_unit) * Number(values.cotizaciones[indexPadre].servicios[index].cantidad))
  }, [values.cotizaciones[indexPadre].servicios[index].cantidad, values.cotizaciones[indexPadre].servicios[index].precio_unit])

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
  }, [values.cotizaciones?.[indexPadre]?.servicios, indexPadre, setFieldValue]);

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
      <Input
        label={`Descripción`}
        name={`cotizaciones.${indexPadre}.servicios.${index}.descripcion`}
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.cotizaciones[indexPadre].servicios[index].descripcion}

      />
      <Input
        label={`Cantidad`}
        name={`cotizaciones.${indexPadre}.servicios.${index}.cantidad`}
        type="number"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.cotizaciones[indexPadre].servicios[index].cantidad}

      />
      <Input
        label={`Precio Unitario`}
        name={`cotizaciones.${indexPadre}.servicios.${index}.precio_unit`}
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.cotizaciones[indexPadre].servicios[index].precio_unit}

      />
      <Input
        label={`Precio Total`}
        name={`cotizaciones.${indexPadre}.servicios.${index}.subTotal`}
        type="number"
        disabled
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.cotizaciones[indexPadre].servicios[index].subtotal}

      />
    </div>
  )
}