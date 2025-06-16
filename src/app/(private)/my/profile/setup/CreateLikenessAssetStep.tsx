import { gql } from "@/features/api/__generated__";
import type { CreateIpAssetMutationMutationVariables } from "@/features/api/__generated__/graphql";
import { useMyRepliconAccount } from "@/features/myreplicon";
import { ExternalLink } from "@/ui/text/ExternalLink";
import { uploadToIpfs } from "@/utils/ipfs";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiExternalLink } from "react-icons/fi";

const CREATE_IP_ASSET_MUTATION = gql(`
mutation CreateIpAssetMutation($request: CreateIpAssetRequest!) {
  createIpAsset(request: $request) {
    ipId
  }
}
`);

interface CreateLikenessAssetFormValues {
  height?: number;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "non-binary";
}

export const CreateLikenessAssetStep = () => {
  const { account, updateAccount, refreshAccount } = useMyRepliconAccount();

  if (!account) throw new Error("unexpected");

  const [imgFile, setImgFile] = useState<File | null>(null);

  const [createIpAsset, { loading, error, data }] = useMutation(
    CREATE_IP_ASSET_MUTATION,
  );

  const { register, handleSubmit } = useForm<CreateLikenessAssetFormValues>({
    defaultValues: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();

        handleSubmit(async (data) => {
          console.log("submit", data);
          if (!imgFile) throw new Error("no file");

          setIsSubmitting(true);

          await updateAccount({
            height: Number(data.height) || undefined,
          });

          const latestBio = account.bio;

          const [{ ipfsHash: imgIpfsHash, contentsHash: imgHash }] =
            await uploadToIpfs([imgFile]);

          await createIpAsset({
            variables: {
              request: {
                accountId: account.id,
                imgHash,
                imgIpfsHash,
              },
            } satisfies CreateIpAssetMutationMutationVariables,
          });

          await refreshAccount();
        })(e).catch((err) => {
          setIsSubmitting(false);
          console.error(err);
        });
      }}
    >
      <div className="p-2 text-lg opacity-80 mb-8">
        <span>
          Now let's register your likeness as an IP Asset on{" "}
          <ExternalLink href="https://www.story.foundation/">
            Story
          </ExternalLink>
          . This serves as your identification on the platform that will help us
          protect your digital identity
        </span>
      </div>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Photo upload <span className="text-red-400">(required)</span>
        </legend>
        <input
          type="file"
          className="file-input file-input-primary"
          onChange={(ev) => {
            setImgFile(ev.target.files?.[0] || null);
          }}
        />
        <p className="label">We need a clear, professional headshot of you</p>
      </fieldset>

      <div role="alert" className="alert alert-info alert-soft my-4">
        <span>
          Filling the remaining information is optional, but it will help
          companies find who are looking for people like you
        </span>
      </div>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Date of Birth</legend>
        <input type="date" className="input" {...register("dateOfBirth")} />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Height (in cm)</legend>
        <input
          type="number"
          className="input"
          min={0}
          max={300}
          placeholder="e.g. 160"
          {...register("height")}
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Gender</legend>
        <select className="select" {...register("gender")}>
          <option disabled>Pick your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non binary</option>
        </select>
      </fieldset>

      <div className="flex flex-row justify-end mt-8">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!imgFile || isSubmitting}
        >
          {isSubmitting ? <span className="loading loading-spinner" /> : null}
          Register my likeness
        </button>
      </div>
    </form>
  );
};
