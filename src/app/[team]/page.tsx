import Dashboard from "@/components/Dashboard";
import BillsDashboard from "@/components/dashboard/BillsDashboard";


export default async function Home({ params }: { params: { team: string } }) {
    return (
        <Dashboard teamId={params.team}>
            <BillsDashboard teamId={params.team} />
        </Dashboard>
    );
}
