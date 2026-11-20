import { fetchStaticDataWithDelay } from "@/helper";
import { AccountsTable, type Account } from "./accounts-table";

export default async function Accounts() {
  await fetchStaticDataWithDelay("account");

  const accounts: Account[] = [
    {
      id: "1",
      name: "Ravi Motors",
      email: "ravi@example.com",
      status: "active",
      joined: "2026-10-02",
    },
    {
      id: "2",
      name: "City Wheels",
      email: "ops@citywheels.example",
      status: "pending",
      joined: "2026-11-15",
    },
  ];
  return <AccountsTable accounts={accounts} />;
}
