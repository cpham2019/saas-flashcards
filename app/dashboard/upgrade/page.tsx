"use client"

import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
function UpgradePage() {
  const amount = 9.99;
  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        {/* statement */}
      </div>
      <Elements stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToSubcurrency(amount),
        currency: "usd"
      }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </div>
  )
}

export default UpgradePage