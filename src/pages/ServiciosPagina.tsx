"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Montserrat } from "next/font/google"
import Swal from "sweetalert2"
import axios, { AxiosError } from "axios"
import { Global } from "@/database/Global"
import { toast } from "sonner"
import { ServicioInterface } from "@/database/interfaces/ServicioInterface"
import ServiciosModal from "@/components/forms/ServiciosModal"


const montserrat = Montserrat({
  subsets: ["latin"]
})

export default function ServiciosPage({ servicioData }: { servicioData: ServicioInterface[] }) {
  const [servicios, setServicios] = useState<ServicioInterface[]>(servicioData ?? [])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedServicio, setSelectedCliente] = useState<ServicioInterface | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")

  const itemsPerPage = 10

  // Filtrar servicios
  const filteredClientes = useMemo(() => {
    return servicios.filter(
      (servicio) =>
        servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [servicios, searchTerm])

  // Paginación
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentClientes = filteredClientes.slice(startIndex, endIndex)

  // Funciones CRUD
  const handleCreate = () => {
    setModalMode("create")
    setSelectedCliente(null)
    setIsModalOpen(true)
  }

  const handleEdit = (servicio: ServicioInterface) => {
    setModalMode("edit")
    setSelectedCliente(servicio)
    console.log(servicio)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Estas seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar Cliente"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${Global.api}/servicios/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })
          if (response.status === 200) {
            toast.success(response.data.message)
            setServicios((prev) => prev.filter((servicio) => servicio.id !== id))
          }
        } catch (err) {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data.message ?? 'No puedes ingresar al sistema, inténtelo más tarde')
          } else {
            toast.error('No puedes ingresar al sistema, inténtelo más tarde')
          }
        }
      }
    });
  }

  const handleSave = (servicioData: ServicioInterface) => {
    if (modalMode === "create") {
      
      setServicios((prev) => [...prev, servicioData])
    } else {
      setServicios((prev) =>
        prev.map((servicio) =>
          servicio.id === (servicioData as ServicioInterface).id ? (servicioData as ServicioInterface) : servicio,
        ),
      )
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Gestión de Servicios y Areas</h1>
          <p className="text-primary">Administra tu base de datos de servicios y areas</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:from-[#A5D7E8] hover:to-[#576CBC] transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Servicio</span>
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[#576CBC]/30 rounded-lg text-secondary placeholder-secondary/50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow backdrop-blur-lg rounded-2xl border border-[#576CBC]/30 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`bg-white ${montserrat.className}`} >
              <tr>
                <th className="px-6 py-4 text-left text-gray-600 font-bold">Nombre</th>
                <th className="px-6 py-4 text-left text-gray-600 font-bold hidden xl:table-cell">Tipo</th>
                <th className="px-6 py-4 text-center text-gray-600 font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white p-2">
              {currentClientes.map((servicio, index) => (
                <motion.tr
                  key={servicio.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-t border-slate-200 hover:bg-secondary transition-colors group"
                >
                  <td className="px-6 py-4 group-hover:text-white text-black duration-300 transition-colors">{servicio.nombre}</td>
                  <td className="px-6 py-4 group-hover:text-white text-black duration-300 transition-colors hidden md:table-cell">{servicio.tipo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(servicio)}
                        className="p-2 text-green-400 hover:text-green-500 hover:bg-[#576CBC]/20 rounded-lg transition-all duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(servicio.id)}
                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#576CBC]/20">
            <div className="text-black text-sm">
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredClientes.length)} de {filteredClientes.length}{" "}
              servicios
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-secondary hover:text-[#576CBC] hover:bg-[#576CBC]/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${currentPage === page
                        ? "bg-secondary text-white font-semibold"
                        : "text-secondary hover:bg-[#576CBC]/20"
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-secondary hover:text-[#576CBC] hover:bg-[#576CBC]/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <ServiciosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        servicio={selectedServicio}
        mode={modalMode}
      />
    </div>
  )
}
