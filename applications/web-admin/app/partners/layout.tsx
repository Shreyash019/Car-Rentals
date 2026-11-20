export default function Layout({ children }: LayoutProps<"/partners">) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="h-28 bg-gray-50 text-center">Header</header>
      <main className="flex-1">{children}</main>
      <footer className="h-28 bg-gray-50 text-center">Footer</footer>
    </div>
  );
}
