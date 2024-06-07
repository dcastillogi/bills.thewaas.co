"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z
        .string({ message: "Correo electrónico requerido" })
        .email({ message: "Correo electrónico inválido" }),
    password: z.string({ message: "Contraseña requerida" }),
});

const LoginButton = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const router = useRouter();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (response.ok) {
            router.refresh();
        } else {
            form.setError("root", {
                type: "manual",
                message: "Credenciales incorrectos",
            });
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    Iniciar Sesión
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2 w-80">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader className="space-y-0.5 pb-4">
                            <CardTitle>Iniciar Sesión</CardTitle>
                            <CardDescription>
                                Bienvenido de nuevo a tus facturas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-5">
                            <div className="grid w-full items-center gap-4">
                                {form.formState.errors.root ? (
                                    <div className="flex items-center text-sm space-x-2 text-destructive -mb-1.5 bg-destructive/20 border rounded px-2 py-1.5 border-destructive/50">
                                        <AlertCircle size={16} />
                                        <span>
                                            {form.formState.errors.root.message}
                                        </span>
                                    </div>
                                ) : null}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="font-semibold">
                                                Correo Electrónico
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ejemplo@ejemplo.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs leading-4 pt-0.5" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="font-semibold">
                                                Contraseña
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs leading-4 pt-0.5" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm">
                                Cancelar
                            </Button>
                            <Button size="sm">
                                {form.formState.isSubmitting
                                    ? "Iniciando Sesión..."
                                    : "Iniciar Sesión"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LoginButton;
