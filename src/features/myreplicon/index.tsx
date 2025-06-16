"use client";

import {
  type ApolloError,
  useMutation,
  useSuspenseQuery,
} from "@apollo/client";
import { gql } from "../api/__generated__";
import type {
  MyAccountQueryQuery,
  UpdateMyAccountMutationMutation,
  UpdateMyAccountMutationMutationVariables,
} from "../api/__generated__/graphql";
import { useAccount } from "wagmi";
import { createContext, type ReactNode, useContext, useMemo } from "react";

const MY_ACCOUNT_QUERY = gql(`
query MyAccountQuery($wallet: String!) {
    accountByWallet(walletAddress: $wallet) {
        result {
            id
            bio
            name
            walletAddress
            likenessIPAssetAddress
        }
    }
}`);

const UPDATE_MY_ACCOUNT_MUTATION = gql(`
mutation UpdateMyAccountMutation($request: UpdateAccountRequest!) {
    updateAccount(request: $request) {
        accountId
    }
}`);

interface MyRepliconContextValue {
  refreshAccount: () => Promise<void>;
  account?: Exclude<MyAccountQueryQuery["accountByWallet"]["result"], null>;
  isUpdatingAccount: boolean;
  updateAccountError?: ApolloError;
  updateAccount: (
    request: UpdateMyAccountMutationMutationVariables["request"],
  ) => Promise<void>;
}

const MyRepliconContext = createContext<MyRepliconContextValue>(0 as never);

export const MyRepliconProvider = ({ children }: { children: ReactNode }) => {
  const wagmiAccount = useAccount();
  const { address } = wagmiAccount;

  console.log("myacc", { ...wagmiAccount });

  const { data: myAccount, refetch } = useSuspenseQuery<MyAccountQueryQuery>(
    MY_ACCOUNT_QUERY,
    { variables: { wallet: address || "" }, fetchPolicy: "network-only" },
  );

  const [updateAccount, { loading, error }] =
    useMutation<UpdateMyAccountMutationMutation>(UPDATE_MY_ACCOUNT_MUTATION);

  const stableParts = useMemo(
    () => ({
      refreshAccount: async () => {
        await refetch();
      },
      updateAccount: async (
        request: UpdateMyAccountMutationMutationVariables["request"],
      ) => {
        await updateAccount({
          variables: {
            request,
          } satisfies UpdateMyAccountMutationMutationVariables,
        });
      },
    }),
    [updateAccount, refetch],
  );

  const value = useMemo<MyRepliconContextValue>(() => {
    return {
      ...stableParts,
      account: myAccount.accountByWallet.result || undefined,
      isUpdatingAccount: loading,
      updateAccountError: error,
    };
  }, [myAccount, stableParts, loading, error]);

  return <MyRepliconContext value={value}>{children}</MyRepliconContext>;
};

export function useMyRepliconAccount() {
  return useContext(MyRepliconContext);
}
