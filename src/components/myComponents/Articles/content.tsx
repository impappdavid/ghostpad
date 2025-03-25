import ArticleCard from "./articleCard"
import SubscribeForm from "./subscribe"




function Content() {

    return (
        <>
            <div className="w-full max-w-4xl h-8  mt-32 px-2 flex flex-col items-center gap-12 ">
                <div className="font-body w-fit bg-gradient-to-b from-zinc-800 to-zinc-900 border rounded-full px-3 py-1 text-xs text-zinc-400">ARTICLES</div>
                <div className="flex flex-col gap-10 items-center">
                    <div className="flex flex-col gap-4 items-center">
                        <div className="text-4xl font-body">
                            We're big on sharing our workflow
                        </div>
                        <div className="text-zinc-400 text-md max-w-xl font-body">
                            Here's everything you can learn from us written up by our team.
                            If you wish to receive these in your email box, sucbscribe.
                        </div>
                    </div>
                    <SubscribeForm />
                </div>
                
                <div className="flex flex-col gap-4 pb-14">
                    <ArticleCard />
                </div>

            </div>
        </>
    )
}

export default Content
