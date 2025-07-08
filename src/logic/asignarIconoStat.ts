import { Stat } from "@/database/interfaces/StatInterface";
import { FileText, Clock, Users, DollarSign } from "lucide-react";


export function asignarIconoYColor(stats: Stat[]): Stat[] {
  const configuracion: Record<string, { icon: any; color: string }> = {
    "Cotizaciones Totales": {
      icon: FileText,
      color: "text-blue-600",
    },
    "Cotizaciones Pendientes": {
      icon: Clock,
      color: "text-orange-600",
    },
    "Clientes Atendidos": {
      icon: Users,
      color: "text-green-600",
    },
    "Valor Total": {
      icon: DollarSign,
      color: "text-purple-600",
    },
  };

  return stats.map((stat) => {
    const config = configuracion[stat.title];
    if (config) {
      return { ...stat, icon: config.icon, color: config.color };
    }
    return stat; // Si no hay coincidencia, se devuelve tal cual
  });
}