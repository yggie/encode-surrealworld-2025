"use client";

import { gql } from "@/features/api/__generated__";
import type { AddLicenseMutationMutationVariables } from "@/features/api/__generated__/graphql";
import { useMyRepliconAccount } from "@/features/myreplicon";
import { ExternalLink } from "@/ui/text/ExternalLink";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zeroAddress } from "viem";

type LicenseTemplateOption =
  | "non-commercial-social-remix"
  | "commercial-use"
  | "commercial-remix"
  | "creative-commons-attribution"
  | "custom";

const ADD_LICENSE_MUTATION = gql(`
mutation AddLicenseMutation($request: AddLicenseRequest!) {
  addLicense(request: $request) {
    success
  }
}
`);

export const AddLicensesStep = () => {
  const { account } = useMyRepliconAccount();

  const [addLicense, { loading, error }] = useMutation(ADD_LICENSE_MUTATION);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      licenseTemplate:
        "commercial-use" satisfies LicenseTemplateOption as LicenseTemplateOption,

      defaultMintingFee: 0,
      // must be a whitelisted revenue token from https://docs.story.foundation/developers/deployed-smart-contracts
      // in this case, we use $WIP
      currencyAddress: "0x1514000000000000000000000000000000000000",
      // RoyaltyPolicyLAP address from https://docs.story.foundation/developers/deployed-smart-contracts
      royaltyPolicyAddress: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E",
      transferable: false,
      expiration: 0,
      commercialUse: false,
      commercialAttribution: false,
      commercializerCheckerAddress: zeroAddress as string,
      commercializerCheckerDataAddress: "0x",
      commercialRevShare: 0,
      commercialRevCeiling: 0,
      derivativesAllowed: false,
      derivativesAttribution: false,
      derivativesApproval: false,
      derivativesReciprocal: false,
      derivativeRevCeiling: 0,
      licenseUri: "",
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSubmit(async ({ licenseTemplate, ...rest }) => {
            if (!account || !account.likenessIPAssetAddress)
              throw new Error("unexpected");

            setIsSubmitting(true);

            // await addLicense({
            //   variables: {
            //     request: {
            //       ...rest,

            //       accountId: account.id,
            //     },
            //   } satisfies AddLicenseMutationMutationVariables,
            // });

            await new Promise((r) => setTimeout(r, 3000));

            // do something
          })(e).catch((e) => {
            setIsSubmitting(false);
            console.error(e);
          });
        }}
      >
        <div className="p-2 text-lg opacity-80 mb-8">
          <span>
            In order to monetise your likeness, you will need smart Licensing
            agreements. These are tamper-proof smart documents that are
            automatically enforced by the platform.
          </span>
        </div>

        <fieldset className="fieldset bg-base-100 border border-base-300 rounded-box p-4 w-1/2">
          <legend className="fieldset-label">License template</legend>
          <p className="label">
            Pick from one of the licensing templates below or use a custom
            template
          </p>

          <label className="label">
            <input
              type="radio"
              className="radio"
              value="non-commercial-social-remix"
              {...register("licenseTemplate")}
            />
            Non-Commercial Social Remixing
          </label>

          <label className="label">
            <input
              type="radio"
              className="radio"
              value="commercial-use"
              {...register("licenseTemplate")}
            />
            Commercial Use
          </label>

          <label className="label">
            <input
              type="radio"
              className="radio"
              value="commercial-remix"
              {...register("licenseTemplate")}
            />
            Commercial Remix
          </label>

          <label className="label">
            <input
              type="radio"
              className="radio"
              value="creative-commons-attribution"
              {...register("licenseTemplate")}
            />
            Creative Commons Attribution
          </label>

          <label className="label">
            <input
              type="radio"
              className="radio"
              value="custom"
              {...register("licenseTemplate")}
            />
            Custom agreement
          </label>
        </fieldset>

        <div className="p-4">
          {renderLicenseTemplateInfo(watch("licenseTemplate"))}
        </div>

        <div className="mt-8 flex flex-row justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="loading loading-spinner" /> : null}
            Add license
          </button>
        </div>
      </form>
    </div>
  );
};

function renderLicenseTemplateInfo(template: LicenseTemplateOption) {
  switch (template) {
    case "non-commercial-social-remix":
      return (
        <div role="alert" className="alert alert-info alert-outline">
          <p>
            Let the world build on and play with your creation. This license
            allows for endless free remixing while tracking all uses of your
            work while giving you full credit. Similar to: TikTok plus
            attribution.{" "}
            <ExternalLink href="https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors#non-commercial-social-remixing">
              Learn more
            </ExternalLink>
            <br />
            <br />
            <span>
              <strong>Who uses Creative Commons Attribution?</strong>
            </span>
          </p>
        </div>
      );

    case "creative-commons-attribution":
      return (
        <div role="alert" className="alert alert-info alert-outline">
          <p>
            Let the world build on and play with your creation - including
            making money.{" "}
            <ExternalLink href="https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors#creative-commons-attribution">
              Learn more
            </ExternalLink>
            <br />
            <br />
            <span>
              <strong>Who uses Creative Commons Attribution?</strong>
            </span>
          </p>
        </div>
      );

    case "commercial-use": {
      return (
        <div role="alert" className="alert alert-info alert-outline">
          <p>
            Retain control over reuse of your work, while allowing anyone to
            appropriately use the work in exchange for the economic terms you
            set. This is similar to Shutterstock with creator-set rules.{" "}
            <ExternalLink href="https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors#commercial-use">
              Learn more
            </ExternalLink>
            <br />
            <br />
            <span>
              <strong>Who uses Creative Commons Attribution?</strong>
            </span>
          </p>
        </div>
      );
    }

    case "commercial-remix": {
      return (
        <div role="alert" className="alert alert-info alert-outline">
          <p>
            Let the world build on and play with your creation… and earn money
            together from it! This license allows for endless free remixing
            while tracking all uses of your work while giving you full credit,
            with each derivative paying a percentage of revenue to its “parent”
            IP.{" "}
            <ExternalLink href="https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors#commercial-remix">
              Learn more
            </ExternalLink>
            <br />
            <br />
            <span>
              <strong>Who uses Creative Commons Attribution?</strong>
            </span>
          </p>
        </div>
      );
    }

    case "custom": {
      return (
        <div role="alert" className="alert alert-warning alert-outline">
          <span>
            Custom licenses can be difficult to get right, this option is
            intended for advanced users only
          </span>
        </div>
      );
    }

    default:
      return null;
  }
}
