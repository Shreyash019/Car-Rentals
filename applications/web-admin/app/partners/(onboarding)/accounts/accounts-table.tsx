"use client";

import { useRouter } from "next/navigation";
import { DataTable, type DataTableColumn } from "@car-rentals/ui";
import { ACCOUNT_COLUMN_WIDTHS } from "./columns";

export type Account = {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending";
  joined: string;
};

export function AccountsTable({ accounts }: { accounts: Account[] }) {
  const router = useRouter();

  const columns: DataTableColumn<Account>[] = [
    { id: "name", header: "Name", accessor: "name", width: ACCOUNT_COLUMN_WIDTHS[0] },
    {
      id: "email",
      header: "Email",
      accessor: "email",
      width: ACCOUNT_COLUMN_WIDTHS[1],
      onCellClick: (a) => (window.location.href = `mailto:${a.email}`),  // column click
      cellLabel: (a) => `Email ${a.name}`,
    },
    { id: "status", header: "Status", accessor: "status", width: ACCOUNT_COLUMN_WIDTHS[2] },
    { id: "joined", header: "Joined", accessor: "joined", width: ACCOUNT_COLUMN_WIDTHS[3], align: "right" },
  ];

  return (
    <DataTable
      data={accounts}
      columns={columns}
      getRowId={(a) => a.id}
      onRowClick={(a) => router.push(`/partners/accounts/${a.id}`)}  // row click
      rowLabel={(a) => `Open account ${a.name}`}
      caption="Partner accounts"
    />
  );
}
