import Dashboard from "@/components/Dashboard";
import SettingsDashboard from "@/components/dashboard/SettingsDashboard";
import { getTeam } from "@/lib/actions";
import { getSession } from "@/lib/session";


export default async function Settings({ params }: { params: { team: string } }) {
    const {session, userId} = await getSession();
    const team = await getTeam(userId, params.team);
    return (
        <Dashboard teamId={params.team}>
            <SettingsDashboard team={team} />
        </Dashboard>
    );
}
