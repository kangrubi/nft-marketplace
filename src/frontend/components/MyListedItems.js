import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import axios from "axios";

function renderSoldItems(items) {
  return (
    <>
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Footer>
                For {ethers.utils.formatEther(item.totalPrice)} ETH - Received{" "}
                {ethers.utils.formatEther(item.price)} ETH
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

const MyListedItems = () => {
  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  const { marketplace, nft, account } = useOutletContext();

  const loadListedItems = async () => {
    const itemCount = await marketplace.itemCount();

    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx);

      if (i.seller.toLowerCase() === account) {
        const tokenId = i.tokenId;
        const uri = await nft.tokenURI(tokenId);

        const response = await axios.get(uri);

        if (response.data) {
          const metadata = response.data;

          const totalPrice = await marketplace.getTotalPrice(i.itemId);

          const item = [
            {
              totalPrice: totalPrice.toString(),
              itemId: i.itemId.toString(),
              price: i.price.toString(),
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
            },
          ];

          setListedItems(item);

          if (i.sold) setSoldItems(item);

          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    loadListedItems();
  }, []);

  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );

  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ? (
        <div className="px-5 py-3 container">
          <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
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
          {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
};

export default MyListedItems;
