import { CotizacionGeneralInterface } from "@/database/interfaces/CotizacionGeneralInterface"
import { Calendar, Clock, DollarSign, FileText, User, X } from "lucide-react"
import { AnimatePresence } from "motion/react"
import { motion } from "motion/react"

interface CotizacionModalProps {
  isOpen: boolean
  onClose: () => void
  cotizacion: CotizacionGeneralInterface | null
}

export default function CotizacionModal ({ 
  isOpen,
  cotizacion,
  onClose
}: CotizacionModalProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
            className="relative w-full max-w-2xl bg-white border border-[#576CBC]/30 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#576CBC]/30">
              <h2 className="text-xl font-bold text-secondary">
                Ver Cotizacion
              </h2>
              <button onClick={onClose} className="text-secondary/70 hover:text-terciary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {cotizacion && (
                <div className="p-6 space-y-6">
                  {/* Información General */}
                  <div className="bg-gradient-to-r from-[#576CBC]/5 to-[#19A7CE]/5 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Información General
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-secondary/70">Descripción</label>
                          <p className="text-secondary font-medium">{cotizacion.descripcion}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-secondary/70 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Cliente
                          </label>
                          <p className="text-secondary font-medium">
                            {cotizacion.cliente?.nombre || `Cliente ID: ${cotizacion.id_cliente}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-secondary/70 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Fecha Inicial
                          </label>
                          <p className="text-secondary font-medium">{formatDate(cotizacion.fecha_inicial)}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-secondary/70 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Fecha Final
                          </label>
                          <p className="text-secondary font-medium">{formatDate(cotizacion.fecha_final)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-medium text-secondary/70 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Días de Entrega
                        </label>
                        <p className="text-secondary font-medium">{cotizacion.dias_entrega} días</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-secondary/70 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Monto Total
                        </label>
                        <p className="text-xl font-bold text-primary">{formatCurrency(cotizacion.monto_total)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cotizaciones */}
                  {cotizacion.cotizaciones && cotizacion.cotizaciones.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-secondary mb-4">Cotizaciones</h3>
                      
                      <div className="space-y-4">
                        {cotizacion.cotizaciones.map((cot, index) => (
                          <div key={cot.id} className="border border-[#576CBC]/20 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-secondary">Cotización #{index + 1}</h4>
                              <h4 className="font-semibold text-secondary">- {cot.descripcion} -</h4>
                              <div className="text-right">
                                <p className="font-bold text-primary">{formatCurrency(cot.total_cotizaciones)}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="text-sm font-medium text-secondary/70">Costo Directo</label>
                                <p className="text-secondary">{cot.costo_directo}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-secondary/70">Cantidad</label>
                                <p className="text-secondary">{cot.cantidad}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-secondary/70">GG (%)</label>
                                <p className="text-secondary">{cot.gg}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-secondary/70">Utilidad (%)</label>
                                <p className="text-secondary">{cot.utilidad}</p>
                              </div>
                            </div>

                            {/* Detalles */}
                            {cot.detalles && cot.detalles.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-medium text-secondary mb-3">Detalles de Servicios</h5>
                                <div className="space-y-3">
                                  {cot.detalles.map((detalle) => (
                                    <div key={detalle.id} className="bg-gray-50 rounded-lg p-3">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                          <p className="font-medium text-secondary">{detalle.descripcion}</p>
                                          {detalle.servicio && (
                                            <p className="text-sm text-secondary/70">
                                              Servicio: {detalle.servicio.nombre || `ID: ${detalle.id_servicio}`}
                                            </p>
                                          )}
                                        </div>
                                        <p className="font-semibold text-primary ml-4">
                                          {formatCurrency(detalle.precio_total)}
                                        </p>
                                      </div>

                                      {/* Cajas/Elementos */}
                                      {detalle.cajas && detalle.cajas.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                          <p className="text-sm font-medium text-secondary/70 mb-2">Elementos:</p>
                                          <div className="space-y-2">
                                            {detalle.cajas.map((caja) => (
                                              <div key={caja.id} className="flex justify-between items-center text-sm">
                                                <div className="flex-1">
                                                  {caja.cantidad && caja.precio_unitario ? (
                                                    <p>
                                                      Cantidad: {caja.cantidad} × {formatCurrency(caja.precio_unitario)}
                                                    </p>
                                                  ) : caja.horas_habiles && caja.hora_habil_costo ? (
                                                    <p>
                                                      Horas: {caja.horas_habiles}h × {formatCurrency(caja.hora_habil_costo)}/h
                                                    </p>
                                                  ) : (
                                                    <p>Elemento personalizado</p>
                                                  )}
                                                </div>
                                                <p className="font-medium text-secondary">
                                                  {formatCurrency(caja.total)}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}