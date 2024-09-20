"use client";

import { treasuryAddress } from "@/constants";
import { tokenAbi } from "@/constants/abi";
import { useInitData, useMainButton, usePopup } from "@telegram-apps/sdk-react";
import { AppRoot, Button, Card, Title } from "@telegram-apps/telegram-ui";
import { LockIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { buySkinAction, fetchMarketplaceAction } from "../actions/skinActions";
import { setActiveSkin } from "../actions/userActions";

interface SkinsData {
  name: string;
  bio: string;
  price: number;
  currency: string;
  locked: boolean;
}

export default function SkinSelectionPage() {
  const [skins, setSkins] = useState<SkinsData[]>([]);
  const [selectedSkin, setSelectedSkin] = useState<SkinsData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<
    "idle" | "sendingCAKE" | "buyingSkin"
  >("idle");

  const mainBtn = useMainButton();
  const popup = usePopup();
  const initData = useInitData();
  const user = useMemo(() => initData?.user, [initData]);
  const { address } = useAccount();
  // Check CAKE balance
  const { data: balance, refetch } = useReadContract({
    abi: tokenAbi,
    address: "0x3055913c90Fcc1A6CE9a358911721eEb942013A1", // CAKE token address
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: purchaseStep === "sendingCAKE" ? hash : undefined,
    });

  const fetchMarketplaceData = async () => {
    if (!user?.id) {
      setError("User ID is required");
      return;
    }

    try {
      const skins = await fetchMarketplaceAction(user.id);
      setSkins(skins);
      setSelectedSkin(skins[0]);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch marketplace data");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const handleCAKETransfer = async () => {
    if (!selectedSkin || selectedSkin.currency !== "CAKE" || !address) return;

    const { data } = await refetch();
    const formattedBalance = balance ? Number(formatEther(data || balance)) : 0;

    if (formattedBalance < 1) {
      if (!popup.isOpened) {
        setPurchaseStep("idle");
        setIsPurchasing(false);
        mainBtn.hideLoader();

        popup.open({
          title: "Insufficient Balance",
          message: `You need at least 1 CAKE to purchase this skin. Your current balance is ${formattedBalance.toFixed(
            2
          )} CAKE.`,
          buttons: [{ type: "close" }],
        });
      }
      return;
    }

    setPurchaseStep("sendingCAKE");
    try {
      writeContract({
        address: "0x3055913c90Fcc1A6CE9a358911721eEb942013A1",
        abi: tokenAbi,
        functionName: "transfer",
        args: [treasuryAddress, parseEther("1")],
      });
    } catch (err) {
      console.error("CAKE transfer failed:", err);
      setError("Failed to transfer CAKE");
      setPurchaseStep("idle");
      setIsPurchasing(false);
      mainBtn.hideLoader();
    }
  };

  useEffect(() => {
    if (isConfirmed && purchaseStep === "sendingCAKE") {
      handleSkinPurchase();
    }
  }, [isConfirmed, purchaseStep]);

  const handleSkinPurchase = async () => {
    if (!selectedSkin || !user?.id) return;

    setPurchaseStep("buyingSkin");
    try {
      await buySkinAction(user.id, selectedSkin.name);
      await fetchMarketplaceData();
      setPurchaseStep("idle");
      setIsPurchasing(false);
      mainBtn.hideLoader();

      if (!popup.isOpened) {
        popup.open({
          title: "Success",
          message: `You've successfully purchased the ${selectedSkin.name} skin!`,
          buttons: [{ type: "close" }],
        });
      }
    } catch (err) {
      console.error("Skin purchase failed:", err);
      // setError("Failed to purchase skin");
      setPurchaseStep("idle");
      setIsPurchasing(false);
      mainBtn.hideLoader();
    }
  };

  const handleMainBtn = () => {
    if (!selectedSkin) return;

    mainBtn.enable();
    mainBtn.setText("Purchase");
    mainBtn.setBgColor("#08F7AF");

    if (selectedSkin.locked) {
      mainBtn.show();
    } else {
      mainBtn.hide();
    }
  };

  useEffect(() => {
    handleMainBtn();

    const handlePurchase = async () => {
      if (isPurchasing) {
        console.log("Purchase already in progress");
        return;
      }

      setIsPurchasing(true);
      mainBtn.showLoader();

      if (!user?.id) {
        setError("User ID is required");
        setIsPurchasing(false);
        mainBtn.hideLoader();
        return;
      }

      if (selectedSkin && selectedSkin.currency === "CAKE") {
        await handleCAKETransfer();
      } else {
        await handleSkinPurchase();
      }
    };

    const removeListener = mainBtn.on("click", handlePurchase, true);

    return () => {
      removeListener();
    };
  }, [selectedSkin, user?.id, isPurchasing]);

  if (!user?.id) return <div>Loading user data...</div>;
  if (loading) return <div>Loading marketplace data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <AppRoot className="flex flex-col gap-2 px-2">
      <Title className="text-3xl font-bold pl-4">Skins</Title>
      <div className="flex h-[calc(100vh-120px)] justify-between">
        <div className="w-1/2 px-2 flex flex-col items-center h-full">
          {selectedSkin && (
            <Card className="p-4 w-full">
              <img
                alt={selectedSkin.name}
                src={`/skins/${selectedSkin.name}.webp`}
                className="rounded object-cover w-full h-full"
              />
            </Card>
          )}
          {selectedSkin && (
            <div className="text-start pt-4 pl-2">
              <h2 className="text-3xl font-bold mb-2">
                {selectedSkin.name.charAt(0).toUpperCase() +
                  selectedSkin.name.slice(1)}
              </h2>
              <p className="text-lg text-gray-500 mb-4">{selectedSkin.bio}</p>
              <p className="text-2xl font-bold mb-2">
                {selectedSkin.price} {selectedSkin.currency}
              </p>
            </div>
          )}
        </div>
        <div className="w-1/2 overflow-y-auto h-[calc(100vh-120px)]">
          <div className="flex flex-col gap-2 px-2">
            {skins.map((skin) => (
              <Card
                key={skin.name}
                onClick={() => setSelectedSkin(skin)}
                className="cursor-pointer relative"
              >
                <React.Fragment>
                  <Card.Chip readOnly>
                    {skin.name.charAt(0).toUpperCase() + skin.name.slice(1)}
                  </Card.Chip>
                  <img
                    alt={skin.name}
                    src={`/skins/${skin.name}.webp`}
                    style={{
                      display: "block",
                      objectFit: "cover",
                      filter: skin.locked ? "brightness(0.5)" : "none",
                    }}
                  />
                  {skin.locked && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <LockIcon size={48} />
                    </div>
                  )}

                  {skin.locked ? (
                    <Card.Cell
                      className="w-full"
                      readOnly
                      subtitle={
                        skin.locked ? skin.price + " " + skin.currency : ""
                      }
                    >
                      {skin.bio}
                    </Card.Cell>
                  ) : (
                    <Button
                      className="w-full"
                      stretched
                      onClick={async () => {
                        await setActiveSkin(user.id, skin.name);

                        if (!popup.isOpened) {
                          popup.open({
                            title: "Using the " + skin.name + " Skin",
                            message: `You are now using the ${skin.name} skin.`,
                            buttons: [{ type: "close" }],
                          });
                        }
                      }}
                    >
                      Use
                    </Button>
                  )}
                </React.Fragment>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppRoot>
  );
}
