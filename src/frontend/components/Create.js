import React, { useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";

const Create = () => {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const projectId = process.env.REACT_APP_PROJECT_ID;
  const projectAPIKey = process.env.REACT_APP_API_KEY;

  const authorization = "Basic " + btoa(projectId + ":" + projectAPIKey);
  const ipfs = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });

  console.log(ipfs);

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.file[0];
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row"></div>
    </div>
  );
};

export default Create;
