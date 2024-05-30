import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { marketplace, nft } = useOutletContext();

  const loadMarketplaceItems = async () => {
    const itemCount = await marketplace.itemCount();

    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);

      if (!item.sold) {
        const tokenId = item.tokenId;
        const uri = await nft.tokenURI(tokenId);
        const response = await axios.get(uri);

        console.log(response.data);

        if (response.data) {
          const metadata = response.data;

          const totalPrice = await marketplace.getTotalPrice(item.itemId);

          setItems([
            {
              totalPrice: totalPrice.toString(),
              itemId: item.itemId.toString(),
              seller: item.seller.toString(),
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
            },
          ]);
        }
      }
    }
    setLoading(false);
  };

  const buyMarketItem = async (item) => {
    await (
      await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
    ).wait();

    loadMarketplaceItems();
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  return (
    <div>
      {items.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, i) => (
              <Col key={i}>
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className="d-grid">
                      <Button
                        onClick={() => buyMarketItem(item)}
                        variant="primary"
                        size="lg"
                      >
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
};

export default Home;
