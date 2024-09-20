"use server";

import { revalidatePath } from "next/cache";

export async function buySkinAction(chatId: number, skinName: string) {
  const response = await fetch(`${process.env.API_URL}/buy-skin/${chatId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skinName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to purchase skin");
  }

  // Revalidate the marketplace page to reflect the changes
  revalidatePath("/skins");
}

export async function fetchMarketplaceAction(chatId: number) {
  const response = await fetch(`${process.env.API_URL}/marketplace/${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch marketplace data");
  }

  return response.json();
}
