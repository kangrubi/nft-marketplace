import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

const MyPurchases = () => {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  const { marketplace, nft, account } = useOutletContext();

  const loadPurchasedItems = async () => {
    const filter = marketplace.filters.Bought(
      null,
      null,
      null,
      null,
      null,
      account
    );
    const results = await marketplace.queryFilter(filter);

    const purchasesData = await Promise.all(
      results.map(async (i) => {
        const item = i.args;

        const tokenId = item.tokenId;
        const uri = await nft.tokenURI(tokenId);

        const response = await axios.get(uri);

        if (response.data) {
          const metadata = response.data;

          const totalPrice = await marketplace.getTotalPrice(item.itemId);

          const purchasedItem = {
            totalPrice: totalPrice.toString(),
            price: item.price.toString(),
            itemId: item.itemId.toString(),
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
          };

          return purchasedItem;
        }
      })
    );

    setLoading(false);
    setPurchases(purchasesData);
  };

  useEffect(() => {
    loadPurchasedItems();
  }, []);

  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );

  return (
    <div className="flex justify-center">
      {purchases.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>
                    {ethers.utils.formatEther(item.totalPrice)} ETH
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No purchases</h2>
        </main>
      )}
    </div>
  );
};

export default MyPurchases;
