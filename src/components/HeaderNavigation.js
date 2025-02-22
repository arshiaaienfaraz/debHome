import { ethers } from "ethers";
import brand_logo from "../assets/brand-logo.svg";

const HeaderNavigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <nav className="navigation">
      <div className="nav__brand">
        <img src={brand_logo} alt="Brand Logo" className="nav__logo" />
        <h1>DebHome</h1>
      </div>

      <ul className="nav__links">
        <li>
          <a href="#">Buy</a>
        </li>
        <li>
          <a href="#">Rent</a>
        </li>
        <li>
          <a href="#">Sell</a>
        </li>
      </ul>

      {account ? (
        <button type="button" className="nav__connect">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button type="button" className="nav__connect" onClick={connectHandler}>
          Connect Wallet
        </button>
      )}
    </nav>
  );
};

export default HeaderNavigation;
