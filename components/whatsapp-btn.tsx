import Image from "next/image"
import Link from "next/link"

export const WhatsappButton = () => {
  return (
    <div className="hidden md:block fixed w-[min(5rem,100%)] aspect-square right-16 bottom-8 z-50">
      <Link href="">
        <div className="absolute w-full h-full border-[3px] bg-black border-[#61FFB3] shadow-[#61FFB3] shadow-button rounded-full"></div>
        {/* <Image
          className="w-1/2 translate-x-[50%] translate-y-[50%] right-1/2 bottom-1/2"
          src={Whatsapp}
          alt="Whatsapp"
          width={0}
          height={0}
        /> */}
      </Link>
    </div>
  )
}