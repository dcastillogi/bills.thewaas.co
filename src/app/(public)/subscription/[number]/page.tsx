import type { Metadata } from "next";

import SubscriptionDetails from "@/components/SubscriptionDetails";
import SubscriptionForm from "@/components/SubscriptionForm";
import { getSubscription } from "@/lib/actions";

export const metadata: Metadata = {
    title: "Pagar suscripción - BBR GROUP",
};

export default async function SubscriptionPage({
    params
}: {
    params: { number: string };
}) {
    const subscription = await getSubscription(params.number);
    if (!subscription) {
        return <div>Subscription not found</div>;
    }
    return (
        <div className="lg:flex lg:justify-end lg:overflow-y-auto lg:items-start">
            <div className="lg:w-1/2 px-6 pb-6 lg:pb-10 pt-12 bg-muted/30 top-0 left-0 lg:fixed lg:h-screen">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-3xl font-semibold tracking-tight mb-6">
                        Suscripción
                    </h1>
                    <SubscriptionDetails subscription={subscription} />
                </div>
            </div>
            <div className="lg:w-1/2 px-6 py-8 lg:py-12">
                <div className="max-w-lg mx-auto">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Información de contacto
                    </h2>
                    <p className=" text-muted-foreground mb-6">
                        Información del titular de la tarjeta
                    </p>
                    <SubscriptionForm />
                </div>
            </div>
        </div>
    );
}
