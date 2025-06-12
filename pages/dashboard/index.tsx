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
import { useAppContext } from "context/AppContext";

/**
 * Helper component that enforces a four-column, fixed-layout table so
 * every table that uses it shares identical column widths.
 */
const FourColumnTable: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Table className="w-full table-fixed">
    <colgroup>
      <col style={{ width: '40%' }} />
      <col style={{ width: '26.66%' }} />
      <col style={{ width: '26.66%' }} />
      <col style={{ width: '26.66%' }} />
    </colgroup>
    {children}
  </Table>
);

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
  const [lastSortedColumn, setLastSortedColumn] = useState<'Tokens' | 'Num Uploads'>('Tokens');
  const [code, setCode] = useState(1);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const { leaderboard, connectedWalletData, referralCodes } = useAppContext();

  const [name, setName] = useState(connectedWalletData?.Wallet || '');
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const [referralCodesData, setReferralCodesData] = useState<string[]>([]);
  const resultsPerPage = 10;
  const codePerPage = 5;

  const copyCode = (c: string) => {
    const input = document.createElement('input');
    input.value = c;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    toast.success(`${c} copied to clipboard`);
  };

  const onPageChange = (p: number) => setPage(p);
  const onCodeChange = (p: number) => setCode(p);

  const sortDataTokens = (arr: any[]) =>
    arr.sort((a, b) => {
      const aVal = parseFloat(a.Tokens) || 0;
      const bVal = parseFloat(b.Tokens) || 0;
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const sortDataNumUploads = (arr: any[]) =>
    arr.sort((a, b) => {
      const aVal = a.Numuploads || 0;
      const bVal = b.Numuploads || 0;
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

  useEffect(() => {
    let sorted;
    const sliceData = leaderboard.slice((page - 1) * resultsPerPage, page * resultsPerPage);
    if (lastSortedColumn === 'Num Uploads') {
      sorted = sortDataNumUploads([...sliceData]);
    } else {
      sorted = sortDataTokens([...sliceData]);
    }
    setData(sorted);
    setReferralCodesData(
      referralCodes.slice((code - 1) * codePerPage, code * codePerPage)
    );
  }, [page, code, referralCodes, leaderboard, sortDirection, lastSortedColumn]);

  const handleSortNumUploads = () => {
    setLastSortedColumn('Num Uploads');
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSortTokens = () => {
    setLastSortedColumn('Tokens');
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTempName(e.target.value);

  const handleSaveName = async () => {
    setName(tempName);
    setEditing(false);
    await fetch(
      `${process.env.NEXT_PUBLIC_WALLETCHAT_API_URL}/name`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tempName, address: connectedWalletData?.Wallet }),
      }
    );
  };

  useEffect(() => {
    const fetchName = async () => {
      if (connectedWalletData?.Wallet) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WALLETCHAT_API_URL}/name/${connectedWalletData.Wallet}`
        );
        const d = await res.json();
        const fetched = d[0]?.name;
        const fallback = `${connectedWalletData.Wallet.slice(0, 6)}...${connectedWalletData.Wallet.slice(-4)}`;
        setName(fetched || fallback);
        setTempName(fetched || fallback);
      }
    };
    if (connectedWalletData) fetchName();
  }, [connectedWalletData]);

  return (
    <Layout>
      <PageTitle>
        <div className="flex items-center">
          <span className="mr-2">Welcome {name}</span>
        </div>
        {editing && (
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={tempName}
              onChange={handleNameChange}
              className="border rounded p-1 mr-2 bg-white text-black"
            />
            <button onClick={handleSaveName} className="bg-blue-500 text-white rounded p-1">
              Save
            </button>
          </div>
        )}
      </PageTitle>

      <div className="mb-4">
        <TableContainer>
          <FourColumnTable>
            <TableHeader>
              <tr>
                <TableCell className="align-middle">Connected Wallet</TableCell>
                <TableCell className="align-middle text-center">Name</TableCell>
                <TableCell className="align-middle text-center">Num Uploads</TableCell>
                <TableCell className="align-middle text-center">Intra Tokens</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {!connectedWalletData ? (
                <TableRow>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ) : (
                <TableRow className="bg-yellow-100">
                  <TableCell>
                    <div className="flex items-center text-sm">
                      {connectedWalletData.Pfpdata ? (
                        <Avatar className="mr-3 md:block" src={connectedWalletData.Pfpdata} alt="User image" />
                      ) : (
                        <OutlinePersonIcon className="w-8 h-8 mr-3" />
                      )}
                      <div>
                        <p className="font-semibold">
                          <span className="hidden md:inline">{connectedWalletData.Wallet}</span>
                          <span className="inline md:hidden">
                            {`${connectedWalletData.Wallet.slice(0,5)}...${connectedWalletData.Wallet.slice(-3)}`}
                          </span>
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center"><span className="text-sm">{connectedWalletData.Name}</span></TableCell>
                  <TableCell className="text-center"><span className="text-sm">{connectedWalletData.Numuploads}</span></TableCell>
                  <TableCell className="text-center"><span className="text-sm">{connectedWalletData.Tokens ? parseFloat(connectedWalletData.Tokens).toFixed(2) : 'N/A'}</span></TableCell>
                </TableRow>
              )}
            </TableBody>
          </FourColumnTable>
        </TableContainer>
      </div>

      <div style={{ marginBottom: "20px" }} />
      <div className="mb-4" />
      <TableContainer>
        <FourColumnTable>
          <TableHeader>
            <tr>
              <TableCell className="align-middle">User Wallet</TableCell>
              <TableCell className="align-middle text-center">Name</TableCell>
              <TableCell
                className="align-middle text-center cursor-pointer"
                onClick={handleSortNumUploads}
              >
                Num Uploads
              </TableCell>
              <TableCell
                className="align-middle text-center cursor-pointer"
                onClick={handleSortTokens}
              >
                Intra Tokens
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
              data.map((user: any, i: number) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      {user?.Pfpdata ? (
                        <Avatar className="mr-3 md:block" src={user.Pfpdata} alt="User image" />
                      ) : (
                        <OutlinePersonIcon className="w-8 h-8 mr-3" />
                      )}
                      <div>
                        <p className="font-semibold">
                          <span className="hidden md:inline">{user.Wallet}</span>
                          <span className="inline md:hidden">{`${user.Wallet.slice(0,5)}...${user.Wallet.slice(-3)}`}</span>
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center"><span className="text-sm">{user.Name}</span></TableCell>
                  <TableCell className="text-center"><span className="text-sm">{user.Numuploads}</span></TableCell>
                  <TableCell className="text-center"><span className="text-sm">{parseFloat(user.Tokens).toFixed(2)}</span></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </FourColumnTable>
      </TableContainer>
      <TableFooter>
        <Pagination
          totalResults={leaderboard.length}
          resultsPerPage={resultsPerPage}
          label="Table navigation"
          onChange={setPage}
        />
      </TableFooter>
    </Layout>
  );
}

export default Dashboard;
