"use client";

import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/CalendarDateRangePicker";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import Bill from "./Bill";
import NewBill from "./NewBill";

const BillsDashboard = () => {
    const [content, setContent] = useState<string | null>(null);

    return (
        <div>
            <div className="w-full px-4 border-b py-3 flex items-center justify-between bg-muted/40 overflow-x-auto">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Cuentas de Cobro
                    </h2>
                </div>
                <div className="flex items-center justify-end space-x-2 min-w-[600px]">
                    <CalendarDateRangePicker />
                    <Button onClick={() => setContent("new")}>Crear</Button>
                </div>
            </div>
            <div className="border-x max-w-8xl mx-auto w-full lg:h-[calc(100vh-180px)] lg:flex">
                <table className="lg:h-full border-r w-full lg:w-[25%] lg:min-w-[400px] text-sm max-h-[500px] lg:max-h-none overflow-y-auto">
                    <tbody>
                        <tr className="flex py-4 px-3 border-b w-full text-left hover:bg-secondary/80 cursor-pointer">
                            <td className="flex-grow">
                                <div className="flex gap-2 items-center">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src="https://github.com/shadcn.png"
                                                        alt="Daniel Castillo"
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        DC
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Daniel Castillo</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <div>
                                        <h3 className="font-semibold">
                                            clx5numem000008l0hqys2181
                                        </h3>
                                        <div className="flex gap-0.5 items-center">
                                            <p>12 Mayo, 2024</p>
                                            <Badge className="text-[11px] leading-3 px-1.5 bg-success-background text-success hover:text-success hover:bg-success-background">
                                                Paid
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="w-auto">
                                <h4 className="font-semibold">Total Due</h4>
                                <div className="flex">
                                    <p>$580.000</p>
                                </div>
                            </td>
                        </tr>
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
                                <Button className="w-full" onClick={() => setContent("new")}>
                                    Nueva cuenta de cobro
                                </Button>
                            </div>
                        </div>
                    ) : content === "new" ? (
                        <NewBill />
                    ) : (
                        <Bill />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillsDashboard;
