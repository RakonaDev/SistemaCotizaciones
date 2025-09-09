import { apiArchivo } from "@/axios/apiArchivo";
import { Global } from "@/database/Global";
import { Table } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface BotonExportarProps {
  path: string
  nombreArchivo: string
}

export default function BotonExportar({ path, nombreArchivo }: BotonExportarProps) {
  
  const exportarExcel = async () => {
    try {
      const response = await apiArchivo.get(`${Global.api}/${path}`)

      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crea un enlace temporal para la descarga
      const link = document.createElement('a');
      link.href = url;


      link.setAttribute('download', `${nombreArchivo}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log('Descarga iniciada exitosamente.');

    } catch (err) {
      console.log(err)
      toast.error('Error en el servidor en la exportación en excel')
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={exportarExcel}
      className="mt-4 sm:mt-0 md:w-fit w-full flex justify-center items-center space-x-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:from-[#A5D7E8] hover:to-[#576CBC] transition-all duration-300"
    >
      <Table />
      <span>Exportar a Excel</span>
    </motion.button>
  )
}