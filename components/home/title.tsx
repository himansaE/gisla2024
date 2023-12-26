import { font_lato, font_poppins_one } from "@/lib/font"

export const TitlePage = () => {
    return <section className={`${font_poppins_one.className} bg-bg-main-2 py-8 px-4 md:px-9`}>
        <div className="grid grid-cols-2 justify-items-center">
            <div className="w-full max-w-[400px]">
                <h2 className="text-xl text-white ">A Global Call for
                    <div className="text-4xl md:text-5xl font-extrabold">Climate Action</div></h2>
            </div>
            <div className="flex flex-col items-center gap-5 w-full max-w-[400px]">
                <div className="w-full  h-[450px] bg-[#3BA19A] rounded-xl">
                </div>
                <div className="w-full h-[70px] bg-[#3BA19A] rounded-xl">
                </div>
            </div>
        </div>
        <div className="py-32"> <p className="text-center text-4xl text-white">
            <span className="text-green-400">JOIN US</span> ON THIS JOURNEY AS WE STRIVE TO EXCEED
            <br />
            YOUR EXPECTATIONS AND HELP YOU CREATE <span className="text-green-400">FURNITURE</span></p></div>
    </section>
}