import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function LoginPage() {
  return (
    <main className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center mb-10">
        <img
          src="https://walletchat-pfp-storage.sgp1.digitaloceanspaces.com/intra.png"
          alt=""
          style={{ maxWidth: '250px', height: 'auto' }}
        />
         <h1 className="md:text-xl text-xl text-white font-bold" style={{ fontFamily: 'Epilog, sans-serif' }}>
          in collaboration with
        </h1>
        <img
          src="https://walletchat-pfp-storage.sgp1.digitaloceanspaces.com/biohackerDAO_dark.png"
          alt=""
          style={{ maxWidth: '400px', height: 'auto' }}
        />
        <h1 className="md:text-6xl text-4xl text-white font-bold" style={{ fontFamily: 'Epilog, sans-serif' }}>
          Points Leaderboard
        </h1>
        <h2 className="text-white py-5">Connect your wallet to get started</h2>
        <ConnectButton />
      </div>
    </main>
  );
}

export default LoginPage;
