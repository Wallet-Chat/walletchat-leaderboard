import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function LoginPage() {
  return (
    <main className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center mb-10">
        <img
          className="rounded-full h-48 w-48 mb-10"
          src="https://uploads-ssl.webflow.com/62d761bae8bf2da003f57b06/62d761bae8bf2dea68f57b52_walletchat%20logo.png"
          alt=""
        />
        <h1 className="md:text-6xl text-4xl text-white font-bold">
          WalletChat Leaderboard
        </h1>
        <h2 className="text-white py-5">Connect your wallet to get started</h2>
        <ConnectButton />
      </div>
    </main>
  );
}

export default LoginPage;
