"use client"

import { useEffect, useState } from "react"
/*
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  DollarSign,
  Clock,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "@/components/ui/icons"
*/
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { Eye, FileText, Plus, TrendingDown, TrendingUp, Users } from "lucide-react"
import { asignarIconoYColor } from "@/logic/asignarIconoStat"
import { Stat } from "@/database/interfaces/StatInterface"
import { parseDateToTable } from "@/logic/parseDateToTable"
import CotizacionModal from "@/components/forms/cotizacion/CotizacionModal"
import { CotizacionGeneralInterface } from "@/database/interfaces/CotizacionGeneralInterface"



/*
const getStatusColor = (status: string) => {
  switch (status) {
    case "Aprobada":
      return "bg-green-100 text-green-800"
    case "Pendiente":
      return "bg-yellow-100 text-yellow-800"
    case "Rechazada":
      return "bg-red-100 text-red-800"
    case "En Revisión":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
*/
export default function DashboardContent({ stats, dataCotizacion }: { stats: Stat[], dataCotizacion: any[] }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCotizacion, setSelectedCliente] = useState<CotizacionGeneralInterface | null>(null)

  useEffect(() => {
    if (stats.length !== 0) {
      setIsLoaded(true)
    } else {
      setIsLoaded(false)
    }
  }, [stats])

  const handleShow = (cotizacion: CotizacionGeneralInterface) => {
    setSelectedCliente(cotizacion)
    setIsModalOpen(true)
  } 

  function handleAgregar() {
    router.push('/sistema/cotizacion/agregar')
  }

  function handleClientes() {
    router.push('/sistema/clientes')
  }

  function handleCotizaciones() {
    router.push('/sistema/servicios')
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div
        className={`flex items-center justify-between transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Resumen de tu sistema de cotizaciones</p>
        </div>
        <Button onClick={handleAgregar} className="bg-primary hover:bg-secondary transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cotización
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {asignarIconoYColor(stats).map((stat, index) => (
          <div
            key={stat.title}
            className={`transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                {
                  stat.icon && <stat.icon className={`h-4 w-4 ${stat.color}`} />
                }
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center text-xs text-gray-500">
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )
                  }

                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                  <span className="ml-1">desde el mes pasado</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Recent Quotes Table */}
      <div
        className={`transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ transitionDelay: "400ms" }}
      >
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Cotizaciones Recientes</CardTitle>
            <CardDescription>Las últimas cotizaciones creadas en tu sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Monto Total</TableHead>
                  <TableHead>Costeos</TableHead>
                  <TableHead>Fecha Inicial</TableHead>
                  <TableHead>Fecha Final</TableHead>
                  <TableHead>Días de Entrega</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataCotizacion && dataCotizacion.map((quote, index) => (
                  <TableRow
                    key={quote.id}
                    className={` duration-300 hover:bg-gray-200 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      }`}
                    style={{ transitionDelay: `${100 + index * 100}ms` }}
                  >
                    <TableCell className="text-gray-800">{quote.cliente.nombre}</TableCell>
                    <TableCell className=" text-gray-800">$ {quote.monto_total}</TableCell>
                    <TableCell className=" text-gray-800">
                      {quote.cotizaciones.length} costeos
                    </TableCell>
                    <TableCell className="text-gray-800">{parseDateToTable(quote.fecha_inicial)}</TableCell>
                    <TableCell className="text-gray-800">{parseDateToTable(quote.fecha_final)}</TableCell>
                    <TableCell className="text-gray-800">{quote.dias_entrega}</TableCell>
                    <TableCell className="text-center">
                      <div onClick={() => handleShow(quote)} className="bg-blue-200 flex hover:bg-blue-300 cursor-pointer w-fit p-2 rounded-lg text-blue-700">
                        <Eye size={20} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div
        className={`transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ transitionDelay: "600ms" }}
      >
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Acciones Rápidas</CardTitle>
            <CardDescription>Accesos directos a las funciones más utilizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button onClick={handleAgregar} variant="outline" className="cursor-pointer h-20 flex-col bg-transparent hover:bg-slate-100 duration-300 transition-all hover:-translate-y-0.5 translate-0">
                <FileText className="h-6 w-6 mb-2 text-blue-600 " />
                <span className="text-gray-700">Crear Cotización</span>
              </Button>
              <Button onClick={handleClientes} variant="outline" className="cursor-pointer h-20 flex-col bg-transparent hover:bg-slate-100 duration-300 transition-all hover:-translate-y-0.5 translate-0">
                <Users className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-gray-700">Gestionar Clientes</span>
              </Button>
              <Button onClick={handleCotizaciones} variant="outline" className="cursor-pointer h-20 flex-col bg-transparent hover:bg-slate-100 duration-300 transition-all hover:-translate-y-0.5 translate-0">
                <TrendingUp className="h-6 w-6 mb-2 text-purple-600" />
                <span className="text-gray-700">Crear Servicios o Area</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CotizacionModal
        isOpen={isModalOpen}
        cotizacion={selectedCotizacion}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
