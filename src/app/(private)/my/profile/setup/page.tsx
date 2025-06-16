"use client";

import { useMyRepliconAccount } from "@/features/myreplicon";
import clsx from "clsx";
import { CreateLikenessAssetStep } from "./CreateLikenessAssetStep";
import { CreateAccountStep } from "./CreateAccountStep";
import { AddLicensesStep } from "./AddLicensesStep";

export default function SetupMyProfilePage() {
  const { account } = useMyRepliconAccount();

  const step = account ? (account.likenessIPAssetAddress ? 2 : 1) : 0;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-xl mt-4">Complete your profile</h1>

      <ul className="steps w-full mt-4 mb-8">
        <li className={clsx("step", step >= 0 ? "step-primary" : "")}>
          Create account
        </li>
        <li className={clsx("step", step >= 1 ? "step-primary" : "")}>
          Register your likeness
        </li>
        <li className={clsx("step", step >= 2 ? "step-primary" : "")}>
          Define licenses
        </li>
        <li className={clsx("step", step >= 3 ? "step-primary" : "")}>
          Profit
        </li>
      </ul>

      {step === 2 ? (
        <AddLicensesStep />
      ) : step === 1 ? (
        <CreateLikenessAssetStep />
      ) : (
        <CreateAccountStep />
      )}
    </div>
  );
}
