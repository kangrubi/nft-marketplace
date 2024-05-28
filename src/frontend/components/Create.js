import React, { useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";

const projectId = process.env.REACT_APP_PROJECT_ID;
const projectAPIKey = process.env.REACT_APP_API_KEY;
const client = "https://ipfs.infura.io:5001/api/v0";

const Create = () => {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { marketplace, nft } = useOutletContext;

  const authorization = "Basic " + btoa(projectId + ":" + projectAPIKey);
  const ipfs = ipfsHttpClient({
    url: client,
    headers: {
      authorization,
    },
  });

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.file[0];
    if (typeof file !== "undefined") {
      try {
        const result = await ipfs.add(file);
        console.log(result);
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs image upload error", error);
      }
    }
  };

  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
    // mint nft
    await (await nft.mint(uri)).wait();
    // get tokenId of new nft
    const id = await nft.tokenCount();
    //마켓플레이스가 NFT를 사용하도록 승인
    await (await nft.setApprovalForALl(marketplace.address, true)).wait();
    // 마켓플레이스에 NFT 추가
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
  };

  const createNFT = async () => {
    if (!image || !price || !name || !description) return;

    try {
      const result = await ipfs.add(
        JSON.stringify({ image, name, description })
      );
      mintThenList(result);
    } catch (error) {
      console.log("ipfs uri upload error", error);
    }
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
