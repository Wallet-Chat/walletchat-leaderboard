import React, {
  useState,
  ReactElement,
  createContext,
  useContext,
  useEffect,
} from "react";

interface AppContextType {
  leaderboard: string[];
  fetchLeaderboard: () => void;
}

interface Props {
  children: ReactElement;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppContextProvider = ({ children }: Props) => {
  const [leaderboard, setLeaderboard] = useState<string[]>([]);

  useEffect(() => {
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

  return (
    <AppContext.Provider
      value={{
        fetchLeaderboard,
        leaderboard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
