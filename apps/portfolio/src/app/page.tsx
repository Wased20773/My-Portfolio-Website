import { directoryQuery } from "@/sanity/queries";
import { client } from "../sanity/client";

import Header from "./components/ui/Header";
import OutputScreen from "./components/ui/OutputScreen";
import Terminal from "./components/ui/Terminal";

export default async function Home() {
  const tree = await client.fetch(
    directoryQuery,
    {},
    { next: { revalidate: 3600 } },
  );

  console.log(tree);

  return (
    <div>
      <Header />

      <main>
        <Terminal />
        <OutputScreen directories={tree} />
      </main>

      <footer>this is the footer</footer>
    </div>
  );
}
