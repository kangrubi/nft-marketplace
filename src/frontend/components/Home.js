import React from "react";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const { marketplace, nft } = useOutletContext();

  console.log(marketplace);

  return <div></div>;
};

export default Home;
