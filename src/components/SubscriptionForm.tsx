"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useToast } from "./ui/use-toast";
import Lottie from "react-lottie";
import animationData from "@/lib/check_animation.json";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
} from "@/components/ui/select";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, useState } from "react";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { COUNTRIES, DOCUMENT_TYPES } from "@/lib/const";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
    name: z
        .string({ message: "Debes ingresar un nombre" })
        .min(2, { message: "Debes ingresar un nombre válido" }),
    lastName: z
        .string({ message: "Debes ingresar un apellido" })
        .min(2, { message: "Debes ingresar un apellido válido" }),
    docType: z.enum(DOCUMENT_TYPES.map((doc) => doc.id) as any, {message: "Debes seleccionar un tipo de documento válido"}),
    docNumber: z.string().min(5, { message: "Debes ingresar un número de documento válido" }),
    email: z
        .string({ message: "Debes ingresar un correo electrónico" })
        .email({ message: "Debes ingresar un correo válido" }),
    phone: z
        .string()
        .min(11, {
            message: "El número de celular debe tener 10 dígitos",
        })
        .max(13, {
            message: "El número de celular debe tener 10 dígitos",
        }),
    city: z.string().min(2, {message: "Debes ingresar una ciudad válida"}),
    address: z
        .string({ message: "Debes ingresar una dirección" })
        .min(5, { message: "Debes ingresar una dirección válida" }),
    cardNumber: z.string().min(16, {message: "Debes ingresar una tarjeta válida"}).max(19, {message: "Debes ingresar una tarjeta válida"}),
    expMonth: z.string().min(1, {message: "Debes ingresar un mes válido"}).max(2, {message: "Debes ingresar un mes válido"}),
    expYear: z.string().min(4, {message: "Debes ingresar un año válido"}).max(4, {message: "Debes ingresar un año válido"}),
    cvc: z.string().min(3, {message: "Debes ingresar un cvc válido"}).max(4, {message: "Debes ingresar un cvc válido"}),
});

export default function SubscriptionForm({
    subscription,
    phone,
}: {
    subscription: string;
    phone: string;
}) {
    const [success, setSuccess] = useState(false);
    const hCaptchaRef = useRef<HCaptcha | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            lastName: "",
            docType: "",
            docNumber: "",
            email: "",
            phone: "",
            city: "",
            address: "",
            cardNumber: "",
            expMonth: "",
            expYear: "",
            cvc: "",
        }
    });
    const { toast } = useToast();

    const onSubmit = async (
        values: z.infer<typeof formSchema>,
        options: { token?: string } = {}
    ) => {
        const { token = "" } = options;

        if (!token) {
            hCaptchaRef.current?.execute();
            return;
        }

        const response = await fetch("/api/subscriptions/formalize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...values,
                subscription,
                token,
            }),
            cache: "no-cache",
        });

        if (response.ok) {
            setSuccess(true);
            return;
        } else {
            hCaptchaRef.current?.resetCaptcha();
            if (response.status === 400) {
                const { message } = await response.json();
                toast({
                    title: "¡Oh no! No pudimos procesar tu solicitud",
                    description: message,
                });
            } else {
                toast({
                    title: "¡Oh no! Algo salió mal",
                    description: "No pudimos procesar tu solicitud, intenta de nuevo más tarde",
                });
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
                {/*
                <Card className="mb-5 p-3">
                    <div className="flex justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <p className="text-sm font-medium leading-none">
                                    Sofia Davis
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    m@example.com
                                </p>
                            </div>
                        </div>
                        <Button variant="outline">Usar</Button>
                    </div>
                </Card>
                    */}

                <div className="flex flex-col gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre (s)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellido (s)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid sm:grid-cols-7 gap-4">
                        <FormField
                            control={form.control}
                            name="docType"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-3">
                                    <FormLabel>Tipo</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="--Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(
                                                    COUNTRIES
                                                ).map(([id, country]) => (
                                                    <SelectGroup key={id}>
                                                        <SelectLabel>
                                                            {country.name}
                                                        </SelectLabel>
                                                        {DOCUMENT_TYPES.filter(
                                                            (type) =>
                                                                type.country ===
                                                                id
                                                        ).map((type) => (
                                                            <SelectItem
                                                                value={type.id}
                                                                key={`type-select-${type.id}`}
                                                            >
                                                                {type.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="docNumber"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-4">
                                    <FormLabel>Número de Documento</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="100239247"
                                            {...field}
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ejemplo@ejemplo.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Celular</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="573002549256"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid md:grid-cols-6 gap-4">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="md:col-span-4">
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="CL 27 #27-51 APTO 301"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Ciudad</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Bogotá"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight mt-4">
                        Información de pago
                    </h2>
                    <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Tarjeta</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="4111 1111 1111 1111"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <FormLabel>Fecha de expiración</FormLabel>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <FormField
                                    control={form.control}
                                    name="expMonth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="MM" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from(
                                                            { length: 12 },
                                                            (_, i) => i + 1
                                                        ).map(
                                                            (month: number) => (
                                                                <SelectItem
                                                                    value={month.toString()}
                                                                    key={`month-select-${month}`}
                                                                >
                                                                    {month}
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
                                    name="expYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="YYYY" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from(
                                                            { length: 7 },
                                                            (_, i) =>
                                                                i +
                                                                new Date().getFullYear()
                                                        ).map(
                                                            (year: number) => (
                                                                <SelectItem
                                                                    value={year.toString()}
                                                                    key={`year-select-${year}`}
                                                                >
                                                                    {year}
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
                        </div>
                        <FormField
                            control={form.control}
                            name="cvc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CVC</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <HCaptcha
                        sitekey="d94e78ec-a5ee-4204-adca-376cfa3ac354"
                        size="invisible"
                        ref={hCaptchaRef}
                        onVerify={(token: string) => {
                            form.handleSubmit((values) =>
                                onSubmit(values, { token })
                            )();
                        }}
                    />
                    <Button
                        type="submit"
                        className="w-full mt-1"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2Icon className="w-5 h-5 animate-spin mr-2" /> Procesando...
                            </>
                        ) : (
                            "Suscribirme ($7 USD/mes)"
                        )}
                    </Button>
                    <div className="flex justify-center gap-2 -mt-2 items-center">
                        <LockClosedIcon className="w-4 h-4 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm font-medium">
                            Pagos procesados por ePayCo
                        </p>
                    </div>
                </div>
            </form>
            {success && (
                <div className="w-screen h-screen fixed top-0 bg-background z-40 left-0 grid place-items-center">
                    <div className="max-w-lg px-6">
                        <Lottie
                            options={{ animationData }}
                            width={200}
                            height={200}
                        />
                        <h1 className="text-3xl font-semibold text-center -mt-8">
                            ¡Gracias!
                        </h1>
                        <p className="text-center text-muted-foreground">
                            Tu suscripción se ha realizado correctamente
                        </p>
                        <p className="text-sm mt-10 text-center text-muted-foreground">
                            Si tienes alguna duda, no dudes en{" "}
                            <a
                                href={`https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(
                                    "Hola, tengo una duda sobre mi suscripción No. " +
                                        subscription
                                )}`}
                                target="_blank"
                                className="underline hover:text-white transition-colors"
                                rel="noopener noreferrer"
                            >
                                contactarnos
                            </a>
                            .
                        </p>
                    </div>
                </div>
            )}
        </Form>
    );
}
