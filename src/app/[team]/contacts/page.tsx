import Dashboard from "@/components/Dashboard";
import ContactsDashboard from "@/components/dashboard/ContactsDashboard";
import { getContacts } from "@/lib/actions";


export default async function Home({ params }: { params: { team: string } }) {
    const contacts = await getContacts(params.team);
    return (
        <Dashboard teamId={params.team}>
            <ContactsDashboard teamId={params.team} contacts={contacts} />
        </Dashboard>
    );
}
