import AdminLayout from "../../../components/AdminLayout";
import { getSession } from "next-auth/react";

export default function Dashboard() {
  return (
    <AdminLayout>
      <code>//TODO</code>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
