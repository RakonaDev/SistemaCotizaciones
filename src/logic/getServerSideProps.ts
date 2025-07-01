
'use server'

import { Global } from "@/database/Global";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function getServerSideProps(url: string) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("jwt_token")?.value;
  try {
    const res = await fetch(`${Global.api}/${url}`, {
      cache: "no-store",

      headers: {
        'Authorization': `Bearer ${token}`,
        Cookie: `token=${token}`,
      },
    });
    if (!res.ok) {
      console.log(await res.text())
      throw new Error("Failed to fetch data");
    }
    if (res.status === 401) {
      redirect('/login')
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return;
    }
    const data = await res.json();
    // console.log("DATA: ", data);
    return data;
  } catch (error) {
    console.log(error);
  }
}