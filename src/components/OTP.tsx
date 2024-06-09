"use client";

import { logout } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Tu código OTP debe ser de 6 dígitos.",
    }),
});

const OTP = ({ email }: { email: string }) => {
    const [value, setValue] = useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    });

    useEffect(() => {
        if (value.length === 6) {
            form.setValue("pin", value);
            const f = document.querySelector(
                "form#otp-form"
            ) as HTMLFormElement;
            f?.requestSubmit();
        }
    }, [value, form]);

    const router = useRouter();
    const { toast } = useToast();

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const response = await fetch("/api/auth/mfa", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            const { status, team } = await response.json();
            if (status == "success") {
                router.push(`/${team}`);
            } else {
                form.setError("pin", {
                    message: "Código OTP inválido.",
                });
            }
        } else {
            toast({
                title: "Oh oh! Algo salió mal",
                description: "Hubo un error verificando tu código OTP.",
            });
        }
    };

    return (
        <div className="max-w-[390px]">
            <CardHeader>
                <CardTitle>Verificación de Seguridad</CardTitle>
                <CardDescription className="max-w-[280px]">
                    Hola <strong>{email}</strong>, por favor ingresa tu token.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="otp-form">
                        <FormField
                            control={form.control}
                            name="pin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código OTP</FormLabel>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            {...field}
                                            autoFocus
                                            value={value}
                                            onChange={(value) =>
                                                setValue(value)
                                            }
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <form action={logout}>
                    <Button variant="outline">Cancelar</Button>
                </form>
                <Button
                    disabled={form.formState.isSubmitting}
                    onClick={() => {
                        const form = document.querySelector(
                            "form#otp-form"
                        ) as HTMLFormElement;
                        form?.requestSubmit();
                    }}
                >
                    {form.formState.isSubmitting ? "Cargando..." : "Continuar"}
                </Button>
            </CardFooter>
        </div>
    );
};

export default OTP;
