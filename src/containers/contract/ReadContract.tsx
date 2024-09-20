"use client";

import { tokenAddress } from "@/constants";
import { tokenAbi } from "@/constants/abi";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";

export function ReadContract() {
  const { address } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    data: balance,
    status,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    abi: tokenAbi,
    address: tokenAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    refetch();
  };

  const formattedBalance = balance
    ? Number(formatEther(balance)).toFixed(0)
    : "0";

  return (
    <div className="text-left my-8">
      {isLoading ? (
        <div>Loading</div>
      ) : error ? (
        <div className="text-red-500">Error</div>
      ) : (
        <div className="text-2xl flex items-center">
          <span>
            Current Balance:{" "}
            <span className="text-primary">{formattedBalance} TTZ</span>
          </span>
          <button
            onClick={handleRefresh}
            className="ml-4 p-2 rounded-full hover:bg-gray-200"
            aria-label="Refresh balance"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
