import { Suspense } from "react";
import Accounts from "./accounts";

export default function AccountsPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading accounts...</div>}>
        <Accounts />
      </Suspense>
    </div>
  );
}
