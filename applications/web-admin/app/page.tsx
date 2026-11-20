"use client"
import { Button } from "@car-rentals/ui"

export default function Home() {
  const sayHello = () => {
    alert("Hello")
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <Button onClick={sayHello}>Hellow</Button>
    </div>
  );
}
