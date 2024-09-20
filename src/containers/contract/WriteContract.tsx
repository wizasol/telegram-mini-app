"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { tokenAddress } from "@/constants";
import { tokenAbi } from "@/constants/abi";

export function WriteContract() {
  const { data: hash, isPending, writeContract } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tokenId = formData.get("value") as string;
    console.log(tokenId);
    writeContract({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "mint",
      args: [BigInt(tokenId)],
    });
  }

  const {
    isLoading: isConfirming,
    error,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction Successful");
    }
    if (error) {
      toast.error("Transaction Failed");
    }
  }, [isConfirmed, error]);

  return (
    <form onSubmit={submit}>
      <p className="text-sm text-gray-500">
        Make this counter your favorite number
      </p>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          name="value"
          placeholder="14"
          type="number"
          required
          className="bg-black text-white rounded-full "
        />
        <Button
          disabled={isPending || isConfirming}
          type="submit"
          variant={"default"}
          size={"one-third"}
        >
          {isPending ? "Confirming..." : "Set Number"}
        </Button>
      </div>
    </form>
  );
}
