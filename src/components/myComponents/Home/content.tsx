import Editor from "./editor";
import FileExplorer from "./fileExplorer";
import Navbar from "./navbar";

function Content() {
    return(
        <>
        <div className="w-full flex flex-col">
            <div className="">
                <Navbar />
            </div>
            <div className="flex ">
                <FileExplorer />
            </div>
        </div>
        </>
    )
}
export default Content;