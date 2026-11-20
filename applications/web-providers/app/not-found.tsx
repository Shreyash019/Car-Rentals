import Link from "next/link";
import { Badge, buttonVariants } from "@car-rentals/ui";

export default function NotFound() {
  return (
    <main className="page-container section stack flex-1 items-center justify-center text-center">
      <Badge tone="highlight">Error 404</Badge>
      <h1>Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className={buttonVariants()}>
        Go to the home page
      </Link>
    </main>
  );
}
