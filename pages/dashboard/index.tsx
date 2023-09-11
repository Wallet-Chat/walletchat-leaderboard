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
} from "@roketid/windmill-react-ui";
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

  const { leaderboard, connectedWalletData, referralCodes } = useAppContext();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<string[]>([]);
  const [referralCodesData, setReferralCodesData] = useState<string[]>([]);
  const { address: wagmiAddress } = useAccount();

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
      referralCodes.slice((page - 1) * codePerPage, page * codePerPage)
    );
  }, [page, leaderboard]);

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

  if (!wagmiAddress) return <LoginPage />;

  return (
    <Layout>
      <PageTitle>Welcome, {connectedWalletData?.Username}</PageTitle>

      {/* <!-- Cards --> */}
      <div className="lg:flex lg:justify-between">
        <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-2">
          <InfoCard
            title="Message Sent"
            value={connectedWalletData?.MessagesTx}
          >
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
        <div className="w-full mt-5 lg:mt-0">
          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Referral Codes</TableCell>
                  <TableCell>Status</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {referralCodesData?.map((user: any, i: any) => (
                  <TableRow className="h-12" key={i}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <div className="flex">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            {user?.code}
                          </p>
                          <div onClick={() => copyCode(user?.code)}>
                            <CopyIcon className="h-5 w-5 ml-3 cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                            {user?.redeemed === true
                              ? "Redeemed"
                              : "Not Redeemed"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalCodes}
                resultsPerPage={codePerPage}
                label="Table navigation"
                onChange={onPageChange}
              />
            </TableFooter>
          </TableContainer>
        </div>
      </div>

      <CTA />

      <PageTitle>Leaderboard</PageTitle>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>User</TableCell>
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
                        className="mr-3 md:block"
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
