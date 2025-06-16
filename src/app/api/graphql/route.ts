import { v4 as uuidv4 } from "uuid";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import typeDefs from "../../../../schema.graphql";
import { ApolloServer } from "@apollo/server";
import type { Resolvers, ResolversTypes } from "./types.gen";
import { createClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/features/db/types.gen";
import { PinataSDK } from "pinata";
import { type Account, http, zeroAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { type LicenseTerms, StoryClient } from "@story-protocol/core-sdk";
import { SPG_NFT_CONTRACT_ADDRESS, STORY_CHAIN } from "@/constants";
import { ipfsUrl } from "@/utils/ipfs";
import { serverUploadToIpfs } from "../v1/ipfs/upload/route";

const supabase = createClient<Database>(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_ANON_KEY || "",
);

const account: Account = privateKeyToAccount(
    `0x${process.env.WALLET_PRIVATE_KEY}`,
);

const storyClient = StoryClient.newClient({
    account,
    transport: http(STORY_CHAIN.rpcUrls.default.http[0]),
    chainId: STORY_CHAIN.id,
});

const resolvers: Resolvers = {
    Query: {
        accounts: async (parent, args) => {
            const resp = await supabase.from("accounts").select();

            return {
                results: await Promise.all(
                    resp.data?.map(serializeAccount) || [],
                ),
            };
        },

        account: async (parent, args) => {
            const resp = await supabase.from("accounts").select().eq(
                "id",
                args.id,
            ).limit(1).maybeSingle();

            return {
                result: resp.data ? await serializeAccount(resp.data) : null,
            };
        },

        accountByWallet: async (parent, args) => {
            const resp = await supabase.from("accounts").select().eq(
                "wallet_address",
                args.walletAddress,
            ).limit(1).maybeSingle();

            return {
                result: resp.data ? await serializeAccount(resp.data) : null,
            };
        },
    },

    Mutation: {
        createAccount: async (parent, { request }) => {
            // const { IpfsHash } = await pinata.upload.json({});
            const id = uuidv4();
            const { error } = await supabase.from("accounts").insert({
                id,
                bio: "",
                name: request.name,
                wallet_address: request.walletAddress,
            });

            if (error) throw error;

            return { accountId: id };
        },

        updateAccount: async (parent, args) => {
            return { accountId: "" };
        },

        createIpAsset: async (parent, { request }) => {
            const accountResp = await supabase.from("accounts").select().eq(
                "id",
                request.accountId,
            ).limit(1).single();

            if (accountResp.error) throw accountResp.error;

            const account = accountResp.data;

            const ipMetadata = {
                title: `Registered likeness of ${account.name}`,
                description:
                    `The official registration of the likeness of ${account.name}`,
                image: ipfsUrl(request.imgIpfsHash),
                imageHash: `0x${request.imgIpfsHash}`,
                mediaUrl: ipfsUrl(request.imgIpfsHash),
                mediaHash: `0x${request.imgIpfsHash}`,
                mediaType: "image/png",
                tags: ["Likeness", "Person"],
                ipType: "Likeness",
                creators: [
                    {
                        name: account.name,
                        address: account.wallet_address,
                        description: account.bio,
                        contributionPercent: 100,
                        socialMedia: [
                            // {
                            //   platform: "Twitter",
                            //   url: "https://twitter.com/storyprotocol",
                            // },
                        ],
                    },
                ],
            };
            const nftMetadata = {
                name: `Likeness Registration NFT for ${account.name}`,
                image: ipfsUrl(request.imgIpfsHash),
                description:
                    `The registration of the likeness of ${account.name}`,
            };

            const [
                { contentsHash: ipHash, ipfsHash: ipIpfsHash },
                { contentsHash: nftHash, ipfsHash: nftIpfsHash },
            ] = await serverUploadToIpfs([
                new File([JSON.stringify(ipMetadata)], "ip_metadata.json", {
                    type: "application/json",
                }),
                new File([JSON.stringify(nftMetadata)], "nft_metadata.json", {
                    type: "application/json",
                }),
            ]);

            const resp = await storyClient.ipAsset.mintAndRegisterIp({
                spgNftContract: SPG_NFT_CONTRACT_ADDRESS,
                recipient: account.wallet_address as unknown as `0x${string}`,
                ipMetadata: {
                    ipMetadataURI: ipfsUrl(ipIpfsHash),
                    ipMetadataHash: `0x${ipHash}`,
                    nftMetadataURI: ipfsUrl(nftIpfsHash),
                    nftMetadataHash: `0x${nftHash}`,
                },
            });

            const updateAccResp = await supabase.from("accounts").update({
                likeness_ip_asset_address: resp.ipId,
            }).eq("id", request.accountId);

            if (updateAccResp.error) throw updateAccResp.error;

            return { ipId: resp.ipId as string };
        },

        addLicense: async (parent, { request }) => {
            const accountResp = await supabase.from("accounts").select().eq(
                "id",
                request.accountId,
            )
                .limit(1).single();

            if (accountResp.error) throw accountResp.error;

            const account = accountResp.data;

            const customLicense = request.custom!;

            const licenseTerms: LicenseTerms = {
                defaultMintingFee: BigInt(customLicense.defaultMintingFee),
                // must be a whitelisted revenue token from https://docs.story.foundation/developers/deployed-smart-contracts
                // in this case, we use $WIP
                currency: customLicense
                    .currencyAddress as unknown as `0x${string}`,
                // RoyaltyPolicyLAP address from https://docs.story.foundation/developers/deployed-smart-contracts
                royaltyPolicy: customLicense
                    .royaltyPolicyAddress as unknown as `0x${string}`,
                transferable: customLicense.transferable,
                expiration: BigInt(0),
                commercialUse: customLicense.commercialUse,
                commercialAttribution: customLicense.commercialAttribution,
                commercializerChecker: customLicense
                    .commercializerCheckerAddress as unknown as `0x${string}`,
                commercializerCheckerData: customLicense
                    .commercializerCheckerDataAddress as unknown as `0x${string}`,
                commercialRevShare: customLicense.commercialRevShare,
                commercialRevCeiling: BigInt(
                    customLicense.commercialRevCeiling,
                ),
                derivativesAllowed: customLicense.derivativesAllowed,
                derivativesAttribution: customLicense.derivativesAttribution,
                derivativesApproval: customLicense.derivativesApproval,
                derivativesReciprocal: customLicense.derivativesReciprocal,
                derivativeRevCeiling: BigInt(
                    customLicense.derivativeRevCeiling,
                ),
                uri: customLicense.licenseUri,
            };

            const pilResp = await storyClient.license.registerPILTerms({
                ...licenseTerms,
            });

            const attachResp = await storyClient.license.attachLicenseTerms({
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                licenseTermsId: pilResp.licenseTermsId!,
                ipId: account
                    .likeness_ip_asset_address as unknown as `0x${string}`,
            });

            if (!attachResp.success) throw new Error("failed to attach PIL");

            return { success: true };
        },
    },
};

async function serializeAccount(
    account: Tables<"accounts">,
): Promise<ResolversTypes["Account"]> {
    return {
        id: account.id,
        bio: account.bio,
        name: account.name,
        walletAddress: account.wallet_address,
        profileImageUrl: account.profile_image_url,
        likenessIPAssetAddress: account.likeness_ip_asset_address,
    };
}

const server = new ApolloServer<Resolvers>({
    resolvers,
    typeDefs,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
