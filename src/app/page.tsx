import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");

  //  return (
  //   <main className="p-6">
  //     <h1 className="text-3xl font-bold">Leadgarly</h1>
  //     <p className="mt-2 text-sm text-muted-foreground">
  //       Personal Triforce dashboard: Career, Health & Wellbeing, Finance.
  //     </p>
  //   </main>
  // );
}
