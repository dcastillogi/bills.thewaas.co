"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    public_key: z.string().min(2),
    private_key: z.string().min(2),
});

export default function Payments({ teamId }: { teamId: string }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const { toast } = useToast();
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await fetch(`/api/team/settings/payments`, {
            method: "POST",
            headers: { "Content-Type": "application/json", team: teamId },
            body: JSON.stringify(values),
        });
        if (response.ok) {
            toast({
                title: "¡Listo!",
                description: "Configuración de ePayCo guardada",
            });
        } else {
            toast({
                title: "¡Oh no! Algo salió mal",
                description: "No pudimos guardar la configuración de ePayCo",
            });
        }
    };
    return (
        <section id="payments">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Pasarela de Pagos</CardTitle>
                            <CardDescription>
                                Configura ePayCo para recibir pagos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="public_key"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>PUBLIC_KEY</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="9jgxh9uyw733fm5z530ece88ak5ssljw"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="private_key"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>PRIVATE_KEY</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="8xyfx23mw6k0fv72euh7f2g504a0krns"
                                                    {...field}
                                                    type="password"
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t py-3.5 flex justify-between">
                            <p className="text-muted-foreground text-sm">
                                Puedes encontrar las llaves secretas de tu
                                cuenta ePayCo{" "}
                                <a
                                    className="text-white hover:underline"
                                    href="https://dashboard.epayco.com/configuration#form-datos-negocio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    aquí
                                </a>
                                .
                            </p>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                size="sm"
                            >
                                {form.formState.isSubmitting
                                    ? "Guardando..."
                                    : "Guardar"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </section>
    );
}
