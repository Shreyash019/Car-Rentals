import { Logo, ThemeToggle, ZoneLink } from "@car-rentals/ui";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 fx-glass border-0 border-b">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="flex items-center gap-2" aria-label="Main">
          <ZoneLink zone="providers" href="/" className="link text-small">
            For partners
          </ZoneLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
