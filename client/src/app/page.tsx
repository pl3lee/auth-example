"use client";

import { useState } from "react";

export default function Home() {
  const [secretData, setSecretData] = useState("");
  const fetchSecret = () => {
    fetch("http://localhost:3001/secretdata", {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Not authenticated");
      })
      .then((data) => {
        setSecretData(data.secretData)
      }).catch((error) => {
        console.error(error);
      })
  }

  return (
    <div>
      <p>
        The logout button above should show up only when the user is logged in.
      </p>
      <p>
        Protected route above should only be accessible if the user is logged in.
      </p>
      <p>Below is a button that will fetch some data that is only accessible if the user is logged in.</p>
      <button onClick={fetchSecret}>Fetch secret</button>
      <p>{secretData}</p>
    </div>
  );
}
