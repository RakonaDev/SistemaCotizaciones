"use client"

import { useState, useEffect } from "react"
import Header from "@/components/estructura/Header"
import Sidebar from "@/components/estructura/SideBar"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import { BarChart3, Home, LucideProps, ShoppingCart, Users } from "lucide-react"
import { usePathname } from "next/navigation"

interface MenuItems {
  id: string
  label: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
  href: string
}

const menuItems: MenuItems[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: '/sistema/dashboard' },
  { id: "clientes", label: "Clientes", icon: Users, href: '/sistema/clientes' },
  { id: "servicios", label: "Servicios", icon: ShoppingCart, href: '/sistema/servicios' },
  { id: "cotizacion", label: "Cotizacion", icon: BarChart3, href: '/sistema/cotizacion' },
]

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [activeItem, setActiveItem] = useState("clientes")
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    menuItems.forEach((menu) => {
      if (pathname?.startsWith(menu.href)) {
        setActiveItem(menu.id)
      }
    })
  }, [pathname])

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const getPageTitle = () => {
    switch (activeItem) {
      case "dashboard":
        return "Dashboard"
      case "clientes":
        return "Clientes"
      case "servicios":
        return "Servicios"
      case "cotizacion":
        return "Cotizacion"
      case "configuracion":
        return "Configuración"
      default:
        return "Dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} isMobile={isMobile} menuItems={menuItems} />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${!isMobile ? "ml-20" : "ml-0"}`}
        >
          <Header title={getPageTitle()} />

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
