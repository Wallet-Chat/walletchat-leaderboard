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

  const [name, setName] = useState(connectedWalletData?.Wallet || "");
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(name); // Temporary state for name editing

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

  // Function to handle name change
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(event.target.value); // Update temporary name
  };

  // Function to save the name
  const handleSaveName = async () => {
    setName(tempName); // Update the main name state
    setEditing(false); // Exit editing mode

    // Send updated name to the API
    await fetch(`https://api.v2.walletchat.fun/name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: tempName,
        address: connectedWalletData?.Wallet // Use the wallet address from connectedWalletData
      }),
    });
  };

  useEffect(() => {
    const fetchName = async () => {
      if (connectedWalletData?.Wallet) {
        const response = await fetch(`https://api.v2.walletchat.fun/name/${connectedWalletData.Wallet}`, {
          method: 'GET'
        });
        const data = await response.json();
        setName(data[0]?.name); // Get the name from the first element of the array if it exists
        setTempName(data[0]?.name); // Set the temporary name as well
      }
    };

    // Check if connectedWalletData is available before fetching
    if (connectedWalletData) {
      fetchName();
    }
  }, [connectedWalletData]); // Fetch name when connectedWalletData changes

  // Ensure that the loading state is handled properly
  if (!connectedWalletData) return <LoginPage />;

  return (
    <Layout>
      <PageTitle>
        <div className="flex items-center">
          <span className="mr-2">Welcome, {name}</span>
          <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-gray-600"> {/* More transparent gray */}
            ✏️ {/* Edit icon */}
          </button>
        </div>
        {editing && (
          <div className="flex items-center mt-2">
            <input 
              type="text" 
              value={tempName} // Use temporary name
              onChange={handleNameChange} 
              className="border rounded p-1 mr-2 bg-white text-black" // Improved visibility
            />
            <button onClick={handleSaveName} className="bg-blue-500 text-white rounded p-1">
              Save
            </button>
          </div>
        )}
      </PageTitle>
<TableContainer>
  <Table
    className="border border-green-400 rounded-md"
    style={{
      backgroundColor: "rgba(144, 238, 144, 0.2)", // light green with transparency
      marginBottom: "20px", // space separation between tables
    }}
  >
    <TableHeader>
      <tr>
        <TableCell>Connected Wallet</TableCell>
        <TableCell style={{ textAlign: "center" }}>Points</TableCell>
        <TableCell style={{ textAlign: "center" }}>7 Day Avg Sleep</TableCell>
      </tr>
        </TableHeader>
          <TableBody>
            {!connectedWalletData ? (
              <TableRow>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell>
                  <div className="flex items-center text-sm">
                    {connectedWalletData?.Pfpdata ? (
                      <Avatar
                        className="mr-3 md:block"
                        src={connectedWalletData.Pfpdata}
                        alt="User image"
                      />
                    ) : (
                      <OutlinePersonIcon className="w-8 h-8 mr-3" />
                    )}
                    <div>
                      <p className="font-semibold">{connectedWalletData?.Wallet}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {connectedWalletData?.Walletaddr}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <span className="text-sm">{connectedWalletData?.TotalPoints}</span>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <span className="text-sm">
                    {connectedWalletData?.AvgSleep
                      ? parseFloat(connectedWalletData.AvgSleep).toFixed(2)
                      : "N/A"}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      <div style={{ marginBottom: "20px" }} />
        <Table>
          <TableHeader>
            <tr>
              <TableCell>User Wallet</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Name</TableCell>
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
                  <TableCell style={{ textAlign: 'center' }}><span className="text-sm">{user?.Name}</span></TableCell>
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
