import Header from "./components/ui/Header";
import OutputScreen from "./components/ui/OutputScreen";
import Terminal from "./components/ui/Terminal";
export default function Home() {
  return (
    <div>
      <Header />

      <main>
        <Terminal />
        <OutputScreen />
      </main>

      <footer>this is the footer</footer>
    </div>
  );
}
