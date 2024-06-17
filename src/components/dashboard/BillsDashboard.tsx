"use client";

import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/bills/CalendarDateRangePicker";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import Bill from "./bills/Bill";
import NewBill from "./bills/NewBill";

import BillOptions from "./bills/BillOptions";
import { toMoneyFormat } from "@/lib/utils";

const BillsDashboard = ({ teamId }: { teamId: string }) => {
    const [content, setContent] = useState<string | null>(null);
    const [bills, setBills] = useState<any[] | null>(null);

    useEffect(() => {
        const get = async () => {
            const response = await fetch("/api/bills/get", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    team: teamId,
                },
            });
            const data = await response.json();
            setBills(data);
        };
        get();
    }, [teamId]);

    return (
        <div>
            <div className="w-full px-8 border-b py-8 flex items-center justify-between bg-muted/40 overflow-x-auto">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight">
                        Cuentas de Cobro
                    </h2>
                </div>
                <div className="flex items-center justify-end space-x-2 min-w-[600px]">
                    <CalendarDateRangePicker />
                    <Button onClick={() => setContent("new")}>Crear</Button>
                </div>
            </div>
            <div className="mx-auto w-full lg:h-[calc(100vh-223px)] lg:flex">
                <table className="lg:h-full border-r w-full lg:w-[25%] lg:min-w-[400px] text-sm max-h-[500px] lg:max-h-none overflow-y-auto">
                    <tbody>
                        {bills?.map((bill) => (
                            <tr
                                className="flex py-4 px-3 border-b w-full text-left hover:bg-secondary/80 cursor-pointer"
                                key={bill._id}
                                onClick={() => setContent(bill._id)}
                            >
                                <td className="flex-grow">
                                    <div className="flex gap-2 items-center">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Avatar className="h-8 w-8">
                                                        {bill.recipient
                                                            .photoUrl ? (
                                                            <AvatarImage
                                                                src={
                                                                    bill
                                                                        .recipient
                                                                        .photoUrl
                                                                }
                                                                alt={
                                                                    bill
                                                                        .recipient
                                                                        .name
                                                                }
                                                            />
                                                        ) : null}
                                                        <AvatarFallback className="text-xs">
                                                            {
                                                                bill.recipient
                                                                    .name[0]
                                                            }
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{bill.recipient.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <div>
                                            <h3 className="font-semibold">
                                                {bill.recipient.name}
                                            </h3>
                                            <div className="flex gap-0.5 items-center">
                                                <p>
                                                    {new Date(
                                                        bill.emittedAt
                                                    ).toLocaleDateString(
                                                        "es-CO",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            timeZone: "America/Bogota",
                                                        }
                                                    )}
                                                </p>
                                                <Badge className="text-[11px] leading-3 px-1.5 bg-success-background text-success hover:text-success hover:bg-success-background">
                                                    {bill.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="w-auto">
                                    <h4 className="font-semibold">Total</h4>
                                    <div className="flex">
                                        <p>
                                            {toMoneyFormat(
                                                bill.total,
                                                bill.currency
                                            )}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="h-screen lg:h-full flex-grow overflow-x-auto">
                    {content === null ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="max-w-sm w-full space-y-4 px-6 text-center">
                                <p className="text-gray-500">
                                    Por favor, selecciona una cuenta de cobro
                                    del menú lateral o crea una nueva cuenta.
                                </p>
                                <Button
                                    className="w-full"
                                    onClick={() => setContent("new")}
                                >
                                    Nueva cuenta de cobro
                                </Button>
                            </div>
                        </div>
                    ) : content === "new" ? (
                        <NewBill />
                    ) : (
                        <div className="w-full relative pt-4">
                            <BillOptions billId={content} />
                            <iframe
                                src={`/api/bill/${content}`}
                                className="w-full aspect-[0.8] border rounded-lg mt-8 overflow-hidden"
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillsDashboard;
