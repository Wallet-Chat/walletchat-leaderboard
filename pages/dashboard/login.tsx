import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button, WindmillContext } from "@roketid/windmill-react-ui";

function LoginPage() {
  const { mode } = useContext(WindmillContext);
  const imgSource =
    mode === "dark"
      ? "/assets/img/login-office-dark.jpeg"
      : "/assets/img/login-office.jpeg";

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="relative h-32 md:h-auto md:w-1/2">
            <Image
              aria-hidden="true"
              className="hidden object-cover w-full h-full"
              src={imgSource}
              alt="Office"
              layout="fill"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login to WalletChat Leaderboard
              </h1>

              <Link href="/dashboard" passHref={true}>
                <Button className="mt-4" block>
                  Connect Wallet
                </Button>
              </Link>

              <hr className="my-8" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
