import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import axios from "axios";

const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;
const PINATA_URL = process.env.REACT_APP_PINATA_URL;

const Create = () => {
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { marketplace, nft } = useOutletContext();

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${PINATA_JWT}`,
          },
        }
      );
      const imageURL = `${PINATA_URL}/ipfs/${res.data.IpfsHash}`;
      setImage(imageURL);
    } catch (error) {
      console.log(error);
    }
  };

  const createNFT = async () => {
    if (!image || !price || !name || !description) return;

    const data = JSON.stringify({
      pinataContent: {
        name,
        description,
        price,
        image: image,
      },
      pinataMetadata: {
        name: `${name}.json`,
      },
    });

    try {
      const res = await axios.post(
        `https://api.pinata.cloud/pinning/pinJSONToIPFS`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PINATA_JWT}`,
          },
        }
      );

      const tokenURI = `${PINATA_URL}/ipfs/${res.data.IpfsHash}`;
      await mintThenList(tokenURI);
    } catch (error) {
      console.log(error);
    }
  };

  const mintThenList = async (metadata) => {
    const uri = metadata;
    // mint nft
    await (await nft.mint(uri)).wait();
    // get tokenId of new nft
    const id = await nft.tokenCount();
    // 마켓플레이스가 NFT를 사용하도록 승인
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    // 마켓플레이스에 NFT 추가
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
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
