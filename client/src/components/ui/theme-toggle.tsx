import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/components/ui/theme-provider";
import { useEffect } from "react";

// Componente modificado para usar apenas o tema claro
export function ThemeToggle() {
  const { setTheme } = useThemeContext();

  // Força o tema claro sempre que o componente é montado
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  // Retorna apenas um botão decorativo, pois não há opção de alternar mais
  return (
    <Button variant="outline" size="icon" className="cursor-default">
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Tema claro</span>
    </Button>
  );
}
