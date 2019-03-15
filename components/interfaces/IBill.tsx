export default interface IBill{
    id: string,
    title: string,
    asset: JSON,
    site:string,
    month: string,
    unitRate: number,
    unitsConsumed: number
}
