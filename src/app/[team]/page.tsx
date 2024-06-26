import Dashboard from "@/components/Dashboard";
import BillsDashboard from "@/components/dashboard/BillsDashboard";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";


export default async function Home({ params }: { params: { team: string } }) {
    const { session } = await getSession(false);
    if (!session.isLoggedIn) {
        redirect("/")
    }
    return (
        <Dashboard teamId={params.team}>
            <BillsDashboard teamId={params.team} />
        </Dashboard>
    );
}
