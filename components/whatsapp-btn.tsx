import Image from "next/image"
import Link from "next/link"
import Whatsapp from "/public/marqueseleao/wpp-button.webp"

export const WhatsappButton = () => {
  return (
    <div className="fixed w-[min(3.125rem,100%)] md:w-[min(4.375rem,100%)] aspect-square right-[3.125rem] bottom-[10rem] md:bottom-[1.625rem] z-[51]">
      <Link href="">
        <Image
          className="w-full"
          src={Whatsapp}
          alt="Whatsapp"
          width={0}
          height={0}
        />
      </Link>
    </div>
  )
}