import Dashboard from "@/components/Dashboard";
import SettingsDashboard from "@/components/dashboard/SettingsDashboard";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Settings({
    params,
}: {
    params: { team: string };
}) {
    const { session } = await getSession(false);
    if (!session.isLoggedIn) {
        redirect("/");
    }
    return (
        <Dashboard teamId={params.team}>
            <SettingsDashboard team={params.team} />
        </Dashboard>
    );
}
