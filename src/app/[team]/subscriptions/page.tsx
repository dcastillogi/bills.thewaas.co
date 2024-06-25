import Dashboard from "@/components/Dashboard";
import SubscriptionDashboard from "@/components/dashboard/SubscriptionDashboard";
import { getContacts } from "@/lib/actions";


export default async function Home({ params }: { params: { team: string } }) {
    const contacts = await getContacts(params.team);
    return (
        <Dashboard teamId={params.team}>
            <SubscriptionDashboard teamId={params.team} contacts={contacts} />
        </Dashboard>
    );
}
