"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CURRENCIES, SUBSCRIPTION_INTERVALS } from "@/lib/const";
import { ScrollArea } from "../../ui/scroll-area";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(2),
    description: z.string(),
    amount: z.string(),
    currency: z.enum(CURRENCIES.map((currency) => currency.id) as any),
    interval: z.enum(SUBSCRIPTION_INTERVALS.map((interval) => interval.id) as any),
    interval_count: z.string().min(1),
    trial_days: z.string()
});

const PlanForm = ({ teamId }: { teamId: string }) => {
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            interval_count: "1",
            trial_days: "0",
        }
    });
    const { toast } = useToast();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await fetch("/api/subscriptions/plans/create", {
            method: "POST",
            body: JSON.stringify(values),
            credentials: "include",
            headers: {
                team: teamId,
            },
        });
        if (response.ok) {
            toast({
                title: "Plan creado",
                description: "El plan ha sido creado correctamente",
            })
            form.reset();
            setOpen(false);
        } else {
            toast({
                title: "¡Oh no! Algo salió mal",
                description: "Ha ocurrido un error al crear el plan"
            });
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} variant="outline">Crear plan</Button>
            </DialogTrigger>
            <DialogContent className="p-0">
                <ScrollArea className="max-h-[calc(100vh-50px)] px-6 py-8">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit, (errors) => {
                                console.log(errors);
                            })}
                            className="px-2"
                        >
                            <DialogHeader className="mb-1">
                                <DialogTitle>Crear plan</DialogTitle>
                                <DialogDescription>
                                    Completa la información para agregar un
                                    plan. Haz clic en guardar cuando hayas
                                    terminado.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Nombre Plan
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Mantenimiento web $7 USD"
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
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Descripción
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Detalles del plan"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Soporto Markdown
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="currency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Moneda</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="--Seleccionar" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {CURRENCIES.map(
                                                                (currency) => (
                                                                    <SelectItem
                                                                        value={
                                                                            currency.id
                                                                        }
                                                                        key={`currency-select-${currency.id}`}
                                                                    >
                                                                        {
                                                                            currency.name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Precio
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="1000"
                                                        {...field}
                                                        autoComplete="off"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="interval"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Periodicidad</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="--Seleccionar" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {SUBSCRIPTION_INTERVALS.map(
                                                                (interval) => (
                                                                    <SelectItem
                                                                        value={
                                                                            interval.id
                                                                        }
                                                                        key={`interval-select-${interval.id}`}
                                                                    >
                                                                        {
                                                                            interval.name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="interval_count"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Cantidad de cobros
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="1000"
                                                        {...field}
                                                        autoComplete="off"
                                                        defaultValue="1"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                        control={form.control}
                                        name="trial_days"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Días de prueba
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="1000"
                                                        {...field}
                                                        autoComplete="off"
                                                        defaultValue="0"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                
                            </div>
                            <DialogFooter className="mt-2">
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting
                                        ? "Guardando..."
                                        : "Guardar"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default PlanForm;
