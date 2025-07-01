"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Logo from "@/assets/logo.webp"
import { useFormik } from "formik"
import { LoginForm } from "@/database/schema/LoginSchema"
import axios, { AxiosError } from "axios"
import { Global } from "@/database/Global"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [showLogin, setShowLogin] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const {
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: {
            email: "administrador@cotizaciones.com",
            password: "Sistemas2025",
        },
        validationSchema: LoginForm,
        onSubmit: async (values) => {
            if (isLoading) return
            setIsLoading(true)
            try {
                const response = await axios.post(`${Global.api}/login`, values, {
                    withCredentials: true,
                })
                if (response.status === 200) {
                    toast.success(response.data.message)
                    localStorage.setItem('token', response.data.token)
                    router.push('/sistema/dashboard')
                } else {
                    throw new Error()
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    toast.error(err.response?.data.message ?? 'No puedes ingresar al sistema, inténtelo más tarde')
                } else {
                    toast.error('No puedes ingresar al sistema, inténtelo más tarde')
                }
            } finally {
                setIsLoading(false)
            }
        }
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLogin(true)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B2447] via-[#19376D] to-[#576CBC] flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {!showLogin ? (
                    // Logo Screen
                    <motion.div
                        key="logo"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="flex flex-col items-center justify-center text-center"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                duration: 1.2,
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 100,
                            }}
                            className="w-32 h-32 bg-gradient-to-tr from-[#576CBC] to-[#A5D7E8] rounded-full flex items-center justify-center mb-8 shadow-2xl"
                        >
                            <img src={Logo.src} alt="" className="w-20" />
                        </motion.div>

                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-4xl font-bold text-[#A5D7E8] mb-4"
                        >
                            Bienvenido a Nuestro Sistema
                        </motion.h1>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100px" }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="h-1 bg-gradient-to-r from-[#576CBC] to-[#A5D7E8] rounded-full"
                        />

                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                            className="text-white mt-4"
                        >
                            Realizado por Logos Perú
                        </motion.div>
                    </motion.div>
                ) : (
                    // Login Form
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 100,
                        }}
                        className="w-full max-w-md"
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="bg-[#19376D]/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-[#576CBC]/30 p-8"
                        >
                            {/* Header */}
                            <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-center mb-8"
                            >
                                <div className="w-16 h-16 bg-gradient-to-tr from-[#576CBC] to-[#A5D7E8] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-[#0B2447]" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#A5D7E8] mb-2">Bienvenido</h2>
                                <p className="text-[#A5D7E8]/70">Inicia sesión en tu cuenta</p>
                            </motion.div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <label className="block text-[#A5D7E8] text-sm font-medium mb-2">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A5D7E8]/50" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full pl-12 pr-4 py-3 bg-[#0B2447]/50 border border-[#576CBC]/30 rounded-lg text-[#A5D7E8] placeholder-[#A5D7E8]/50 focus:outline-none focus:border-[#A5D7E8] focus:ring-2 focus:ring-[#A5D7E8]/20 transition-all duration-300"
                                            placeholder="tu@email.com"
                                            required
                                            autoComplete="off"
                                        />
                                    </div>
                                    {
                                        errors.email && touched.email && (
                                            <span className="text-xs text-red-300 italic">{errors.email}</span>
                                        )
                                    }
                                </motion.div>

                                {/* Password Field */}
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
                                    <label className="block text-[#A5D7E8] text-sm font-medium mb-2">Contraseña</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A5D7E8]/50" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full pl-12 pr-12 py-3 bg-[#0B2447]/50 border border-[#576CBC]/30 rounded-lg text-[#A5D7E8] placeholder-[#A5D7E8]/50 focus:outline-none focus:border-[#A5D7E8] focus:ring-2 focus:ring-[#A5D7E8]/20 transition-all duration-300"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A5D7E8]/50 hover:text-[#A5D7E8] transition-colors duration-200"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {
                                        errors.password && touched.password && (
                                            <span className="text-xs text-red-300 italic">{errors.password}</span>
                                        )
                                    }
                                </motion.div>

                                {/* Submit Button */}
                                {/* <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-3 bg-white text-[#0B2447] font-semibold rounded-lg hover:bg-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:text-white"
                                >
                                    Iniciar Sesión
                                </motion.button> */}
                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden ${isLoading
                                        ? "bg-[#576CBC]/50 cursor-not-allowed"
                                        : "bg-white hover:bg-primary hover:text-white text-primary"
                                        }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {isLoading ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center justify-center text-[#A5D7E8]"
                                            >
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Number.POSITIVE_INFINITY,
                                                        ease: "linear",
                                                    }}
                                                    className="w-5 h-5 border-2 border-[#A5D7E8]/30 border-t-[#A5D7E8] rounded-full mr-3"
                                                />
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    Iniciando sesión...
                                                </motion.span>

                                                {/* Animated dots */}
                                                <motion.div className="flex ml-1">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.span
                                                            key={i}
                                                            animate={{
                                                                opacity: [0.4, 1, 0.4],
                                                                y: [0, -2, 0],
                                                            }}
                                                            transition={{
                                                                duration: 1.2,
                                                                repeat: Number.POSITIVE_INFINITY,
                                                                delay: i * 0.2,
                                                                ease: "easeInOut",
                                                            }}
                                                            className="w-1 h-1 bg-[#A5D7E8] rounded-full mx-0.5"
                                                        />
                                                    ))}
                                                </motion.div>
                                            </motion.div>
                                        ) : (
                                            <motion.span
                                                key="text"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}

                                            >
                                                Iniciar Sesión
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Loading background animation */}
                                    {isLoading && (
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Number.POSITIVE_INFINITY,
                                                ease: "easeInOut",
                                            }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#A5D7E8]/20 to-transparent"
                                        />
                                    )}
                                </motion.button>

                                <motion.div
                                    initial={{ y: 60, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="text-center text-[#A5D7E8]"
                                >
                                    Realizado por Logos Perú
                                </motion.div>
                            </form>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}