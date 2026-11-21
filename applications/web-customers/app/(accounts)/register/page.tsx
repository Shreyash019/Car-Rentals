import RegisterForm from "./registerForm";

const Page = () => {
  return (
    <main className="flex flex-col items-center justify-center p-12">
      <div className="container bg-background text-foreground min-h-120 fx-glow-border rounded-card overflow-hidden">
          <RegisterForm/>
      </div>
    </main>
  );
};

export default Page;
