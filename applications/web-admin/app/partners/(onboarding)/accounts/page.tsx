import { Suspense } from "react";
import { TableSkeleton } from "@car-rentals/ui";
import Accounts from "./accounts";
import { ACCOUNT_COLUMN_WIDTHS } from "./columns";

export default function AccountsPage(){
    return (
        <div className="p-12">
            <Suspense fallback={<TableSkeleton columnWidths={ACCOUNT_COLUMN_WIDTHS} rows={2} />}>
                <Accounts />
            </Suspense>
        </div>
    )
}