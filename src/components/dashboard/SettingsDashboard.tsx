import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export default function SettingsDashboard({ team }: { team: any }) {
    return (
        <div>
            <div className="w-full px-6 border-b py-8 bg-muted/40 overflow-x-auto">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-semibold tracking-tight">
                        Configuración
                    </h2>
                </div>
            </div>
            <div className="w-full lg:h-[calc(100vh-223px)] px-6">
                <div className="max-w-7xl mx-auto lg:flex lg:gap-6 py-8">
                    <div className="w-60">
                        <div className="flex items-center text-sm text-muted-foreground mb-3 px-3">
                            <Avatar className="mr-2 h-5 w-5">
                                <AvatarImage
                                    src={team.photoUrl}
                                    alt={team.name}
                                />
                                <AvatarFallback>team.name[0]</AvatarFallback>
                            </Avatar>
                            {team.name}
                        </div>
                        <ul>
                            <li>
                                <Link href="#general">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                    >
                                        General
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Link href="#general">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                    >
                                        Pasarela de Pagos
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-grow"></div>
                </div>
            </div>
        </div>
    );
}
