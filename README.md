
![Banner](https://github.com/user-attachments/assets/c5f0684c-ae59-4d7d-8204-aad9130ce3d1)

# TapTapZoo Mini Game

Tap, score, and style: Unlock epic skins in this addictive Telegram crypto game!

## Demo

https://t.me/TapTapZooBot

## The problem it solves

TapTapZoo Mini Game addresses three significant pain points:

1. **Seamless Crypto Integration**: It solves the lack of infrastructure and poor user experience for EVM wallets inside Telegram, making crypto interactions smooth and user-friendly.

2. **Tapping into Telegram's Massive User Base**: The game unlocks access to Telegram's 900 million monthly active users as of 2024, leveraging the platform's recent launch of an app store and its evolution into a super app like WeChat.

3. **Bridging Gaming and Crypto**: It introduces an engaging way for Telegram users to interact with cryptocurrency and blockchain technology through a fun, accessible mini-game, potentially onboarding new users to the crypto space.

## Challenges I ran into

During the development of TapTapZoo Mini Game, we encountered several challenges:

1. **Cross-Platform Compatibility**: Wallet and social login functions that worked on the web didn't perform consistently inside Telegram, while wallet login only functioned in the Telegram desktop app. After testing various methods, we found that email login worked universally.

2. **Token Integration**: Initially, we wanted to use a custom token for in-game asset purchases, aiming for seamless integration with 1inch. Despite pairing it on Uniswap, we faced persistent "no liquidity" issues on 1inch. We learned that 1inch requires at least $10,000 USD equivalent value for connector assets like USDC or ETH. Lacking this amount, we pivoted to using mock partner tokens like PancakeSwap for exclusive skin purchases.

3. **Platform-Specific Behavior**: We discovered that the game behaved differently across various platforms, particularly in the iOS Telegram app. This inconsistency made debugging challenging. To address this, we utilized ngrok to expose our development environment and verify key functionalities across different platforms.

## Technologies I used

Telegram-apps SDK, Telegram UI, Next.js, Wagmi, AppKit (Email Wallets, On-Ramp, and Swaps), Node.js, PostgreSQL
