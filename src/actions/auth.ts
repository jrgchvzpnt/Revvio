"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Mock local auth validation
  if (email === "admin@revvio.com" && password === "admin123") {
    cookies().set("local_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    redirect("/dashboard");
  } else {
    return { error: "Credenciales inválidas. Usa admin@revvio.com / admin123" };
  }
}

export async function logout() {
  cookies().delete("local_auth");
  redirect("/login");
}
