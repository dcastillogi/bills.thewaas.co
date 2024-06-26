import Link from "next/link";
import { Button } from "../ui/button";
import PlanForm from "./subscriptions/PlanForm";
import SubscriptionForm from "./subscriptions/SubscriptionForm";

export default function SubscriptionDashboard({ teamId, children }: { teamId: string, children: React.ReactNode }) {
    return (
        <div>
            <div className="w-full px-6 border-b py-8 bg-muted/40 overflow-x-auto">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Suscripciones
                    </h1>
                    <div className="flex gap-4">
                        <SubscriptionForm teamId={teamId} />
                        <PlanForm teamId={teamId} />
                    </div>
                </div>
            </div>
            <div className="w-full lg:h-[calc(100vh-223px)] pl-4 pr-6">
                <div className="max-w-6xl mx-auto lg:flex lg:gap-6 py-8">
                    <div className="w-60">
                        <h3 className="text-sm text-muted-foreground mb-3 px-3">Opciones</h3>
                        <ul>
                            <li>
                                <Link href={`/${teamId}/subscriptions`}>
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
                                <Link href={`/${teamId}/subscriptions/plans`}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                    >
                                        Planes
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-grow">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
