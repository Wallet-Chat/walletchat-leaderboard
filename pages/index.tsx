import type { NextPage } from "next";
import { useAccount } from "wagmi";
import Dashboard from "./dashboard";

const Home: NextPage = () => {
  const { address: wagmiAddress } = useAccount();

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Home;
