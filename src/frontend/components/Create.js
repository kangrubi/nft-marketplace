import React, { useState } from "react";
import { createHelia } from "helia";

// const client = createHelia();

const Create = () => {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
