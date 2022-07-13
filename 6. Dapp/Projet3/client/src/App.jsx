import { EthProvider } from "./contexts/EthContext";
import NavBar from "./components/NavBar";
import Whitelist from "./components/Whitelist";
import "./App.css";
import Proposals from "./components/Proposals";

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <NavBar />
          <hr />
          <Whitelist />
          <hr />
          <Proposals />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
