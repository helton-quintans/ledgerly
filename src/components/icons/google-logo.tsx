import type { SVGProps } from "react";

export default function GoogleLogo(props: SVGProps<SVGSVGElement>) {
  const {
    width = 20,
    height = 20,
    "aria-hidden": ariaHidden = true,
    ...rest
  } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      aria-hidden={ariaHidden}
      focusable="false"
      {...rest}
    >
      <title>Google logo</title>
      <path
        fill="#EA4335"
        d="M24 9.5c3.35 0 5.64 1.45 6.93 2.66l5.07-5.07C33.93 4.04 29.76 2 24 2 14.82 2 6.77 7.58 3.2 15.44l6.94 5.39C11.69 13.45 17.28 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.57-.14-3.09-.41-4.56H24v8.63h12.7c-.55 2.8-2.17 5.17-4.63 6.77l7.03 5.45C43.93 37.27 46.5 31.4 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.14 28.82a14.45 14.45 0 0 1-.76-4.32c0-1.5.27-2.94.75-4.32l-6.94-5.39C1.97 17.55 1 20.6 1 24s.97 6.45 2.19 9.21l6.95-5.39z"
      />
      <path
        fill="#34A853"
        d="M24 46c6.48 0 11.93-2.13 15.9-5.82l-7.03-5.45c-2 1.35-4.57 2.15-7.87 2.15-6.72 0-12.31-3.96-14.86-9.5L3.2 33.21C6.78 41.06 14.82 46 24 46z"
      />
      <path fill="none" d="M1 1h46v46H1z" />
    </svg>
  );
}
