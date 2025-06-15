import GeneralMenu from "./components/general/GeneralMenu";
import InvestmentsMenu from "./components/investments/InvestmentsMenu";
import MovementsMenu from "./components/movements/MovementsMenu";
import Login from "./components/login/LoginMenu";
import { useState } from "react";
import { ThemeProvider } from "./hooks/ThemeContext";
import { Nav } from "./components/nav/Nav";

function App() {
  const [menu, setMenu] = useState("general");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const logOut = () => setIsLoggedIn(false);
  return (
    <ThemeProvider>
      <main className="">
        {!isLoggedIn && <Login isLoggedIn={setIsLoggedIn} />}
        <Nav setMenu={setMenu} />
        {menu === "general" && <GeneralMenu expireSession={logOut}/>}
        {menu === "investments" && <InvestmentsMenu />}
        {menu === "movements" && <MovementsMenu expireSession={logOut} />}
      </main>
    </ThemeProvider>
  );
}

export default App;
