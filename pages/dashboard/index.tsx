import React, { useState, useEffect } from "react";
import {
  ChatIcon,
  CartIcon,
  MoneyIcon,
  PeopleIcon,
  OutlinePersonIcon,
  CopyIcon,
} from "icons";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Button,
} from "@roketid/windmill-react-ui";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-hot-toast";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import InfoCard from "dashboard/components/Cards/InfoCard";
import PageTitle from "dashboard/components/Typography/PageTitle";
import CTA from "dashboard/components/CTA";
import Layout from "dashboard/containers/Layout";
import RoundIcon from "dashboard/components/RoundIcon";
import { useAccount } from "wagmi";
import LoginPage from "./login";
import { useAppContext } from "context/AppContext";

function Dashboard() {
  Chart.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const { leaderboard, connectedWalletData, referralCodes, loadingWalletData } =
    useAppContext();
  const [page, setPage] = useState(1);
  const [code, setCode] = useState(1);
  const [data, setData] = useState<string[]>([]);
  const [referralCodesData, setReferralCodesData] = useState<string[]>([]);
  const { address: wagmiAddress } = useAccount();
  const messageSent =
    connectedWalletData?.MessagesTx + connectedWalletData?.GroupMessages;

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = leaderboard.length;

  // referral code pagination setup
  const codePerPage = 5;
  const totalCodes = referralCodes.length;

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(
      leaderboard.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
    setReferralCodesData(
      referralCodes.slice((code - 1) * codePerPage, code * codePerPage)
    );
  }, [page, code, leaderboard, referralCodes]);

  const copyCode = (code: string) => {
    const input = document.createElement("input");
    input.value = code;

    document.body.appendChild(input);

    input.select();
    input.setSelectionRange(0, 99999);

    document.execCommand("copy");

    document.body.removeChild(input);

    toast.success(`${code} copied to clipboard`);
  };

  // pagination change control
  function onPageChange(p: number) {
    setPage(p);
  }

  function onCodeChange(p: number) {
    setCode(p);
  }

  const getRankFromConnectedWallet = () => {
    // Convert the targetWalletAddr to lowercase for case-insensitive comparison
    const lowerCaseTarget = wagmiAddress?.toLowerCase();

    for (let i = 0; i < leaderboard.length; i++) {
      const walletAddr = leaderboard[i]?.Walletaddr.toLowerCase();

      if (walletAddr === lowerCaseTarget) {
        // Found a match, return the object
        console.log("Rank: ", i);
        setPage(i / resultsPerPage + 1);
      }
    }
  };

  const [isLoading, setIsLoading] = useState(true); // Initial state

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Ensure that the loading state is handled properly
  if (isLoading) {
    return <div>Loading...</div>; // Render loading state
  }

  if (!wagmiAddress) return <LoginPage />;

  return (
    <Layout>
      <PageTitle>Welcome, {connectedWalletData?.Username}</PageTitle>

      {/* <!-- Cards --> */}
      <CTA />

      <div className="flex flex-row items-center">
        <PageTitle>Leaderboard</PageTitle>
        <Button
          size="small"
          className="h-10 ml-5"
          onClick={getRankFromConnectedWallet}
        >
          Go to my score
        </Button>
      </div>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Users</TableCell>
              <TableCell>Points</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ) : (
              data.map((user: any, i: any) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      {user?.Pfpdata ? (
                        <Avatar
                          className="mr-3 md:block"
                          src={user?.Pfpdata}
                          alt="User image"
                        />
                      ) : (
                        <OutlinePersonIcon className="w-8 h-8 mr-3" />
                      )}
                      <div>
                        <p className="font-semibold">{user?.Wallet}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {user?.Walletaddr}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user?.TotalPoints}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </Layout>
  );
}

export default Dashboard;
