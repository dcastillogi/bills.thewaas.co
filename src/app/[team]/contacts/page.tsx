import Dashboard from "@/components/Dashboard";
import ContactsDashboard from "@/components/dashboard/ContactsDashboard";
import { getContacts } from "@/lib/actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ContactsPage({
    params,
}: {
    params: { team: string };
}) {
    const { session, userId } = await getSession();
    if (!session.isLoggedIn) {
        redirect("/")
    }
    const contacts = await getContacts(params.team, userId);
    if (!contacts) {
        redirect("/")
    }
    return (
        <Dashboard teamId={params.team}>
            <ContactsDashboard teamId={params.team} contacts={contacts} />
        </Dashboard>
    );
}
