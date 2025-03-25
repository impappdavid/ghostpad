import { Link } from "react-router-dom";
import logo from "../../../../public/ghostpad.png";
function Navbar() {

    return (
        <>
            <div className="w-full flex justify-center ">
                <div className="w-full max-w-4xl flex justify-between items-center rounded-2xl bg-zinc-900/70 backdrop-blur-md border gap-4 p-2 py-1.5 fixed top-3">
                    <div className="flex gap-2 items-center">
                        <a href="/" className="flex gap-1 items-center hover:rotate-180 transition-all duration-500">
                            <img src={logo} alt="Logo" className="w-7 h-7 rounded-lg" />
                        </a>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><g fill="#b0a4f7"><path d="M176 128a48 48 0 1 1-48-48a48 48 0 0 1 48 48" opacity="0.2" /><path d="M140 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12" /></g></svg>
                        </div>
                        <div className="hidden md:flex gap-1  ">
                            <a href="#" className="font-body px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
                                About
                            </a>
                            <a href="#" className="font-body px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
                                Features
                            </a>
                            <Link to="/articles" className="font-body px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
                                Articles
                            </Link>
                            <a href="#" className="font-body px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
                                Docs
                            </a>
                        </div>

                    </div>

                    <div className="flex gap-2">
                        <a href="#" className="font-body px-3 py-1.5 text-sm border  hover:bg-zinc-950/50 rounded-xl transition-all">
                            Log in
                        </a>
                        <a href="#" className="font-body px-3 py-1.5 text-sm  bg-[#ab9ff2c9]  hover:bg-[#ab9ff2c1] rounded-xl transition-all flex items-center">
                            Get started
                        </a>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Navbar
