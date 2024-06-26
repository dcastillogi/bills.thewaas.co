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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { LANGUAGES } from "@/lib/const";
import { ScrollArea } from "../../ui/scroll-area";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ContactSelector from "../contacts/ContactSelector";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    contact: z.string().min(2),
    lang: z.enum(LANGUAGES.map((lang) => lang.id) as any),
    email: z
        .string()
        .min(1, { message: "Este campo es obligatorio." })
        .email("Correo electrónico inválido."),
    start_date: z.string().min(1, { message: "Este campo es obligatorio." }),
    plan: z.string().min(1, { message: "Este campo es obligatorio." }),
    reference: z.string().optional(),
});

const SubscriptionForm = ({ teamId }: { teamId: string }) => {
    const [open, setOpen] = useState(false);
    const [plans, setPlans] = useState<any[] | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const { toast } = useToast();

    useEffect(() => {
        fetch("/api/subscriptions/plans/getAll", {
            cache: "no-cache",
            headers: {
                team: teamId,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setPlans(data);
            })
            .catch((error) => {
                toast({
                    title: "¡Oh no! Algo salió mal",
                    description: "No pudimos cargar los países disponibles",
                });
            });
    }, [teamId, toast]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await fetch("/api/subscriptions/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                team: teamId,
            },
            body: JSON.stringify(values),
        });
        if (!response.ok) {
            toast({
                title: "¡Oh no! Algo salió mal",
                description: "No pudimos crear el contacto",
            });
            return;
        }
        toast({
            title: "¡Listo!",
            description: "Contacto creado exitosamente",
        });
        setOpen(false);
        form.reset();
    };
    const changeLang = (lang: any) => {
        form.setValue("lang", lang);
    };
    const changeEmail = (email: any) => {
        form.setValue("email", email);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>Crear suscripción</Button>
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
                                <DialogTitle>Crear suscripción</DialogTitle>
                                <DialogDescription>
                                    Completa la información para agregar una
                                    suscripción. Haz clic en guardar cuando
                                    hayas terminado.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="contact"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Información Cliente
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex gap-4">
                                                    <ContactSelector
                                                        className="flex-grow"
                                                        onChangeValue={
                                                            field.onChange
                                                        }
                                                        changeLang={changeLang}
                                                        changeEmail={
                                                            changeEmail
                                                        }
                                                        changeCurrency={() => {}}
                                                    />
                                                    <Button
                                                        variant="secondary"
                                                        type="button"
                                                    >
                                                        Nuevo
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lang"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Lenguaje</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="--Seleccionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {LANGUAGES.map(
                                                            (lang) => (
                                                                <SelectItem
                                                                    value={
                                                                        lang.id
                                                                    }
                                                                    key={`lang-select-${lang.id}`}
                                                                >
                                                                    {lang.name}
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
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Correo Electrónico
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ejemplo@ejemplo.com"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid sm:grid-cols-8 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="start_date"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-3">
                                                <FormLabel>
                                                    Fecha de Inicio
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
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
                                        name="plan"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-5">
                                                <FormLabel>Plan</FormLabel>
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
                                                            <SelectValue
                                                                placeholder={
                                                                    !plans
                                                                        ? "Cargando..."
                                                                        : plans.length ===
                                                                          0
                                                                        ? "No hay planes disponibles"
                                                                        : "Selecciona un plan"
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {plans &&
                                                                plans.map(
                                                                    (
                                                                        plan: any
                                                                    ) => (
                                                                        <SelectItem
                                                                            value={
                                                                                plan._id
                                                                            }
                                                                            key={`plan-option-${plan._id}`}
                                                                        >
                                                                            {
                                                                                plan.name
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
                                </div>
                                <FormField
                                    control={form.control}
                                    name="reference"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-3">
                                            <FormLabel>Referencia</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Contrato AA-1234"
                                                    {...field}
                                                    autoComplete="off"
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

export default SubscriptionForm;
