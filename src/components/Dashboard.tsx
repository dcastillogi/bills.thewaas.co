import { MainNav } from "./dashboard/MainNav";
import TeamSwitcher from "./dashboard/TeamSwitcher";
import { UserNav } from "./dashboard/UserNav";

const Dashboard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-screen">
            <div className="border-b">
                <div className="flex h-16 items-center px-4 max-w-8xl mx-auto">
                    <TeamSwitcher />
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav />
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
};

export default Dashboard;
