import RealEstatePage from "../[...path]/page";

export default async function Page({
  params,
  searchParams,
}: {
  params: { path: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <RealEstatePage params={params} searchParams={searchParams} />;
}
