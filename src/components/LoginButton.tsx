"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { AlertCircle } from "lucide-react";

import { Button } from "./ui/button";

import {
    Card,
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

import HCaptcha from "@hcaptcha/react-hcaptcha";

import { useToast } from "@/components/ui/use-toast";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
    email: z
        .string({ message: "Correo electrónico requerido" })
        .email({ message: "Correo electrónico inválido" }),
    password: z.string({ message: "Contraseña requerida" }),
    remember_me: z.boolean(),
});

const LoginButton = () => {
    const [token, setToken] = useState<string | null>(null);
    const hCaptchaRef = useRef<HCaptcha | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            remember_me: false,
        },
    });

    const router = useRouter();
    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (!token) {
                hCaptchaRef.current?.execute();
                return;
            }
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...values, token }),
            });
            const data = await response.json();
            if (data.status == "success") {
                router.push("/mfa");
            } else if (
                data.status == "error" &&
                data.message == "Invalid email or password"
            ) {
                form.setError("root", {
                    type: "manual",
                    message: "Credenciales incorrectos",
                });
                hCaptchaRef.current?.resetCaptcha();
            } else {
                toast({
                    title: "Oh oh! Algo salió mal",
                    description: "Hubo un error al iniciar sesión",
                });
                hCaptchaRef.current?.resetCaptcha();
            }
        } catch (error) {
            toast({
                title: "Oh oh! Algo salió mal",
                description: "Hubo un error al iniciar sesión",
            });
            hCaptchaRef.current?.resetCaptcha();
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    Iniciar Sesión
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[385px] mt-2" align="center" onInteractOutside={(ev) => {
                // Don't close the popover if the captcha is open
                if (ev.target instanceof HTMLIFrameElement) ev.preventDefault();
                if (ev.target instanceof HTMLElement && ev.target.closest(".h-captcha")) ev.preventDefault();
            }}>
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
                                                    autoFocus
                                                    tabIndex={1}
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
                                                    tabIndex={2}
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs leading-4 pt-0.5" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="remember_me"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0 flex items-center gap-1.5">
                                            <FormControl>
                                                <Checkbox
                                                    tabIndex={3}
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                            <FormLabel className="font-base text-sm">
                                                Recordarme por 30 días
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <HCaptcha
                                    sitekey="d94e78ec-a5ee-4204-adca-376cfa3ac354"
                                    onVerify={(token) => setToken(token)}
                                    onExpire={() => setToken(null)}
                                    ref={hCaptchaRef}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm">
                                Cancelar
                            </Button>
                            <Button
                                size="sm"
                                tabIndex={4}
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Iniciando Sesión..."
                                    : "Iniciar Sesión"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    );
};

export default LoginButton;
