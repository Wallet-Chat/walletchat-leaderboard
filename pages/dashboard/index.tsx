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

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<string[]>([]);
  const { leaderboard, connectedWalletData } = useAppContext();

  // Pagination setup
  const resultsPerPage = 10;

  // Function to sort data based on Avg Sleep
  const sortData = (data: any[]) => {
    return data.sort((a, b) => {
      const avgSleepA = a?.AvgSleep || 0;
      const avgSleepB = b?.AvgSleep || 0;
      return sortDirection === 'asc' ? avgSleepA - avgSleepB : avgSleepB - avgSleepA;
    });
  };

  // Update the useEffect to sort data when it changes
  useEffect(() => {
    const sortedData = sortData([...leaderboard.slice((page - 1) * resultsPerPage, page * resultsPerPage)]);
    setData(sortedData);
  }, [page, leaderboard, sortDirection]); // Ensure sortData is not included here

  // Function to handle sorting when the header is clicked
  const handleSort = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Ensure that the loading state is handled properly
  if (!connectedWalletData) return <LoginPage />; // Ensure this is the only early return

  return (
    <Layout>
      <PageTitle>Welcome, {connectedWalletData?.Username}</PageTitle>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Users</TableCell>
              <TableCell>Points</TableCell>
              <TableCell onClick={handleSort} style={{ cursor: 'pointer' }}>
                Avg Sleep
              </TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
              </TableRow>
            ) : (
              data.map((user: any, i: any) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      {user?.Pfpdata ? (
                        <Avatar className="mr-3 md:block" src={user?.Pfpdata} alt="User image" />
                      ) : (
                        <OutlinePersonIcon className="w-8 h-8 mr-3" />
                      )}
                      <div>
                        <p className="font-semibold">{user?.Wallet}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{user?.Walletaddr}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm">{user?.TotalPoints}</span></TableCell>
                  <TableCell><span className="text-sm">{user?.AvgSleep}</span></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={leaderboard.length}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={setPage}
          />
        </TableFooter>
      </TableContainer>
    </Layout>
  );
}

export default Dashboard;
