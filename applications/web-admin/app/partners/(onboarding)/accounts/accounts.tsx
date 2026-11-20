import { fetchStaticDataWithDelay } from "@/helper";

export default async function Accounts(){
    const data = await fetchStaticDataWithDelay("account");
    console.log(data);
    return (
        <div>Accounts</div>
    )
}