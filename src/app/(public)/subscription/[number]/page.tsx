import SubscriptionDetails from "@/components/SubscriptionDetails";
import SubscriptionForm from "@/components/SubscriptionForm";
import { getSubscription } from "@/lib/actions";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import moment from "moment-timezone";

export async function generateMetadata({
    params,
}: {
    params: { number: string };
}) {
    const subscription = await getSubscription(params.number);
    if (!subscription) {
        return;
    }
    return {
        title: subscription.plan.name + " - " + subscription.team.name,
    };
}

export default async function SubscriptionPage({
    params,
}: {
    params: { number: string };
}) {
    const subscription = await getSubscription(params.number);
    if (!subscription) {
        notFound();
    }
    if (subscription.status === "canceled") {
        return <p>Suscripción cancelada</p>;
    }
    if (
        moment(subscription.startDate)
            .isBefore(moment(new Date()).tz("America/Bogota"), "day") &&
        subscription.status === "created"
    ) {
        return <p>Tiempo para iniciar la suscripción ha pasado</p>;
    }

    return (
        <div
            className={cn({
                "lg:grid lg:grid-cols-2": true,
                "lg:grid-cols-1":
                    subscription.status === "active" ||
                    subscription.status === "pending",
            })}
        >
            <div className="px-6 pb-6 lg:pb-10 pt-12 bg-muted/30">
                <div className="max-w-lg mx-auto">
                    <div className="sm:flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Suscripción
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            No. {subscription._id.toString()}
                        </p>
                    </div>
                    <SubscriptionDetails subscription={subscription} />
                </div>
            </div>
            {(subscription.status == "created" || subscription.status == "suspended") && (
                <div className="px-6 py-8 lg:py-12">
                    <div className="max-w-lg mx-auto">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Información de contacto
                        </h2>
                        <p className=" text-muted-foreground mb-6">
                            Información del titular de la tarjeta
                        </p>
                        <SubscriptionForm subscription={subscription._id.toString()} phone={subscription.team.info.phone} />
                    </div>
                </div>
            )}
        </div>
    );
}
