import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import { notFound } from "next/navigation";

export async function GET(
    req: NextRequest,
    {
        params: { downloadVerificationId },
    }: { params: { downloadVerificationId: string } }
) {
    const data = await db.downloadVerification.
    findUnique({
        where: { id: downloadVerificationId, expiresAt:
            {gt: new Date()}
        },
        select: { product: {select: { filePath: true, name: true}}},
    })
    
    if(data == null){
        return NextResponse.redirect(new URL("/products/download/expired", req.url),
    )
    }

    try {
        const { size } = await fs.stat(data.product.filePath);
        const file = await fs.readFile(data.product.filePath);
        const extension = data.product.filePath.split(".").pop()



        return new NextResponse(file, {
            headers: {
                "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
                "Content-Length": size.toString(),
                
            },
        });
    } catch (error) {
        console.error("Error reading file:", error);
        return notFound();
    }
}