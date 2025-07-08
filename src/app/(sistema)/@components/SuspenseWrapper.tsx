'use client'

import Loading1 from "@/components/loadings/Loading1"
import Loading2 from "@/components/loadings/Loading2"
import { useLoading } from "@/zustand/useLoading"
import { Suspense } from "react"

export default function SuspenseWrapper({ children }: { children: React.ReactNode }) {

  const { loading } = useLoading()

  return (
    <>
      {loading && <Loading2 />}
      <Suspense fallback={<Loading1 />}>
        {children}
      </Suspense>
    </>
  )
}