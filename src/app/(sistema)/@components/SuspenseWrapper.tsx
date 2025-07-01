'use client'

import Loading1 from "@/components/loadings/Loading1"
import { Suspense } from "react"

export default function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loading1 />}>
      {children}
    </Suspense>
  )
}