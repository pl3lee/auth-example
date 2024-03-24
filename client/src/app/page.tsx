import Image from "next/image";

export default function Home() {
  return (
    <div>
      <p>
        The logout button above should show up only when the user is logged in.
      </p>
      <p>
        Protected route above should only be accessible if the user is logged in.
      </p>
      <p>Below is a button that will fetch some data that is only accessible if the user is logged in.</p>
      <button>Fetch secret</button>
    </div>
  );
}
