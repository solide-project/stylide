import { StylusIDE } from "@/components/stylus/ide";
import { StylusProvider } from "@/components/stylus/stylus-provider";
import { loadSampleProject, getStylusContract } from "@/lib/server";

interface SearchParams {
  params: { slug: string }
  searchParams?: { [key: string]: string | undefined }
}
export default async function IndexPage({ searchParams }: SearchParams) {
  let url = ""
  searchParams?.url && (url = searchParams.url)

  let input = loadSampleProject()
  if (url) {
    input = await getStylusContract(url)
  }

  return <StylusProvider>
    <StylusIDE
      content={JSON.stringify(input)}
    />
  </StylusProvider>
}
