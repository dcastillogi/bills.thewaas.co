import Dashboard from "@/components/Dashboard";
import SubscriptionDashboard from "@/components/dashboard/SubscriptionDashboard";
import PlanList from "@/components/dashboard/subscriptions/PlanList";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function PlanPage({
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
            <SubscriptionDashboard teamId={params.team}>
                <PlanList teamId={params.team} />
            </SubscriptionDashboard>
        </Dashboard>
    );
}
