import Dashboard from "@/components/Dashboard";
import ContactsDashboard from "@/components/dashboard/ContactsDashboard";


export default async function Home({ params }: { params: { team: string } }) {
    return (
        <Dashboard teamId={params.team}>
            <ContactsDashboard />
        </Dashboard>
    );
}
