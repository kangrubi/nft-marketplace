import React, { useState } from "react";
import { createHelia } from "helia";

// const client = createHelia();

const Create = () => {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="container-fluid mt-5">
      <div className="row"></div>
    </div>
  );
};

export default Create;
