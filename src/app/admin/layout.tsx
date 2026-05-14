import AdminLayoutClient from "./AdminLayoutClient";
import "./admin.css";
import "./dashboard.css";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Admin Portal | UniDrive",
  description: "UniDrive Fleet and Appointment Management",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}
