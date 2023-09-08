import React, { useState, useEffect } from "react";
import {
  ChatIcon,
  CartIcon,
  MoneyIcon,
  PeopleIcon,
  OutlinePersonIcon,
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
} from "@roketid/windmill-react-ui";
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

  const { leaderboard, connectedWalletData } = useAppContext();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<string[]>([]);
  const { address: wagmiAddress } = useAccount();

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(
      leaderboard.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  }, [page, leaderboard]);

  console.log("checking:", data);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = leaderboard.length;

  // pagination change control
  function onPageChange(p: number) {
    setPage(p);
  }

  if (!wagmiAddress) return <LoginPage />;

  return (
    <Layout>
      <PageTitle>Welcome, {connectedWalletData?.Username}</PageTitle>

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard title="Message Sent" value={connectedWalletData?.MessagesTx}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-green-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard
          title="Message Received"
          value={connectedWalletData?.MessagesRx}
        >
          {/* @ts-ignore */}
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard
          title="Unique Conversations"
          value={connectedWalletData?.UniqueConvos}
        >
          {/* @ts-ignore */}
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard
          title="Installed Snap"
          value={connectedWalletData?.Installedsnap}
        >
          {/* @ts-ignore */}
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard
          title="Redeemed Count"
          value={connectedWalletData?.RedeemedCount}
        >
          {/* @ts-ignore */}
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-green-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Points" value={connectedWalletData?.Points}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <CTA />

      <PageTitle>Leaderboard</PageTitle>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>User</TableCell>
              <TableCell>Message Sent</TableCell>
              <TableCell>Message Received</TableCell>
              <TableCell>Unique Conversations</TableCell>
              <TableCell>Installed Snap</TableCell>
              <TableCell>Redeemed Count</TableCell>
              <TableCell>Points</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user: any, i: any) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    {user?.Pfpdata ? (
                      <Avatar
                        className="hidden mr-3 md:block"
                        src={user?.Pfpdata}
                        alt="User image"
                      />
                    ) : (
                      <OutlinePersonIcon className="w-8 h-8 mr-3" />
                    )}
                    <div>
                      <p className="font-semibold">{user?.Username}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user?.Walletaddr}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user?.MessagesTx}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user?.MessagesRx}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user?.UniqueConvos}</span>
                </TableCell>
                <TableCell>
                  <Badge type={user.Installedsnap}>{user.Installedsnap}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user?.RedeemedCount}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user?.Points}</span>
                </TableCell>
              </TableRow>
            ))}
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
