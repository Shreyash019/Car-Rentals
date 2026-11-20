const data = {
    success: true,
    message: "Data Fetched",
}

const delayCall = () =>
    new Promise<typeof data>((resolve) => {
        setTimeout(() => resolve(data), 2000)
    })

export default function fetchStaticDataWithDelay(_dataType: string) {
    return delayCall()
}