
'use server'

import Dashboard from "./@components/DashboardComp";
import SuspenseWrapper from "./@components/SuspenseWrapper";

export default async function SistemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SuspenseWrapper>
        <Dashboard >
          {children}
        </Dashboard>
      </SuspenseWrapper>
    </>
  )
}