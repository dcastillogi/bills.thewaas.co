"use client";

import { useEffect } from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

const ButtonWrapper = ({ type, planId } : {type: string, planId: string}) => {
    const [{ options }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PayPalButtons
            createSubscription={(data, actions) => {
                return actions.subscription
                    .create({
                        plan_id: planId,
                        
                    })
                    .then((orderId) => {
                        // Your code here after create the order
                        return orderId;
                    });
            }}
            style={{
                label: "subscribe",
                layout: "horizontal",
                color: "silver",
                tagline: false,
            }}
        />
    );
};

export default function PaypalButton({
    planId,
}: {
    planId: string
}) {
	return (
		<PayPalScriptProvider
			options={{
				clientId: "AXgzG30_Y5dNB_VrygtrLfnTSbFRuglxjiikSMn1uSyXpdEE1MS8J-sp3Dxbe1pAMvYBtiKZGpR4mm-M",
				components: "buttons",
				intent: "subscription",
				vault: true,
			}}
		>
			<ButtonWrapper type="subscription" planId={planId} />
		</PayPalScriptProvider>
	);
}