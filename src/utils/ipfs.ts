export function ipfsUrl(hash: string) {
    return `https://ipfs.io/ipfs/${hash}`;
}

export async function uploadToIpfs(
    files: File[],
): Promise<{ ipfsHash: string; contentsHash: string }[]> {
    const formData = new FormData();
    for (const file of files) {
        formData.append("files", file);
    }

    const resp = await fetch("/api/v1/ipfs/upload", {
        method: "POST",
        body: formData,
    });

    return (await resp.json()).results;
}
