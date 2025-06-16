import { type NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.PINATA_GATEWAY_URL, // see https://docs.pinata.cloud/gateways/dedicated-ipfs-gateways
});

export async function serverUploadToIpfs(files: File[]) {
    const results = await Promise.all(
        files.map(async (file) => ({
            ipfsResult: await pinata.upload.public.file(file),
            file,
            contentsHash: createHash("sha256").update(await file.bytes())
                .digest("hex"),
        })),
    );

    return results.map(({ ipfsResult, contentsHash }) => ({
        ipfsHash: ipfsResult.cid.trim(),
        contentsHash: contentsHash.trim(),
    }));
}

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    return NextResponse.json({
        results: await serverUploadToIpfs(files),
    });
}
