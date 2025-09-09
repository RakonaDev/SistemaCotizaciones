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
import { FieldArray, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { Delete, Plus, Trash, X } from "lucide-react";
import { motion } from "motion/react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function AgregarCotizacion({ serviciosData }: { serviciosData: ServicioInterface[] }) {
  const [servicios] = useState<ServicioInterface[] | null>(serviciosData);
  const router = useRouter();
  const { setLoading } = useLoading();

  const initialValues: CotizacionAgregarInterface = {
    descripcion: '',
    precio_total: 0,
    fecha_inicial: '',
    fecha_final: '',
    id_cliente: 0,
    dias: 0,
    cotizaciones: [],
  };

  const handleSubmit = async (values: CotizacionAgregarInterface, { setSubmitting }: any) => {
    try {
      setLoading(true);
      console.log('VALORES', values);
      
      if (values.cotizaciones.length === 0) {
        toast.error('Al menos debe haber 1 costeo');
        return;
      }

      const res = await axios.post(`${Global.api}/cotizaciones`, values, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.status === 201) {
        toast.success(res.data.message);
        router.push('/sistema/cotizacion');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error al agregar cotización');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
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
      </motion.div>

      <Formik
        initialValues={initialValues}
        validationSchema={CotizacionAgregarSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, resetForm }) => (
          <Form className="w-full">
            {/* Header buttons */}
            <div className="flex gap-3 mb-6 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => resetForm()}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white font-semibold hover:bg-red-600 rounded-lg transition-all duration-300"
              >
                <Delete className="w-5 h-5" />
                <span>Reiniciar Formulario</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                type="button"
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white font-semibold hover:bg-secondary rounded-lg transition-all duration-300"
                onClick={() => {
                  const newCotizacion: CotizacionCajaAgregar = {
                    cantidad: 1,
                    descripcion: '',
                    gg: 0,
                    id: nanoid(8),
                    precio_total: 0,
                    precio_unit: 0,
                    utilidad: 0,
                    servicios: [],
                    costo_directo: 0
                  };
                  setFieldValue('cotizaciones', [...values.cotizaciones, newCotizacion]);
                }}
              >
                <Plus className="w-5 h-5" />
                <span>Agregar Costeo</span>
              </motion.button>
            </div>

            {/* Main form section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6"
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField label="Asunto" error={touched.descripcion ? errors.descripcion : undefined} required>
                  <Input
                    type="text"
                    name="descripcion"
                    value={values.descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!(touched.descripcion && errors.descripcion)}
                  />
                </FormField>

                <BuscarCliente
                  apiUrl="buscarCliente"
                  onClienteSelect={(cliente) => {
                    setFieldValue('id_cliente', cliente.id);
                  }}
                  nombreCliente=""
                />

                <FormField label="Fecha Inicial" error={touched.fecha_inicial ? errors.fecha_inicial : undefined} required>
                  <Input
                    name="fecha_inicial"
                    type="date"
                    value={values.fecha_inicial}
                    onChange={(e) => {
                      handleChange(e);
                      // Auto-calculate days when dates change
                      if (values.fecha_final) {
                        setFieldValue('dias', calcularDiasEntreFechas(e.target.value, values.fecha_final));
                      }
                    }}
                    onBlur={handleBlur}
                    error={!!(touched.fecha_inicial && errors.fecha_inicial)}
                  />
                </FormField>

                <FormField label="Fecha Final" error={touched.fecha_final ? errors.fecha_final : undefined} required>
                  <Input
                    type="date"
                    name="fecha_final"
                    value={values.fecha_final}
                    error={!!(touched.fecha_final && errors.fecha_final)}
                    onChange={(e) => {
                      handleChange(e);
                      // Auto-calculate days when dates change
                      if (values.fecha_inicial) {
                        setFieldValue('dias', calcularDiasEntreFechas(values.fecha_inicial, e.target.value));
                      }
                    }}
                    onBlur={handleBlur}
                  />
                </FormField>

                <FormField label="Días" error={touched.dias ? errors.dias : undefined} required>
                  <Input
                    type="number"
                    disabled
                    name="dias"
                    value={values.dias}
                    error={!!(touched.dias && errors.dias)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>

                <FormField label="Precio Total" error={touched.precio_total ? errors.precio_total : undefined} required>
                  <Input
                    type="number"
                    disabled
                    name="precio_total"
                    value={values.precio_total}
                    error={!!(touched.precio_total && errors.precio_total)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>
              </div>
            </motion.section>

            {/* Cotizaciones array */}
            <FieldArray
              name="cotizaciones"
              render={() => (
                <div className="space-y-6">
                  {values.cotizaciones.map((cotizacion, index) => (
                    <CotizacionCajaForm
                      key={cotizacion.id}
                      cotizacion={cotizacion}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      servicios={servicios}
                      setFieldValue={setFieldValue as any}
                      values={values}
                      index={index}
                      errors={errors}
                      touched={touched}
                    />
                  ))}
                </div>
              )}
            />

            {/* Submit button */}
            <button
              className="px-4 mt-10 py-2 bg-primary text-white rounded-xl cursor-pointer hover:bg-secondary duration-300 transition-all"
              type="submit"
            >
              Registrar Cotización
            </button>
          </Form>
        )}
      </Formik>
    </div>
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
  errors,
  touched
}: {
  cotizacion: CotizacionCajaAgregar;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void> | Promise<FormikErrors<CotizacionAgregarInterface>>;
  values: CotizacionAgregarInterface;
  index: number;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  };
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  servicios: ServicioInterface[] | null;
  errors: FormikErrors<CotizacionAgregarInterface>;
  touched: FormikTouched<CotizacionAgregarInterface>;
}) {
  const [verServicios, setVerServicios] = useState(false);

  const cambiarEstado = () => {
    setVerServicios(!verServicios);
  };

  const borrarCosteo = () => {
    setFieldValue('cotizaciones', values.cotizaciones.filter((cotizacionI) => cotizacionI.id !== cotizacion.id));
  };

  // Auto-calculate precio_total when cantidad or precio_unit changes
  useEffect(() => {
    const cantidad = values.cotizaciones[index]?.cantidad || 0;
    const precioUnit = values.cotizaciones[index]?.precio_unit || 0;
    setFieldValue(`cotizaciones.${index}.precio_total`, cantidad * precioUnit);
  }, [values.cotizaciones[index]?.cantidad, values.cotizaciones[index]?.precio_unit, index, setFieldValue]);

  // Auto-calculate main cotizacion precio_total when all cotizaciones change
  useEffect(() => {
    const total = values.cotizaciones.reduce(
      (acc: number, cot) => acc + (cot.precio_total || 0),
      0
    );
    setFieldValue('precio_total', total);
  }, [values.cotizaciones, setFieldValue]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl text-primary">
          {values.cotizaciones[index]?.descripcion || 'Coloca un Nombre'}
        </h2>

        <section className="flex gap-3 items-center">
          <button
            type="button"
            onClick={cambiarEstado}
            className={`${
              verServicios 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-primary hover:bg-secondary'
            } text-white rounded-xl cursor-pointer font-medium px-4 py-2 transition-all duration-300`}
          >
            {verServicios ? 'Ocultar Servicios' : 'Mostrar Servicios'}
          </button>

          <button
            type="button"
            onClick={borrarCosteo}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl cursor-pointer font-medium px-4 py-2 transition-all duration-300"
          >
            <Trash />
          </button>
        </section>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <FormField 
          label="Descripción" 
          error={touched.cotizaciones?.[index]?.descripcion ? (errors.cotizaciones?.[index] as FormikErrors<CotizacionCajaAgregar>)?.descripcion : undefined} 
          required
        >
          <Input
            name={`cotizaciones.${index}.descripcion`}
            value={values.cotizaciones[index]?.descripcion || ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormField>

        <FormField label="Cantidad" required>
          <Input
            type="number"
            name={`cotizaciones.${index}.cantidad`}
            value={values.cotizaciones[index]?.cantidad || 0}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormField>

        <FormField label="Costo Directo" required>
          <Input
            type="number"
            name={`cotizaciones.${index}.costo_directo`}
            value={values.cotizaciones[index]?.costo_directo || 0}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
          />
        </FormField>

        <FormField label="GG (%)" required>
          <Input
            type="number"
            name={`cotizaciones.${index}.gg`}
            value={values.cotizaciones[index]?.gg || 0}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
          />
        </FormField>

        <FormField label="Utilidad (%)" required>
          <Input
            type="number"
            name={`cotizaciones.${index}.utilidad`}
            value={values.cotizaciones[index]?.utilidad || 0}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
          />
        </FormField>

        <FormField label="Precio Unitario" required>
          <Input
            type="number"
            name={`cotizaciones.${index}.precio_unit`}
            value={values.cotizaciones[index]?.precio_unit || 0}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
          />
        </FormField>

        <FormField label="Precio Total" required>
          <Input
            type="number"
            name={`cotizaciones.${index}.precio_total`}
            value={values.cotizaciones[index]?.precio_total || 0}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
          />
        </FormField>
      </div>

      {verServicios && (
        <div className="flex flex-col gap-6 mt-6">
          {servicios?.map((servicio, indexS) => (
            <div key={servicio.id} className="border-t pt-6">
              <div className="w-full flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-secondary">
                  {indexS + 1}. {servicio.nombre}
                </h3>
                <button
                  className="cursor-pointer bg-primary text-white p-2 rounded-lg hover:bg-secondary transition-all duration-300"
                  onClick={() => {
                    const newServicio: CotizacionAgregarServicio = {
                      id: nanoid(7),
                      servicioId: servicio.id,
                      descripcion: '',
                      subtotal: 0,
                      horas: 0,
                      costo: 0,
                      cantidad: 0,
                      precio_unit: 0,
                      tipo: servicio.tipo
                    };
                    
                    const currentServicios = values.cotizaciones[index]?.servicios || [];
                    setFieldValue(`cotizaciones.${index}.servicios`, [...currentServicios, newServicio]);
                  }}
                  type="button"
                >
                  <Plus />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {values.cotizaciones[index]?.servicios
                  ?.filter(servicioItem => servicioItem.servicioId === servicio.id)
                  .map((servicioItem) => {
                    const realIndex = values.cotizaciones[index].servicios.findIndex(s => s.id === servicioItem.id);
                    
                    if (servicioItem.tipo === 'AREA') {
                      return (
                        <AreaForm
                          key={servicioItem.id}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          index={realIndex}
                          servicioItem={servicioItem}
                          setFieldValue={setFieldValue}
                          values={values}
                          indexPadre={index}
                          errors={errors}
                          touched={touched}
                        />
                      );
                    } else if (servicioItem.tipo === 'SERVICIO') {
                      return (
                        <ServicioForm
                          key={servicioItem.id}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          index={realIndex}
                          indexPadre={index}
                          servicioItem={servicioItem}
                          setFieldValue={setFieldValue}
                          values={values}
                          errors={errors}
                          touched={touched}
                        />
                      );
                    }
                    return null;
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function AreaForm({
  setFieldValue,
  values,
  servicioItem,
  index,
  indexPadre,
  handleChange,
  handleBlur,
  errors,
  touched
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
  errors: FormikErrors<CotizacionAgregarInterface>,
  touched: FormikTouched<CotizacionAgregarInterface>,
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
        error={touched.cotizaciones?.[indexPadre].servicios?.[index].descripcion ? ((errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).descripcion : undefined}
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

      <FormField label="Unidad de Medida" error={touched.cotizaciones?.[indexPadre].servicios?.[index].horas ? ((errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).horas : undefined} required>
        <Input
          label={`Horas`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.horas`}
          type="number"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].horas}

        />
      </FormField>

      <FormField label="Costo" error={touched.cotizaciones?.[indexPadre].servicios?.[index].costo ? ((errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).costo : undefined} required>
        <Input
          label={`Costo`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.costo`}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].costo}

        />
      </FormField>

      <FormField label="Subtotal" error={touched.cotizaciones?.[indexPadre].servicios?.[index].subtotal ? ((errors.cotizaciones?.[indexPadre] as FormikErrors<CotizacionCajaAgregar>).servicios?.[index] as FormikErrors<CotizacionAgregarServicio>).subtotal : undefined} required>
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
  errors,
  touched
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
  errors: FormikErrors<CotizacionAgregarInterface>,
  touched: FormikTouched<CotizacionAgregarInterface>,
}) {
  console.log(errors)
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
  console.log(touched)
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
      <FormField label="Descripción" error={''} required>
        <Input
          label={`Descripción`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.descripcion`}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].descripcion}
        />
      </FormField>

      <FormField label="Cantidad" error={''} required>
        <Input
          label={`Cantidad`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.cantidad`}
          type="number"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].cantidad}

        />
      </FormField>

      <FormField label="Precio Unitario" error={''} required>
        <Input
          label={`Precio Unitario`}
          name={`cotizaciones.${indexPadre}.servicios.${index}.precio_unit`}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.cotizaciones[indexPadre].servicios[index].precio_unit}
        />
      </FormField>

      <FormField label="Precio Total" error={undefined} required>
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
