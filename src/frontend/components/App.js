import logo from "./logo.png";
import "./App.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import MarketplaceAbi from "../contractsData/Marketplace.json";
import MarketplaceAddress from "../contractsData/Marketplace-address.json";
import NFTAbi from "../contractsData/NFT.json";
import NFTAddress from "../contractsData/NFT-address.json";
import { Outlet } from "react-router-dom";
import Navigation from "./Navbar";
import { Spinner } from "react-bootstrap";

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [marketplace, setMarketplace] = useState({});
  const [nft, setNFT] = useState({});

  const web3Handler = async () => {
    // MetaMask를 통해 계정 요청
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);

    console.log(account);

    if (!account) return;

    // MetaMask에서 provider 가져오기
    const provider = new ethers.providers.Web3Provider(window.ethers);

    // Signer 설정
    const signer = provider.getSigner();

    loadContracts(signer);
  };

  const loadContracts = async (signer) => {
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    );
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);

    setLoading(false);
  };

  useEffect(() => {
    console.log(account);
  }, [account]);

  return (
    <div>
      <Navigation web3Handler={web3Handler} account={account} />
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <Spinner animation="border" style={{ display: "flex" }} />
          <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
        </div>
      ) : (
        <Outlet
          context={{
            marketplace,
            nft,
          }}
        />
      )}
    </div>
  );
}

export default App;
