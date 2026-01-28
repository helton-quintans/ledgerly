import { ReuleauxTriangle, Spinner } from "@ledgerly/ui";


export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <ReuleauxTriangle
        radius={16}
        variant="outline"
        stroke="var(--primary)"
        label="L"
        labelFill="var(--primary)"
        labelFontSize={18}
        showLabel={false}
      />
      <h1 className="font-bold">Ledgerly</h1>
    </div>
  );
}

type LogoSpinnerProps = {
  color?: string;
};

export function LogoSpinner({ color = "var(--primary)" }: LogoSpinnerProps) {
  return (
    <div className="flex items-center gap-2">
      <Spinner
        size={28}
        triangleScale={0.6}
        color={color}
        speed={0.4}
      />
    </div>
  );
}

export function LogoPulse() {
  return (
    <div className="logo-pulse">
      <div className="logo-pulse__icon">
        <ReuleauxTriangle
          radius={18}
          variant="outline"
          stroke="var(--primary)"
          showLabel={false}
        />
      </div>
      <span className="logo-pulse__text">Ledgerly</span>
    </div>
  );
}
