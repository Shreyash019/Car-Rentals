import Link from "next/link";
import { Badge, Card, Logo, ThemeToggle, buttonVariants } from "@car-rentals/ui";

const AREAS = [
  {
    title: "Partner accounts",
    body: "See every rental partner, their status and when they joined.",
    href: "/partners/accounts",
    badge: <Badge tone="success">Live</Badge>,
  },
  {
    title: "Verify partners",
    body: "Review documents from new partners before they can list cars.",
    href: "/partners/verify",
    badge: <Badge tone="warning">Coming soon</Badge>,
  },
];

export default function AdminHome() {
  return (
    <>
      <header className="border-b border-border">
        <div className="page-container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge>Admin</Badge>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="page-container section stack flex-1">
        <div>
          <h1>Admin</h1>
          <p className="text-body-lg text-muted-foreground">Pick an area to manage.</p>
        </div>
        <div className="auto-grid">
          {AREAS.map((a) => (
            <Card key={a.href} className="fx-lift stack gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3>{a.title}</h3>
                {a.badge}
              </div>
              <p className="text-muted-foreground">{a.body}</p>
              <Link href={a.href} className={buttonVariants({ variant: "outline", className: "self-start" })}>
                Open
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
