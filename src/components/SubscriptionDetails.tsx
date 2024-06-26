import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export default function SubscriptionDetails() {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                Detalles de la suscripción
            </h2>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Skeleton className="h-6 w-20 rounded" />
            </div>
            <div className="mt-4 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton className="h-4 w-full" key={i} />
                ))}
                <Skeleton className="h-4 w-1/3" />
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between mt-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-20" />
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-20" />
            </div>
        </div>
    );
}
