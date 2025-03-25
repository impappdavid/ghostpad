



function Navbar() {

    return (
        <>
            <div className="w-full max-w-4xl h-8  mt-32 px-2 flex flex-col items-center gap-16">
                <div className="font-body w-fit bg-zinc-900 border rounded-full px-3 py-1 text-xs text-zinc-400">GHOSTPAD</div>
                <div className="flex flex-col gap-4 items-center">
                    <div className="text-4xl font-body">
                        Powerful, Effortless Note-Taking <br /> for Everyone.
                    </div>
                    <div className="text-zinc-400 text-sm max-w-lg font-body">
                        Capture ideas, organize thoughts, and write with ease whether you're a developer, creator, or anyone who loves structured note-taking.
                    </div>
                </div>
                <div className="flex flex-col gap-8 items-center">
                    
                    <div className="flex gap-2">
                        <a href="#" className="font-body px-3 py-1.5 text-sm border  hover:bg-zinc-900 rounded-md transition-all">
                            Log in
                        </a>
                        <a href="#" className="px-4 py-1.5 text-sm font-body bg-[#ab9ff2c9]  hover:bg-[#ab9ff2c1] rounded-md transition-all flex items-center">
                            Get started
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar
