import React, { useCallback } from "react";
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

  const loadContracts = async (signer) => {
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    );

    setMarketplace(marketplace);

    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);

    setNFT(nft);
  };

  const web3Handler = useCallback(async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed");
      setLoading(false);
      return;
    }

    try {
      // MetaMask를 통해 계정 요청
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);

      // MetaMask에서 provider 가져오기
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Signer 설정
      const signer = provider.getSigner();

      await loadContracts(signer);

      setLoading(false);
    } catch (error) {
      alert("Error connecting to MetaMask", error);

      setLoading(false);
    }
  });

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      setAccount(accounts[0]);
      await web3Handler();
    };

    const handleChainChanged = (chainId) => {
      window.location.reload();
    };

    // 계정 변경 이벤트 리스너 등록
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    // 체인 변경 이벤트 리스너 등록
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [web3Handler]);

  return (
    <div className="App">
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
            account,
          }}
        />
      )}
    </div>
  );
}

export default App;
