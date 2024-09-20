"use client";
import { NumberAnimation } from "@/components/NumberAnimation";
import TextUp from "@/components/TextUp";
import {
  useInitData,
  useLaunchParams,
  useMainButton,
  usePopup,
  useUtils,
  useViewport,
} from "@telegram-apps/sdk-react";
import {
  AppRoot,
  Badge,
  Button,
  Card,
  Title,
} from "@telegram-apps/telegram-ui";
import { ArrowRightFromLine, LucideDog, ZapIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addOrUpdateUser,
  claimDailyReward,
  getActiveSkin,
  getUserInfo,
  setPoints,
} from "./actions/userActions";

const Home = () => {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [multiplierCost, setMultiplierCost] = useState(10);
  const [energy, setEnergy] = useState(982);
  const [lastBoostTime, setLastBoostTime] = useState<number>(0);
  const maxEnergy = 1000;
  const cooldownDuration = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const router = useRouter();
  const mainBtn = useMainButton();
  const [userInfo, setUserInfo] = useState<any>(null);
  const { initDataRaw } = useLaunchParams();
  const [nextClaimAt, setNextClaimAt] = useState("");
  const popUp = usePopup();
  const utils = useUtils();
  const initData = useInitData();
  const user = useMemo(() => initData?.user, [initData]);
  const [activeSkin, setActiveSkin] = useState<string>();

  const handleShare = async () => {
    utils.shareURL(
      "https://t.me/TapTapZooBot",
      "Join the fun in Tap Tap Zoo Game!"
    );
  };

  const animateTextUp = useCallback(() => {
    setAnimationTrigger((prev) => prev + 1);
  }, []);

  const handleClick = () => {
    if (energy > 0) {
      setCount((prevCount) => prevCount + multiplier);
      setEnergy((prevEnergy) => prevEnergy - 1);

      animateTextUp();
    }
  };

  const buyMultiplier = () => {
    if (count >= multiplierCost) {
      setCount((prevCount) => prevCount - multiplierCost);
      setMultiplier((prevMultiplier) => prevMultiplier + 1);
      setMultiplierCost((prevCost) => Math.floor(prevCost * 1.5));
    }
  };

  const boost = () => {
    const currentTime = new Date().getTime();
    if (
      lastBoostTime === null ||
      currentTime >= lastBoostTime + cooldownDuration
    ) {
      setEnergy(maxEnergy);
      setLastBoostTime(currentTime);
      return `Energy boosted to ${maxEnergy}. Boost used.`;
    } else {
      const remainingTime = Math.ceil(
        (lastBoostTime + cooldownDuration - currentTime) / (60 * 1000)
      );
      return `Boost is on cooldown. Try again in ${remainingTime} minutes.`;
    }
  };

  useEffect(() => {
    const replenishEnergy = () => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 3, maxEnergy));
    };

    const intervalId = setInterval(replenishEnergy, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (userInfo) {
      setCount(+userInfo.points);
      setMultiplier(+userInfo.multiplier);
      setMultiplierCost(userInfo.multiplierCost);
    }
  }, [userInfo]);

  useEffect(() => {
    mainBtn.hide();
  }, []);

  useEffect(() => {
    const handleAddOrUpdateUser = async () => {
      if (user) {
        const result = await addOrUpdateUser(user.id, user.username || "");
      }
    };

    const handleGetUserInfo = async () => {
      if (user) {
        const info = await getUserInfo(user.id);
        console.log("🚀 ~ handleGetUserInfo ~ info:", info);
        setUserInfo(info);
        setNextClaimAt(info.nextClaimAt);
      }
    };

    handleAddOrUpdateUser();
    handleGetUserInfo();
  }, [user]);

  useEffect(() => {
    const updatePoints = async () => {
      if (user) {
        await setPoints(user.id, {
          points: count,
          multiplier,
          multiplierCost,
          energy,
        });
      }
    };

    const intervalId = setInterval(updatePoints, 3000);

    return () => clearInterval(intervalId);
  }, [user, count, energy]);

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
  const handleClaimReward = async () => {
    if (nextClaimAt && new Date(nextClaimAt) > new Date()) {
      handlePopUp();
    } else {
      if (user) {
        const result = await claimDailyReward(user.id);
        setNextClaimAt(result.nextClaimAt);
      }
    }
  };

  useEffect(() => {
    const fetchActiveSkin = async () => {
      if (user) {
        try {
          const skin = await getActiveSkin(user.id);
          setActiveSkin(skin);
        } catch (error) {
          console.error("Error fetching active skin:", error);
          // Optionally set a default skin if there's an error
          setActiveSkin("penguin");
        }
      }
    };

    fetchActiveSkin();
  }, [user]);

  return (
    <AppRoot className="font-sans flex flex-col mx-3">
      <Card className="rounded-lg p-2 mb-2">
        <div className="flex justify-between items-center p-2">
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-row gap-2">
              <img
                src="/emoji.jpeg"
                alt="user avatar"
                className="rounded-full mr-2 w-10 h-10 object-cover outline outline-1 outline-offset-1 outline-gradient-to-r from-purple-400 to-pink-600"
              />
              <div className="flex flex-col">
                <Badge type={"number"} className="text-sm">
                  Explorer
                </Badge>
                <Title className="text-lg">
                  {userInfo ? userInfo.username : "John Lin"}
                </Title>
                {/* <Subheadline></Subheadline> */}
              </div>
            </div>
            <Button
              className="text-xs px-2 py-1 rounded"
              onClick={() => router.push("/skins")}
            >
              Buy skin
            </Button>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Card
          className="p-2 rounded-lg text-center"
          onClick={handleClaimReward}
        >
          <img
            src="/actions/calendar.webp"
            alt="Daily reward"
            className="mx-auto w-16 h-16"
          />
          {nextClaimAt && new Date(nextClaimAt) > new Date() ? (
            <p className="text-xs">
              Next claim at:{" "}
              {new Date(nextClaimAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
          ) : (
            <p className="text-xs">Daily reward</p>
          )}
        </Card>
        <Card
          className="p-2 rounded-lg text-center"
          // onClick={() => router.push("/test2")}
        >
          <img
            src="/actions/coins.webp"
            alt="Earn"
            className="mx-auto w-16 h-16"
          />
          <p className="text-xs">Earn</p>
        </Card>
        <Card className="p-2 rounded-lg text-center" onClick={handleShare}>
          <img
            src="/actions/announce.webp"
            alt="Share"
            className="mx-auto w-16 h-16"
          />
          <p className="text-xs">Share</p>
        </Card>
      </div>
      <div className="flex justify-between items-center mb-4">
        <LucideDog className="mx-4" onClick={() => {}} />
        <NumberAnimation value={count} />
        <ArrowRightFromLine className="mx-4" onClick={() => {}} />
      </div>

      <div className="flex justify-center items-center relative">
        <div>
          <div
            onClick={handleClick}
            className="rounded-full p-1 w-48 h-48 transform transition-transform duration-150 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {activeSkin ? (
              <img
                src={`skins/${activeSkin}.webp`}
                alt="Active Skin"
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <Image
                src={"/loader.svg"}
                alt="loader"
                width={24}
                height={24}
                className="animate-spin rounded-full w-full h-full object-cover"
              />
            )}
            <div className="absolute -top-8 left-0 flex justify-center items-center w-full h-full">
              <TextUp animationTrigger={animationTrigger} points={multiplier} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center pt-2">
        <p className="text-sm">Current multiplier: x{multiplier}</p>
        <Button
          stretched
          mode="plain"
          onClick={buyMultiplier}
          disabled={count < multiplierCost}
        >
          Buy Multiplier (Cost: {multiplierCost})
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="pr-2">
            <ZapIcon />
          </div>
          <span>
            {energy} / {maxEnergy}
          </span>
        </div>
        <Button
          className="px-4 py-2 rounded-full"
          onClick={() => {
            const result = boost();
            // You can use this result to show a notification or alert to the user
            console.log(result);
          }}
          disabled={lastBoostTime !== 0}
        >
          Boost
        </Button>
      </div>
      <div className="flex-grow" />
    </AppRoot>
  );
};

export default Home;
