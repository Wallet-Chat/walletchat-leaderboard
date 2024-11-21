import { useContext, useState } from "react";
import SidebarContext from "context/SidebarContext";
import { MoonIcon, SunIcon, OutlineLogoutIcon, OutlinePersonIcon } from "icons";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  WindmillContext,
} from "@roketid/windmill-react-ui";
import { useAccount, useDisconnect } from "wagmi";
import { useAppContext } from "context/AppContext";

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { connectedWalletData } = useAppContext();
  const { toggleSidebar } = useContext(SidebarContext);
  const { address: wagmiAddress } = useAccount();
  const { disconnect } = useDisconnect();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  }

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* <!-- Mobile hamburger --> */}
        {/* <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button> */}
        {/* <!-- Search input --> */}
        <div className="flex flex-1 items-center lg:mr-32">
          <div className="flex items-center">
            <img
              src="https://walletchat-pfp-storage.sgp1.digitaloceanspaces.com/intra.png"
              alt=""
              style={{ maxWidth: '100px', height: 'auto', alignSelf: 'center' }}
            />
            <h1 className="md:text-m text-m text-white font-bold mx-4 flex items-center" style={{ fontFamily: 'Epilog, sans-serif' }}>
              by
            </h1>
            <img
              src="https://walletchat-pfp-storage.sgp1.digitaloceanspaces.com/biohackerDAO_dark.png"
              alt=""
              style={{ maxWidth: '200px', height: 'auto', alignSelf: 'center' }}
            />
          </div>
          <span
            className={`text-lg ${
              mode === "dark" ? "text-white" : "text-black"
            } font-semibold pl-3`}
          >
          </span>
        </div>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}
          <li className="hidden lg:flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === "dark" ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>
          {/* <!-- Notifications menu --> */}
          <div className="relative">
            <div className="px-4 py-2 rounded-lg bg-black text-white">
              {`${wagmiAddress?.slice(0, 7)}...${wagmiAddress?.slice(35)}`}
            </div>
          </div>
          {/* <!-- Profile menu --> */}
          <li className="relative hidden lg:flex">
            <button
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={handleProfileClick}
              aria-label="Account"
              aria-haspopup="true"
            >
              {connectedWalletData?.Pfpdata ? (
                <Avatar
                  className="align-middle"
                  src={connectedWalletData?.Pfpdata}
                  alt="User image"
                />
              ) : (
                <OutlinePersonIcon className="w-8 h-8 mr-3" />
              )}
            </button>
            <Dropdown
              align="right"
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
            >
              <DropdownItem onClick={() => disconnect()}>
                <OutlineLogoutIcon
                  className="w-4 h-4 mr-3"
                  aria-hidden="true"
                />
                <span>Log out</span>
              </DropdownItem>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
