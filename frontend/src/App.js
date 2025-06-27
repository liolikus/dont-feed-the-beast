/* global BigInt */
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";

function App() {
  const [account, setAccount] = useState("");
  const [minting, setMinting] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [level, setLevel] = useState(null);
  const [levelingUp, setLevelingUp] = useState(false);
  const [status, setStatus] = useState("");
  const [levelUpCost, setLevelUpCost] = useState(null);

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Find the tokenId owned by the connected account
  const findUserTokenId = async (account) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const nextId = await contract.nextTokenId();
      for (let i = 0; i < Number(nextId); i++) {
        try {
          const owner = await contract.ownerOf(i);
          console.log(`Debug: tokenId ${i}, owner: ${owner}`);
          if (owner.toLowerCase() === account.toLowerCase()) {
            return i.toString();
          }
        } catch (err) {
          // token does not exist or is burned, skip
        }
      }
      console.log('Debug: No NFT found for account', account);
      return null;
    } catch (err) {
      console.log('Debug: findUserTokenId error:', err);
      return null;
    }
  };

  // Fetch NFT level
  const fetchLevel = async (id) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const lvl = await contract.tokenLevel(id);
      setLevel(lvl.toString());
      // Calculate and set level up cost
      const nextLevel = Number(lvl) + 1;
      const base = ethers.parseEther("0.1");
      const nextLevelBN = typeof BigInt !== 'undefined' ? BigInt(nextLevel) : Number(nextLevel);
      const requiredFee = base + (base * nextLevelBN);
      setLevelUpCost(ethers.formatEther(requiredFee));
    } catch (err) {
      setLevel(null);
      setLevelUpCost(null);
      setStatus("Fetch failed: " + (err.reason || err.message));
    }
  };

  // Mint NFT
  const mintNFT = async () => {
    setMinting(true);
    setStatus("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const mintFee = await contract.MINT_FEE();
      const tx = await contract.mint({ value: mintFee });
      await tx.wait();
      setStatus("Minted! Fetching your NFT...");
      // After minting, find the user's tokenId
      const userTokenId = await findUserTokenId(account);
      if (userTokenId !== null) {
        setTokenId(userTokenId);
        fetchLevel(userTokenId);
      }
    } catch (err) {
      setStatus("Mint failed: " + (err.reason || err.message));
    }
    setMinting(false);
  };

  // Level up NFT
  const levelUp = async () => {
    setLevelingUp(true);
    setStatus("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const currentLevel = await contract.tokenLevel(tokenId);
      const nextLevel = Number(currentLevel) + 1;
      const base = ethers.parseEther("0.1");
      const nextLevelBN = typeof BigInt !== 'undefined' ? BigInt(nextLevel) : Number(nextLevel);
      const requiredFee = base + (base * nextLevelBN);
      const tx = await contract.levelUp(tokenId, { value: requiredFee });
      await tx.wait();
      setStatus("Level up successful!");
      fetchLevel(tokenId);
    } catch (err) {
      setStatus("Level up failed: " + (err.reason || err.message));
    }
    setLevelingUp(false);
  };

  // Automatically detect user's NFT on account change
  useEffect(() => {
    if (account) {
      findUserTokenId(account).then(foundTokenId => {
        if (foundTokenId !== null) {
          setTokenId(foundTokenId);
          fetchLevel(foundTokenId);
        } else {
          setTokenId("");
          setLevel(null);
          setLevelUpCost(null);
        }
      });
    } else {
      setTokenId("");
      setLevel(null);
      setLevelUpCost(null);
    }
    // eslint-disable-next-line
  }, [account]);

  return (
    <div className="App">
      <h1>DON`T FEED THE BEAST</h1>
      {!account ? (
        <button onClick={connectWallet} className="connect-btn">Connect Wallet</button>
      ) : (
        <div>
          
          
          {(!tokenId || !level) ? (
            <>
              
              <button className="cute-btn" onClick={mintNFT} disabled={minting}>{minting ? "Feeding..." : "FEED THE BEAST (0.1 MON)"}</button>
            </>
          ) : (
            <div className="nft-card">
              <p style={{ fontWeight: 'bold', fontSize: '1.3em', margin: '10px 0 0 0' }}>Beast №{tokenId} Level: {level}</p>
              {level && (
                <img
                  src={`https://github.com/liolikus/dont-feed-the-beast/raw/main/salmonade_level_${level}.png`}
                  alt={`Beast Level ${level}`}
                  className="beast-img"
                />
              )}
              <button onClick={levelUp} disabled={levelingUp || !tokenId} className="cute-btn">
                {levelingUp ? "Leveling Up..." : `FEED THE BEAST (cost: ${levelUpCost} MON)`}
              </button>

            </div>
          )}
        </div>
      )}
      <p style={{ color: "red" }}>{status}</p>
      {(!tokenId || !level) && (
        <img
          src="https://github.com/liolikus/dont-feed-the-beast/raw/main/Untitled-1.png"
          alt="No NFT"
          className="no-beast-img"
        />
      )}
    </div>
  );
}

export default App;
