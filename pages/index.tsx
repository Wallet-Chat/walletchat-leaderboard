import type { NextPage } from "next";
import LoginPage from "./dashboard/login";
import { useAccount } from "wagmi";
import Dashboard from "./dashboard";

const Home: NextPage = () => {
  const { address: wagmiAddress } = useAccount();

  if (!wagmiAddress) return <LoginPage />;

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Home;
