import { Suspense } from "react";
import Accounts from "./accounts";

export default function AccountsPage(){
    return (
        <div className="p-12">
            <Suspense fallback={<div>m....</div>}>
                <Accounts />
            </Suspense>
        </div>
    )
}