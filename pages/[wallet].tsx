import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const wallet = params?.wallet as string | undefined;
  if (wallet) {
    res.setHeader('Set-Cookie', `walletAddress=${wallet}; Path=/; Max-Age=${60 * 60 * 24 * 365}`);
  }
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default function SetWalletPage() {
  return null;
}