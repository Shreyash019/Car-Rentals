"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmDialog,
  DataTable,
  DropdownMenu,
  MenuItem,
  MenuSeparator,
  MoreHorizontalIcon,
  TriggerButton,
  toast,
  type DataTableColumn,
} from "@car-rentals/ui";
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
  // Kept separately from `confirmOpen` so the name stays visible while the dialog animates closed.
  const [rejectTarget, setRejectTarget] = useState<Account | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const columns: DataTableColumn<Account>[] = [
    {
      id: "name",
      header: "Name",
      accessor: "name",
      width: ACCOUNT_COLUMN_WIDTHS[0],
    },
    {
      id: "email",
      header: "Email",
      accessor: "email",
      width: ACCOUNT_COLUMN_WIDTHS[1],
      onCellClick: (a) => (window.location.href = `mailto:${a.email}`), // column click
      cellLabel: (a) => `Email ${a.name}`,
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
      width: ACCOUNT_COLUMN_WIDTHS[2],
    },
    {
      id: "joined",
      header: "Joined",
      accessor: "joined",
      width: ACCOUNT_COLUMN_WIDTHS[3],
      align: "right",
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      width: ACCOUNT_COLUMN_WIDTHS[4],
      align: "right",
      cell: (a) => (
        <DropdownMenu
          label={`Actions for ${a.name}`}
          trigger={
            <TriggerButton variant="ghost" size="icon" aria-label={`Actions for ${a.name}`}>
              <MoreHorizontalIcon />
            </TriggerButton>
          }
        >
          <MenuItem onAction={() => router.push(`/partners/accounts/${a.id}`)}>View</MenuItem>
          <MenuItem onAction={() => toast.success(`${a.name} approved`)}>Approve</MenuItem>
          <MenuSeparator />
          <MenuItem
            tone="danger"
            onAction={() => {
              setRejectTarget(a);
              setConfirmOpen(true);
            }}
          >
            Reject
          </MenuItem>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={accounts}
        columns={columns}
        getRowId={(a) => a.id}
        onRowClick={(a) => router.push(`/partners/accounts/${a.id}`)} // row click
        rowLabel={(a) => `Open account ${a.name}`}
        caption="Partner accounts"
      />
      <ConfirmDialog
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Reject ${rejectTarget?.name ?? "partner"}?`}
        description="They'll get an email and can apply again later."
        tone="danger"
        confirmLabel="Reject"
        onConfirm={async () => {
          if (!rejectTarget) return;
          // await rejectPartner(rejectTarget.id)  ← your server action
          toast({ title: `${rejectTarget.name} rejected`, tone: "neutral" });
        }}
      />
    </>
  );
}
