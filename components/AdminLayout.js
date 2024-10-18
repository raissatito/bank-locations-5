import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <aside className="w-64 bg-gray-800 p-6">
        <nav
          className="navbar text-primary-content px-4 py-2"
          style={{ backgroundColor: "#dc3545" }}
        >
          <div className="flex items-center gap-4">
            <Image
              src="https://www.cimbniaga.co.id/content/dam/cimb/logo/Logo%20CIMB%20white.svg"
              alt="Logo"
              width={200}
              height={100}
            />
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
          </div>
        </nav>
      </aside>
      <main className="p-8">{children}</main>
    </div>
  );
}
