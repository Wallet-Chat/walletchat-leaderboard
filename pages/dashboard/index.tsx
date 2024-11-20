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
  const [lastSortedColumn, setLastSortedColumn] = useState<'AvgSleep' | 'Points'>('AvgSleep');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const { leaderboard, connectedWalletData } = useAppContext();

  // Pagination setup
  const resultsPerPage = 10;

  // Function to sort data based on Avg Sleep
  const sortDataAvgSleep = (data: any[]) => {
    return data.sort((a, b) => {
      const avgSleepA = a?.AvgSleep ? parseFloat(a.AvgSleep) : 0;
      const avgSleepB = b?.AvgSleep ? parseFloat(b.AvgSleep) : 0;
      return sortDirection === 'asc' ? avgSleepA - avgSleepB : avgSleepB - avgSleepA;
    });
  };

  // Function to sort data based on Points
  const sortDataPoints = (data: any[]) => {
    return data.sort((a, b) => {
      const pointsA = a?.TotalPoints || 0;
      const pointsB = b?.TotalPoints || 0;
      return sortDirection === 'asc' ? pointsA - pointsB : pointsB - pointsA;
    });
  };

  // Update the useEffect to sort data when it changes
  useEffect(() => {
    let sortedData;
    if (lastSortedColumn === 'Points') {
      sortedData = sortDataPoints([...leaderboard.slice((page - 1) * resultsPerPage, page * resultsPerPage)]);
    } else {
      sortedData = sortDataAvgSleep([...leaderboard.slice((page - 1) * resultsPerPage, page * resultsPerPage)]);
    }
    setData(sortedData);
  }, [page, leaderboard, sortDirection, lastSortedColumn]);

  // Function to handle sorting when the Points header is clicked
  const handleSortPoints = () => {
    setLastSortedColumn('Points');
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Function to handle sorting when the Avg Sleep header is clicked
  const handleSortSleep = () => {
    setLastSortedColumn('AvgSleep');
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Ensure that the loading state is handled properly
  if (!connectedWalletData) return <LoginPage />;

  return (
    <Layout>
      <PageTitle>Welcome, {connectedWalletData?.Username}</PageTitle>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Users</TableCell>
              <TableCell onClick={handleSortPoints} style={{ cursor: 'pointer' }}>
                <div style={{ textAlign: 'center' }}>
                  Points
                </div>
              </TableCell>
              <TableCell onClick={handleSortSleep} style={{ cursor: 'pointer' }}>
                 <div style={{ textAlign: 'center' }}>
                    7 Day <br />
                    Avg Sleep
                 </div>
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
                  <TableCell style={{ textAlign: 'center' }}><span className="text-sm">{user?.TotalPoints}</span></TableCell>
                  <TableCell style={{ textAlign: 'center' }}><span className="text-sm">{parseFloat(user?.AvgSleep).toFixed(2)}</span></TableCell>
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
