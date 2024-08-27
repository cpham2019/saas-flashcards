"use client";

import {useEffect, useState} from "react";
import {
    useStripe,
    useElements,
    PaymentElement
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Button } from "./ui/button";
function CheckoutPage({amount} : {amount: number}) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    amount: convertToSubcurrency(amount)
                }
            )
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return
        }

        const {error: submitError} = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return; 
        }

        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://www.localhost:3000/dashboard/payment-success?amount=${amount}`
            }
        })
        if (error) {
            setErrorMessage(error.message);
        } else {
            setLoading(false);
        }
    }
    if (!clientSecret || !stripe || !elements) {
        return (
            <span className="loading loading-dots loading-lg"></span>
        )
    }

    return (
    <form onSubmit={handleSubmit} className="bg-white flex flex-col justify-center p-12 rounded-lg border drop-shadow-xl">
        {clientSecret && <PaymentElement />}
        {errorMessage && <div>{errorMessage}</div>}
        <Button disabled={!stripe || loading} className="mt-4">
            {!loading ? `Pay $${amount}` : "Processing"}
        </Button>
    </form>
  )
}

export default CheckoutPage