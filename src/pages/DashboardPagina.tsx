"use client"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { useRouter } from "next/navigation"
import { Clock, DollarSign, Edit, Eye, FileText, MoreHorizontal, Plus, Trash2, TrendingDown, TrendingUp, Users } from "lucide-react"

// Datos de ejemplo
const stats = [
  {
    title: "Cotizaciones Totales",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    title: "Cotizaciones Pendientes",
    value: "89",
    change: "-5%",
    trend: "down",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Clientes Activos",
    value: "456",
    change: "+8%",
    trend: "up",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Valor Total",
    value: "$2.4M",
    change: "+15%",
    trend: "up",
    icon: DollarSign,
    color: "text-purple-600",
  },
]

const recentQuotes: any[] = [
  /*
  {
    id: "COT-001",
    client: "Empresa ABC S.A.",
    amount: "$45,000",
    status: "Pendiente",
    date: "2024-01-15",
    items: 12,
  },
  {
    id: "COT-002",
    client: "Corporación XYZ",
    amount: "$78,500",
    status: "Aprobada",
    date: "2024-01-14",
    items: 8,
  },
  {
    id: "COT-003",
    client: "Industrias DEF",
    amount: "$32,200",
    status: "Rechazada",
    date: "2024-01-13",
    items: 15,
  },
  {
    id: "COT-004",
    client: "Comercial GHI",
    amount: "$91,750",
    status: "En Revisión",
    date: "2024-01-12",
    items: 6,
  },
  {
    id: "COT-005",
    client: "Servicios JKL",
    amount: "$56,300",
    status: "Aprobada",
    date: "2024-01-11",
    items: 10,
  },
  */
]

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

export default function DashboardContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  function handleAgregar () {
    router.push('/sistema/cotizacion/agregar')
  }
  
  function handleClientes () {
    router.push('/sistema/clientes')
  }

  function handleCotizaciones () {
    router.push('/sistema/cotizacion')
  }

  // Simular carga de datos
  useState(() => {
    setTimeout(() => setIsLoaded(true), 100)
  })

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
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`transition-all duration-500 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center text-xs text-gray-500">
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
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
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentQuotes.map((quote, index) => (
                  <TableRow
                    key={quote.id}
                    className={`transition-all duration-300 hover:bg-gray-50 ${
                      isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <TableCell className="font-medium text-gray-900">{quote.id}</TableCell>
                    <TableCell className="text-gray-700">{quote.client}</TableCell>
                    <TableCell className="font-semibold text-gray-900">{quote.amount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{quote.date}</TableCell>
                    <TableCell className="text-gray-600">{quote.items} items</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              <Button onClick={handleAgregar} variant="outline" className="h-20 flex-col bg-transparent hover:bg-gray-50 transition-colors">
                <FileText className="h-6 w-6 mb-2 text-blue-600" />
                <span className="text-gray-700">Crear Cotización</span>
              </Button>
              <Button onClick={handleClientes} variant="outline" className="h-20 flex-col bg-transparent hover:bg-gray-50 transition-colors">
                <Users className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-gray-700">Gestionar Clientes</span>
              </Button>
              <Button onClick={handleCotizaciones} variant="outline" className="h-20 flex-col bg-transparent hover:bg-gray-50 transition-colors">
                <TrendingUp className="h-6 w-6 mb-2 text-purple-600" />
                <span className="text-gray-700">Ver Reportes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
