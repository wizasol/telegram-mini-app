"use client";

import { WriteContract } from "@/containers/contract/WriteContract";
import { ReadContract } from "@/containers/contract/ReadContract";

import { useAccount } from "wagmi";
import { usePopup, useUtils } from "@telegram-apps/sdk-react";
function ContractExample() {
  const { isConnected } = useAccount();
  const popUp = usePopup();
  const utils = useUtils();

  const handlePopUp = async () => {
    const response = await popUp.open({
      title: " Rabble",
      message: "Link will lead to website",
      buttons: [
        { id: "link", type: "default", text: "Open rabble.pro" },
        { type: "cancel" },
      ],
    });
    if (response === "link") {
      utils.openLink("https://rabble.pro");
    }
  };

  return (
    <div className="">
      {isConnected ? (
        <>
          <ReadContract />
          <WriteContract />
        </>
      ) : (
        <div className=" flex flex-col gap-4 items-center justify-center text-center text-2xl ">
          Please Connect the Wallet
        </div>
      )}
    </div>
  );
}

export default ContractExample;
