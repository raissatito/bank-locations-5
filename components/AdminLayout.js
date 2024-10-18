import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
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
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <Link href="/admin/dashboard">
                <p className="hover:text-gray-300">Dashboard</p>
              </Link>
            </li>
            <li className="mt-8">
              <button
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                onClick={() => {
                  signOut({ callbackUrl: "/auth/signin" });
                }}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
