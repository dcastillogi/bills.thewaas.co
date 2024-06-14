"use client";
import {
    InputOTP,
    InputOTPGroup,
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

import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const FormSchema = z.object({
    pin: z.string().min(8, {
        message: "Tu código OTP debe ser de 8 dígitos.",
    }),
});

const SignVerify = ({
    billId,
    close,
    hideButton,
}: {
    billId: string;
    close: () => void;
    hideButton: () => void;
}) => {
    const [value, setValue] = useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    });

    useEffect(() => {
        if (value.length === 8) {
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
        const response = await fetch("/api/bill/sign/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data, billId: billId }),
        });
        if (response.ok) {
            const { status, team } = await response.json();
            if (status == "success") {
                toast({
                    title: "¡Firma exitosa!",
                    description: `Tu firma
                    ha sido registrada correctamente.`,
                });
                close();
                hideButton();
            } else {
                form.setError("pin", {
                    message: "Código inválido.",
                });
            }
        } else {
            toast({
                title: "Oh oh! Algo salió mal",
                description: "Hubo un error verificando tu código.",
            });
        }
    };

    return (
        <DialogContent className="max-w-[370px]">
            <Form {...form}>
                <DialogHeader>
                    <DialogTitle>Verificar firma</DialogTitle>
                    <DialogDescription>
                        Ingresa el código que recibiste para firmar el
                        documento.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} id="otp-form">
                    <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Código OTP</FormLabel>
                                <FormControl>
                                    <InputOTP
                                        maxLength={8}
                                        {...field}
                                        autoFocus
                                        value={value}
                                        onChange={(value) => setValue(value)}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                            <InputOTPSlot index={6} />
                                            <InputOTPSlot index={7} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>

                <DialogFooter>
                    <div className="flex justify-between w-full mt-2">
                        <Button type="button" variant="outline" onClick={close}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting
                                ? "Verificando..."
                                : "Verificar"}
                        </Button>
                    </div>
                </DialogFooter>
            </Form>
        </DialogContent>
    );
};

export default SignVerify;
