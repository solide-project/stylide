import { InvalidMessage } from "@/components/core/components/invalid-message";
import { StylusIDE } from "@/components/stylus/ide";
import { LoadContractPage } from "@/components/stylus/load-contract";
import { StylusProvider } from "@/components/stylus/stylus-provider";
import { loadSampleProject, getStylusContract } from "@/lib/server";

interface SearchParams {
  params: { slug: string }
  searchParams?: { [key: string]: string | undefined }
}
export default async function IndexPage({ searchParams }: SearchParams) {
  let url = ""
  searchParams?.url && (url = searchParams.url)

  let data = loadSampleProject()
  if (url) {
    data = await getStylusContract(url)
  }

  if (typeof data === "string") return <LoadContractPage message={data} />

  return <StylusProvider>
    <StylusIDE
      content={JSON.stringify(data)}
    />
  </StylusProvider>
}
