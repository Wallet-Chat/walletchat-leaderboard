import React, {
  useState,
  ReactElement,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useAccount } from "wagmi";

const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

interface AppContextType {
  leaderboard: any[];
  referralCodes: string[];
  connectedWalletData: any;
  loadingWalletData: boolean;
  fetchLeaderboard: () => void;
  fetchConnectedWalletData: () => void;
  fetchReferralCodes: () => void;
}

interface Props {
  children: ReactElement;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppContextProvider = ({ children }: Props) => {
  const { address: wagmiAddress, isConnected } = useAccount();
  const [leaderboard, setLeaderboard] = useState<string[]>([]);
  const [connectedWalletData, setConnectedWalletData] = useState();
  const [referralCodes, setReferralCodes] = useState<string[]>([]);
  const [loadingWalletData, setLoadingWalletData] = useState<boolean>(false);
  const [cookieWalletAddress, setCookieWalletAddress] =
    useState<string | undefined>(undefined);

  useEffect(() => {
    const cookieAddr = getCookie("walletAddress");
    if (cookieAddr) setCookieWalletAddress(cookieAddr);
  }, []);

  useEffect(() => {
    fetchConnectedWalletData();
    fetchLeaderboard();
    fetchReferralCodes();
  }, [isConnected, wagmiAddress, cookieWalletAddress]);

  /**
   * @dev to fetch leaderboard
   */
  const fetchLeaderboard = async () => {
    try {
      let leaderboard;
      var requestOptions = {
        method: "GET",
      };
      const baseURL = `${process.env.NEXT_PUBLIC_WALLETCHAT_API_URL}/get_intra_leaderboard_data`;

      leaderboard = await fetch(baseURL, requestOptions).then((data) =>
        data.json()
      );

      console.log("leaderboard: ", leaderboard)

      if (leaderboard) {
        setLeaderboard(leaderboard);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConnectedWalletData = async () => {
    try {
      const wallet = wagmiAddress || cookieWalletAddress;
      if (!wallet) return;
      let connectedWalletData;
      setLoadingWalletData(true);
      const requestOptions = {
        method: "GET",
      };
      const baseURL = `${process.env.NEXT_PUBLIC_WALLETCHAT_API_URL}/get_intra_leaderboard_data/${wallet}`;

      connectedWalletData = await fetch(baseURL, requestOptions).then((data) =>
        data.json()
      );

      console.log("Fetch Wallet Data: ", connectedWalletData)

      if (connectedWalletData) {
        setConnectedWalletData(connectedWalletData);
        setLoadingWalletData(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReferralCodes = async () => {
    const wallet = wagmiAddress || cookieWalletAddress;
    if (!wallet) return;
    let referralCodes;
    console.log("fetching referralcodes");
    const requestOptions = {
      method: "GET",
    };
    const baseURL = `${process.env.NEXT_PUBLIC_WALLETCHAT_API_URL}/get_referral_code/${wallet}`;

    referralCodes = await fetch(baseURL, requestOptions).then((data) =>
      data.json()
    );

    if (referralCodes) {
      console.log(referralCodes);
      setReferralCodes(referralCodes);
    }
  };

  return (
    <AppContext.Provider
      value={{
        fetchLeaderboard,
        fetchConnectedWalletData,
        fetchReferralCodes,
        referralCodes,
        leaderboard,
        connectedWalletData,
        loadingWalletData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
