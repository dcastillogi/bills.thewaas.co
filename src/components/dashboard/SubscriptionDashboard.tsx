import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Payments from "./settings/Payments";

export default function SubscriptionDashboard({ teamId }: { teamId: string }) {
    return (
        <div>
            <div className="w-full px-6 border-b py-8 bg-muted/40 overflow-x-auto">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-semibold tracking-tight">
                        Configuración
                    </h2>
                </div>
            </div>
            <div className="w-full lg:h-[calc(100vh-223px)] pl-4 pr-6">
                <div className="max-w-6xl mx-auto lg:flex lg:gap-6 py-8">
                    <div className="w-60">
                        <h2 className="text-sm text-muted-foreground mb-3 px-3">Opciones</h2>
                        <ul>
                            <li>
                                <Link href="#general">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                    >
                                        Suscripciones
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Link href="#payments">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                    >
                                        Planes
                                    </Button>
                                </Link>
                            </li>
                            <li>
                                <Link href="#payments">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                    >
                                        Contactos
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-grow">
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
