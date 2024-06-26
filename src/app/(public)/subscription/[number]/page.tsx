"use client";

import SubscriptionDetails from "@/components/SubscriptionDetails";
import SubscriptionForm from "@/components/SubscriptionForm";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionPage() {
    return (
        <div className="lg:flex lg:justify-end">
            <div className="lg:w-1/2 px-4 pb-20 lg:pb-10 py-10 bg-muted/30 lg:h-screen top-0 left-0 lg:fixed">
                <div className="max-w-lg mx-auto h-full">
                    <div className="h-16">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Suscripción
                        </h1>
                    </div>
                    <SubscriptionDetails />
                </div>
            </div>
            <div className="lg:w-1/2 px-4 py-10 h-screen">
                <div className="max-w-lg mx-auto h-full">
                    <div className="h-16">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Facturación
                        </h2>
                    </div>
                    <SubscriptionForm />
                </div>
            </div>
        </div>
    );
}
