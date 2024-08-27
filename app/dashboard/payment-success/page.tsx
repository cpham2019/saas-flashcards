export default function PaymentSuccess({
    searchParams: {amount},
}: {
    searchParams: {amount: string}
}) {
    return (
        <div className="flex justify-center items-center">
            <h1>Thank you!</h1>
            <h1>You have successfully sent 
                <span>${amount}</span>
            </h1>
        </div>
    )
}