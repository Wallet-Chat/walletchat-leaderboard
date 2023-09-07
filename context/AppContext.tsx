import React, {
  useState,
  ReactElement,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useAccount } from "wagmi";

interface AppContextType {
  leaderboard: string[];
  connectedWalletData: any;
  fetchLeaderboard: () => void;
  fetchConnectedWalletData: () => void;
}

interface Props {
  children: ReactElement;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppContextProvider = ({ children }: Props) => {
  const { address: wagmiAddress } = useAccount();
  const [leaderboard, setLeaderboard] = useState<string[]>([]);
  const [connectedWalletData, setConnectedWalletData] = useState();

  useEffect(() => {
    fetchConnectedWalletData();
    fetchLeaderboard();
  }, []);

  /**
   * @dev to fetch leaderboard
   */
  const fetchLeaderboard = async () => {
    let leaderboard;
    console.log("fetching leaderboard");
    // Setup request options:
    var requestOptions = {
      method: "GET",
    };
    const baseURL = `https://api.v2.walletchat.fun/get_leaderboard_data`;

    leaderboard = await fetch(baseURL, requestOptions).then((data) =>
      data.json()
    );

    if (leaderboard) {
      console.log(leaderboard);
      setLeaderboard(leaderboard);
    }
  };

  const fetchConnectedWalletData = async () => {
    let connectedWalletData;
    console.log("fetching connectedWalletData");
    // Setup request options:
    var requestOptions = {
      method: "GET",
    };
    const baseURL = `https://api.v2.walletchat.fun/get_leaderboard_data/${wagmiAddress}`;

    connectedWalletData = await fetch(baseURL, requestOptions).then((data) =>
      data.json()
    );

    if (connectedWalletData) {
      console.log(connectedWalletData);
      setConnectedWalletData(connectedWalletData);
    }
  };

  return (
    <AppContext.Provider
      value={{
        fetchLeaderboard,
        fetchConnectedWalletData,
        leaderboard,
        connectedWalletData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
