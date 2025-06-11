import { ThemeToggle } from "./ToggleTheme";

interface NavProps {
  setMenu: (menu: string) => void;
}

export function Nav({ setMenu }: NavProps) {
  const NavButton = ({
    type,
    children,
  }: {
    type: string;
    children: React.ReactNode;
  }) => {
    return (
      <button
        className="p-4 text-xl underline hover:text-gray-400 dark:hover:bg-gray-700"
        onClick={() => setMenu(type)}
      >
        {children}
      </button>
    );
  };
  return (
    <nav className="bg-gray-200 dark:bg-gray-800 p-4 flex flex-row justify-between items-start ">
      <div className="flex-1 flex justify-center">
        <main className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold"> Finance Manager</h1>
          <section>
            <NavButton type="general">General</NavButton>
            <NavButton type="movements">Movimientos</NavButton>
            <NavButton type="investments">Inversiones</NavButton>
          </section>
        </main>
      </div>

      <section>
        <ThemeToggle />
      </section>
    </nav>
  );
}
