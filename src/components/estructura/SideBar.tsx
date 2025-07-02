"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Users, Home, ShoppingCart, BarChart3, 
  // Settings, 
  LogOut, ChevronRight, LucideProps } from "lucide-react"
import Link from "next/link"
import { ForwardRefExoticComponent, RefAttributes, useState } from "react"
import LogosPeru from "@/assets/logoIcon.webp"


interface SidebarProps {
  activeItem: string
  setActiveItem: (item: string) => void
  isMobile: boolean
}

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
  // { id: "configuracion", label: "Configuración", icon: Settings, href: '/sistema/configuracion' },
]

export default function Sidebar({ activeItem, setActiveItem, isMobile }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (isMobile) {
    return (
      <>
        {/* Mobile Sidebar Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-10 right-4 z-50 lg:hidden w-12 h-12 bg-gradient-to-tr from-[#576CBC] to-[#A5D7E8] rounded-xl flex items-center justify-center shadow-lg"
        >
          <img src={LogosPeru.src} alt="ww" width={34} height={34} />
        </motion.button>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileOpen(false)}
              />

              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -400 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-[#0B2447] via-[#19376D] to-[#0B2447] z-50 shadow-2xl"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="p-6 border-b border-[#576CBC]/30">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-12 h-12 bg-gradient-to-tr from-[#576CBC] to-[#A5D7E8] rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="w-7 h-7 text-[#0B2447]" />
                      </div>
                      <div>
                        <h1 className="text-[#A5D7E8] font-bold text-xl">Mi Dashboard</h1>
                        <p className="text-[#A5D7E8]/60 text-sm">Panel de Control</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                      {menuItems.map((item, index) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => {
                              setActiveItem(item.id)
                              setMobileOpen(false)
                            }}
                            className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                              activeItem === item.id
                                ? "bg-gradient-to-r from-[#576CBC] to-[#A5D7E8] text-[#0B2447] shadow-lg transform scale-105"
                                : "text-[#A5D7E8] hover:bg-[#576CBC]/20 hover:text-[#A5D7E8] hover:transform hover:scale-105"
                            }`}
                          >
                            <item.icon className="w-6 h-6" />
                            <span className="font-medium text-lg">{item.label}</span>
                            {activeItem === item.id && (
                              <motion.div layoutId="mobile-active-indicator" className="ml-auto">
                                <ChevronRight className="w-5 h-5" />
                              </motion.div>
                            )}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>

                  {/* Mobile Logout */}
                  <div className="p-4 border-t border-[#576CBC]/30">
                    <button className="w-full flex items-center space-x-4 px-4 py-4 text-[#A5D7E8] hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-300">
                      <LogOut className="w-6 h-6" />
                      <span className="font-medium text-lg">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <motion.div
      initial={false}
      animate={{
        width: isExpanded ? 280 : 80,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed left-0 top-0 h-full bg-primary z-30 shadow-2xl border-r border-[#576CBC]/30"
    >
      <div className="flex flex-col h-full">
        {/* Desktop Logo */}
        <div className="p-4 border-b border-[#576CBC]/30">
          <motion.div
            className="flex items-center space-x-3"
            animate={{
              justifyContent: isExpanded ? "flex-start" : "center",
            }}
          >
            <motion.div
              className="w-12 h-12 bg-gradient-to-tr from-[#576CBC] to-[#A5D7E8] rounded-xl flex items-center justify-center shadow-lg"
            >
              <img src={LogosPeru.src} alt="" width={34} height={34} />
            </motion.div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-[#A5D7E8] font-bold text-xl whitespace-nowrap">Mi Dashboard</h1>
                  <p className="text-[#A5D7E8]/60 text-sm whitespace-nowrap">Panel de Control</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-3">
            {menuItems.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    activeItem === item.id
                      ? "bg-gradient-to-r from-[#576CBC] to-[#A5D7E8] text-[#0B2447] shadow-lg"
                      : "text-[#A5D7E8] hover:bg-[#576CBC]/20 hover:text-[#A5D7E8]"
                  }`}
                >
                  {/* Active indicator */}
                  {activeItem === item.id && (
                    <motion.div
                      layoutId="desktop-active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#0B2447] rounded-r-full"
                    />
                  )}

                  <motion.div
                    animate={{
                      justifyContent: isExpanded ? "flex-start" : "center",
                    }}
                    className="flex items-center space-x-4 w-full"
                  >
                    <item.icon className="w-6 h-6 flex-shrink-0" />

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {activeItem === item.id && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-auto"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#576CBC]/10 to-[#A5D7E8]/10 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute left-20 top-1/2 transform -translate-y-1/2 bg-[#19376D] text-[#A5D7E8] px-3 py-2 rounded-lg shadow-lg border border-[#576CBC]/30 whitespace-nowrap pointer-events-none z-50"
                  >
                    {item.label}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#19376D] rotate-45 border-l border-b border-[#576CBC]/30"></div>
                  </motion.div>
                )}
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Desktop Logout */}
        <div className="p-4 border-t border-[#576CBC]/30">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center space-x-4 px-4 py-3 text-[#A5D7E8] hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-300 relative overflow-hidden"
          >
            <motion.div
              animate={{
                justifyContent: isExpanded ? "flex-start" : "center",
              }}
              className="flex items-center space-x-4 w-full"
            >
              <LogOut className="w-6 h-6 flex-shrink-0" />

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium whitespace-nowrap"
                  >
                    Cerrar Sesión
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-red-500/10 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          {/* Logout tooltip for collapsed state */}
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute left-20 bottom-8 bg-[#19376D] text-[#A5D7E8] px-3 py-2 rounded-lg shadow-lg border border-[#576CBC]/30 whitespace-nowrap pointer-events-none z-50"
            >
              Cerrar Sesión
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#19376D] rotate-45 border-l border-b border-[#576CBC]/30"></div>
            </motion.div>
          )}
        </div>

        {/* Expand indicator */}
        <motion.div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-8 bg-[#576CBC] rounded-r-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.2 }}
        >
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronRight className="w-3 h-3 text-[#A5D7E8]" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
