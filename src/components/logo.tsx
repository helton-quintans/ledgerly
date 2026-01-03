import ReuleauxTriangle from "./ui/ReuleauxTriangle";
import Spinner from "./ui/Spinner";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <ReuleauxTriangle radius={28} variant="outline" stroke="var(--primary)" />
      <h1 className="font-bold">ledgerly</h1>
    </div>
  );
}

export function LogoSpinner() {
  return (
    <div className="flex items-center gap-2">
      <Spinner size={40} color="var(--primary)" speed={1} />
      <h1 className="font-bold">ledgerly</h1>
    </div>
  );
}
