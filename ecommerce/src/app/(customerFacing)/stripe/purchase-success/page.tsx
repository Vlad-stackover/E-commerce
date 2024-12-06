// import { Button } from "@/components/ui/button";
// import db from "@/db/db";
// import { formatCurrency } from "@/lib/formatters";
// import Image from "next/image"
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


// export default async function SuccessPage({
//     searchParams,
// }:
//     {
//         searchParams: { payment_intent: string }
//     }) {
//     const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.
//         payment_intent)

//     if (paymentIntent.metadata.productId == null) return notFound()

//     const product = await db.product.findUnique({
//         where: {
//             id:
//                 paymentIntent.metadata.productId
//         }
//     })

//     if (product == null) return notFound()

//     const isSuccess = paymentIntent.status === "succeeded"

//     return <div className="max-w-5xl w-full mx-auto space-y-8">
//         <h1 className="text-4xl font-bold">{isSuccess ? "Success!" : "Error!"}</h1>
//         <div className="flex gap-4 items-center">
//             <div className="aspect-video flex-shrink-0 w-1/3 relative">
//                 <Image
//                     src={product.imagePath}
//                     fill
//                     alt={product.name}
//                     className="object-cover" />
//             </div>
//             <div>
//                 <div className="text-lg">
//                     {formatCurrency(product.priceInCents / 100)}
//                 </div>
//                 <h1 className="text-2xl font-bold">{product.name}</h1>
//                 <div className="line-clamp-3 text-muted-foreground">
//                     {product.description}
//                 </div>
//                 <Button className="mt-4" size="lg" asChild>
//                     {isSuccess ? (
//                         <a href={`/products/download/${await createDownloadVerification(product.id)}`}>
//                             Download
//                         </a>
//                     ) : (
//                         <Link href={`/products/${product.id}/purchase`}>Try again</Link>)}
//                 </Button>
//             </div>
//         </div>
//     </div>
// }

// async function createDownloadVerification(productId: string) {
//     return (await db.downloadVerification.create({
//         data: {
//             productId, expiresAt:
//                 new Date(Date.now() + 1000 * 60 * 60 * 24),
//         }
//     })).id
// }
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
    searchParams: rawSearchParams,
}: {
    searchParams: Promise<{ payment_intent: string }>;
}) {
    const searchParams = await rawSearchParams; // Await searchParams
    const paymentIntentId = searchParams.payment_intent;

    if (!paymentIntentId) return notFound();

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent.metadata.productId) return notFound();

    // Fetch the product from the database
    const product = await db.product.findUnique({
        where: { id: paymentIntent.metadata.productId },
    });

    if (!product) return notFound();

    // Check payment status
    const isSuccess = paymentIntent.status === "succeeded";

    // Generate download verification ID if successful
    const downloadId = isSuccess
        ? await createDownloadVerification(product.id)
        : null;

    return (
        <div className="max-w-5xl w-full mx-auto space-y-8">
            <h1 className="text-4xl font-bold">
                {isSuccess ? "Success!" : "Error!"}
            </h1>
            <div className="flex gap-4 items-center">
                <div className="aspect-video flex-shrink-0 w-1/3 relative">
                    <Image
                        src={product.imagePath}
                        fill
                        alt={product.name}
                        className="object-cover"
                    />
                </div>
                <div>
                    <div className="text-lg">
                        {formatCurrency(product.priceInCents / 100)}
                    </div>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <div className="line-clamp-3 text-muted-foreground">
                        {product.description}
                    </div>
                    <Button className="mt-4" size="lg" asChild>
                        {isSuccess ? (
                            <a href={`/products/download/${downloadId}`}>
                                Download
                            </a>
                        ) : (
                            <Link href={`/products/${product.id}/purchase`}>
                                Try again
                            </Link>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Function to create a download verification record
async function createDownloadVerification(productId: string) {
    const downloadVerification = await db.downloadVerification.create({
        data: {
            productId,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours expiry
        },
    });
    return downloadVerification.id;
}
