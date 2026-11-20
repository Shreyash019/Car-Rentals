import Link from "next/link";
import { Badge, Logo, ThemeToggle } from "@car-rentals/ui";

export default function Layout({ children }: LayoutProps<"/partners">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border">
        <div className="page-container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Logo />
            <Badge>Admin</Badge>
          </Link>
          <nav className="flex items-center gap-4 text-small" aria-label="Partners">
            <Link href="/partners/accounts" className="fx-underline">Accounts</Link>
            <Link href="/partners/verify" className="fx-underline">Verify</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="page-container flex-1 py-8">{children}</main>
      <footer className="bg-muted">
        <div className="page-container py-6 text-small text-muted-foreground">Partner management</div>
      </footer>
    </div>
  );
}
