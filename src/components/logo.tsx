import ReuleauxTriangle from "./ui/ReuleauxTriangle";
import Spinner from "./ui/Spinner";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <ReuleauxTriangle radius={16} variant="outline" stroke="var(--primary)" label="L" labelFill="var(--primary)" labelFontSize={18} showLabel={false} />
      <h1 className="font-bold">Ledgerly</h1>
    </div>
  );
}

export function LogoSpinner() {
  return (
    <div className="flex items-center gap-2">
      <Spinner size={28} triangleScale={0.6} color="var(--primary)" speed={0.4} />
    </div>
  );
}
