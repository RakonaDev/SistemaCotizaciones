"use client"

import { motion } from "framer-motion"
import { User, Settings, LogOut } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="bg-primary backdrop-blur-lg border-b border-[#576CBC]/30 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-[#A5D7E8]"
          >
            {title}
          </motion.h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <button className="relative text-[#A5D7E8] hover:text-[#576CBC] transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button> */}

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 text-[#A5D7E8] hover:text-[#576CBC] transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-[#576CBC] to-[#A5D7E8] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#0B2447]" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">Juan Pérez</p>
                <p className="text-xs text-[#A5D7E8]/70">Administrador</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-[#19376D] border border-[#576CBC]/30 rounded-lg shadow-xl z-50"
              >
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-[#A5D7E8] hover:bg-[#576CBC]/20 transition-colors">
                    <User className="w-4 h-4" />
                    <span>Mi Perfil</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-[#A5D7E8] hover:bg-[#576CBC]/20 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Configuración</span>
                  </button>
                  <hr className="my-2 border-[#576CBC]/30" />
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/20 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
