import { getTeam } from "@/lib/actions";
import { MainNav } from "./dashboard/MainNav";
import TeamSwitcher from "./dashboard/TeamSwitcher";
import { ThemeToggle } from "./dashboard/ThemeSwitcher";
import { UserNav } from "./dashboard/UserNav";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { getTeams } from "@/lib/actions";

const Dashboard = async ({
    children,
    teamId,
}: {
    children: React.ReactNode;
    teamId: string;
}) => {
    const { session, userId } = await getSession();
    if (!session.isLoggedIn) {
        redirect("/api/auth/logout");
    }
    if (!session.isVerified) {
        redirect("/mfa");
    }
    if (teamId.length != 24) return notFound();
    const team = await getTeam(userId, teamId);

    if (!team) return notFound();

    const teams = await getTeams(userId);

    const teamsList = [
        {
            label: "Cuenta Personal",
            teams: [
                {
                    label: teams.filter((team) => team._id.toString() == session.defaultTeam)[0].name,
                    value: session.defaultTeam,
                },
            ],
        },
    ];

    if (teams.length > 1) {
        teamsList.push({
            label: "Equipos",
            teams: teams
                .filter((team) => team._id.toString() !== session.defaultTeam)
                .map((t) => ({
                    label: t.name,
                    value: t._id.toString(),
                })),
        });
    }

    const selectedTeam = teams.filter(
        (team) => team._id.toString() == teamId
    )[0];

    return (
        <div className="w-screen">
            <div className="border-b overflow-x-auto w-screen">
                <div className="flex h-16 items-center px-4">
                    <TeamSwitcher
                        teams={teamsList}
                        selectedTeam={{
                            label: selectedTeam.name,
                            value: selectedTeam._id.toString(),
                        }}
                    />
                    <MainNav className="mx-6" team={teamId} />
                    <div className="ml-auto flex items-center space-x-4">
                        <ThemeToggle />
                        <UserNav />
                    </div>
                </div>
            </div>
            {children}
            <div className="border-t py-4 px-4">
                <p className="text-xs text-muted-foreground">
                    Copyrigth © 2024{" "}
                    <a
                        href="https://thewaas.co/?utm_source=bills"
                        className="thewaasco text-black dark:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        The Waas Co.
                    </a>{" "}
                    Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
