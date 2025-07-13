import GeneralMenu from "./components/general/GeneralMenu";
import InvestmentsMenu from "./components/investments/InvestmentsMenu";
import MovementsLayout from "./components/layout/movementsLayout";
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
        {menu === "movements" && <MovementsLayout />}
      </main>
    </ThemeProvider>
  );
}

export default App;
