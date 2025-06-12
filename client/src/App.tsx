import GeneralMenu from "./components/general/GeneralMenu";
import InvestmentsMenu from "./components/investments/InvestmentsMenu";
import MovementsMenu from "./components/movements/MovementsMenu";
import Login from "./components/login/LoginMenu";
import { useState } from "react";
import { ThemeProvider } from "./hooks/ThemeContext";
import { Nav } from "./components/nav/Nav";

function App() {
  const [menu, setMenu] = useState("general");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <ThemeProvider>
      <main className="">
        {!isLoggedIn ? (<Login isLoggedIn={setIsLoggedIn} />) : (
          <>
            <Nav setMenu={setMenu} />
            {menu === "general" && <GeneralMenu />}
            {menu === "investments" && <InvestmentsMenu />}
            {menu === "movements" && <MovementsMenu />}
          </>
        )}
      </main>
    </ThemeProvider>
  );
}

export default App;
