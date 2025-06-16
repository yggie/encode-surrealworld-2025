import { gql } from "@/features/api/__generated__";
import type {
  CreateAccountMutationMutation,
  CreateAccountMutationMutationVariables,
} from "@/features/api/__generated__/graphql";
import { useMyRepliconAccount } from "@/features/myreplicon";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";

const CREATE_ACCOUNT_MUTATION = gql(`
mutation CreateAccountMutation($request: CreateAccountRequest!) {
createAccount(request: $request) {
  accountId
}
}`);

export const CreateAccountStep = () => {
  const { address } = useAccount();
  if (!address) throw new Error("unexpected");

  const { refreshAccount } = useMyRepliconAccount();

  const [createAccount, { loading, data, error }] =
    useMutation<CreateAccountMutationMutation>(CREATE_ACCOUNT_MUTATION);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const showLoadingSpinner = loading || !!data;

  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();

        handleSubmit(async (data) => {
          await createAccount({
            variables: {
              request: {
                name: data.name,
                walletAddress: address,
              },
            } satisfies CreateAccountMutationMutationVariables,
          });

          await new Promise((r) => setTimeout(r, 1000));

          await refreshAccount();
        })(e).catch((err) => {
          console.error(err);
        });
      }}
    >
      <div className="p-2 text-lg opacity-80 mb-8">
        <span>
          Let's start by creating your account, we just need a bit of basic
          information
        </span>
      </div>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Full Name</legend>
        <input
          type="text"
          className="input"
          {...register("name", {
            required: true,
          })}
        />
      </fieldset>

      <div className="flex flex-row justify-end mt-8">
        <button
          type="submit"
          className={"btn btn-primary"}
          disabled={showLoadingSpinner}
        >
          {showLoadingSpinner ? (
            <span className="loading loading-spinner" />
          ) : null}
          Create account
        </button>
      </div>
    </form>
  );
};
