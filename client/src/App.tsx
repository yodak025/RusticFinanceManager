import GeneralMenu from "./components/menus/GeneralMenu";
import InvestmentsMenu from "./components/menus/InvestmentsMenu";
import MovementsMenu from "./components/menus/MovementsMenu";
import { useState } from "react";
import { ThemeProvider } from "./hooks/ThemeContext";
import { Nav } from "./components/nav/Nav";

function App() {
  const [menu, setMenu] = useState("general");
  return (
    <ThemeProvider>
      <main className="">
        <Nav setMenu={setMenu}/>
        <section id="menu-container">
          {menu === "general" && <GeneralMenu />}
          {menu === "movements" && <MovementsMenu />}
          {menu === "investments" && <InvestmentsMenu />}
        </section>
      </main>
    </ThemeProvider>
  );
}

export default App;
