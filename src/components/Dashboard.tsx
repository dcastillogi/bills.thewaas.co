import { MainNav } from "./dashboard/MainNav";
import TeamSwitcher from "./dashboard/TeamSwitcher";
import { ThemeToggle } from "./dashboard/ThemeSwitcher";
import { UserNav } from "./dashboard/UserNav";

const Dashboard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-screen">
            <div className="border-b overflow-x-auto w-screen">
                <div className="flex h-16 items-center px-4 max-w-8xl mx-auto">
                    <TeamSwitcher />
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <ThemeToggle />
                        <UserNav />
                    </div>
                </div>
            </div>
            {children}
            <div className="border-t py-4 px-4">
                <p className="text-xs text-muted-foreground">
                    Copyrigth © 2024 <a href="https://thewaas.co/?utm_source=bills" className="thewaasco text-black dark:text-white" target="_blank" rel="noopener noreferrer">The Waas Co.</a> Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
