import { font_lato, font_poppins_one } from "@/lib/font"

export const TitlePage = () => {
    return <>
        <div className={`${font_poppins_one.className} bg-bg-main-2 py-8 px-4 md:px-9 grid grid-cols-2`}>
            <div className="">
                <h2 className="text-xl text-white ">A Global Call for
                    <div className="text-4xl md:text-5xl font-extrabold">Climate Action</div></h2>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-[400px] h-[450px] bg-cyan-600 rounded-xl">
                </div>
            </div>
        </div>
    </>
}