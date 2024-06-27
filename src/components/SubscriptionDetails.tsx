import { toMoneyFormat } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "./ui/mdx";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CalendarIcon } from "@radix-ui/react-icons";

export default function SubscriptionDetails({
    subscription,
}: {
    subscription: any;
}) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-5">
                Detalles de la suscripción
            </h2>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24 rounded">
                        <AvatarImage
                            src={subscription.team.photoUrl}
                            alt={subscription.team.name}
                        />
                        <AvatarFallback className="text-2xl rounded">
                            {subscription.team.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-lg font-semibold">
                            {subscription.plan.name}
                        </h3>
                        <p className="text-muted-foreground">
                            {subscription.reference}
                        </p>
                    </div>
                </div>
                <p>
                    {toMoneyFormat(
                        subscription.plan.amount,
                        subscription.plan.currency
                    )}
                </p>
            </div>
            <div className="mt-4 space-y-4 text-white/70">
                <MDXRemote
                    source={subscription.plan.description}
                    components={components}
                />
            </div>
            <Alert className="mt-5">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <AlertTitle>Información Importante</AlertTitle>
                <AlertDescription>
                    Tu suscripción se renovará automáticamente el día{" "}
                    {subscription.day} de cada mes.
                </AlertDescription>
            </Alert>
            <Separator className="mt-6 mb-4" />
            <div className="flex justify-between">
                <strong>Subtotal:</strong>
                <p>
                    {toMoneyFormat(
                        subscription.plan.amount,
                        subscription.plan.currency
                    )}
                </p>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between">
                <strong>Total:</strong>
                <p>
                    {toMoneyFormat(
                        subscription.plan.amount,
                        subscription.plan.currency
                    )}
                </p>
            </div>
            <p className="text-sm mt-10 text-muted-foreground">
                Si tienes alguna duda, no dudes en{" "}
                <a
                    href={`https://api.whatsapp.com/send/?phone=${subscription.team.info.phone}&text=${encodeURIComponent("Hola, tengo una duda sobre mi suscripción No. " + subscription._id)}`}
                    target="_blank"
                    className="underline hover:text-white transition-colors"
                    rel="noopener noreferrer"
                >
                    contactarnos
                </a>
                .
            </p>
        </div>
    );
}
