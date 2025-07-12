import GeneralMenu from "./components/general/GeneralMenu";
import InvestmentsMenu from "./components/investments/InvestmentsMenu";
import MovementsMenu from "./components/movements/MovementsTable";
import Login from "./components/login/LoginMenu";
import { useState } from "react";
import { ThemeProvider } from "./hooks/ThemeContext";
import { Nav } from "./components/nav/Nav";
import { useAuthStore } from "./store/storeAuth";

function App() {
  const [menu, setMenu] = useState("general");
  const { isActiveSession } = useAuthStore();
  return (
    <ThemeProvider>
      <main className="">
        {!isActiveSession && <Login />}
        <Nav setMenu={setMenu} />
        {menu === "general" && <GeneralMenu />}
        {menu === "investments" && <InvestmentsMenu />}
        {menu === "movements" && <MovementsMenu />}
      </main>
    </ThemeProvider>
  );
}

export default App;
