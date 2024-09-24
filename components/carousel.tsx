"use client"

import UseEmblaCarousel from "embla-carousel-react"
import { EmblaCarouselType, EmblaEventType } from "embla-carousel"
import { useCallback, useEffect, useRef, useState } from "react"

import { imoveis } from "@/data"
import Image from "next/image"
import Link from "next/link"

import EstateImage from "/public/marqueseleao/imovel-1.webp"
import Bed from "/public/marqueseleao/cama.svg"
import ResizeIcon from "/public/marqueseleao/resize-icon.svg"
import ArrowLeft from "/public/marqueseleao/arrow-left.webp"
import ArrowRight from "/public/marqueseleao/arrow-right.webp"
import { cn } from "@/lib/utils"

import HeartIcon from "/public/marqueseleao/heart-icon.svg"
import SelectedHeartIcon from "/public/marqueseleao/selected-heart-icon.svg"

const TWEEN_FACTOR_BASE = .05

const numberWithinRange = (number: number, min: number, max: number): number => Math.min(Math.max(number, min), max)

type Estates = typeof imoveis

type CarouselProps = {
  estates: Estates
}

const Carousel = ({ estates }: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState<number[]>([])
  const [emblaRef, emblaApi] = UseEmblaCarousel({ loop: true })
  const tweenFactor = useRef(0)
  const tweenNodes = useRef<HTMLElement[]>([])

  const scrollPrev = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollPrev()) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollNext()) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__slide__number') as HTMLElement
    })
  }, [])

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenScale = useCallback((emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = eventName === "scroll"

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
        const scale = numberWithinRange(tweenValue, 0, 1).toString()
        const tweenNode = tweenNodes.current[slideIndex]
        tweenNode.style.transform = `scale(${scale})`
      })
    })
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setTweenNodes(emblaApi)
    setTweenFactor(emblaApi)
    tweenScale(emblaApi)
    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('scroll', tweenScale)
      .on('slideFocus', tweenScale)
  }, [emblaApi, tweenScale, setTweenFactor, setTweenNodes])

  /* TODO: SCALE FROM .9 TO 1 ON FONT SIZES */

  /* TODO: SCALE FROM 0 TO 1 ON HEART, BUT NOT ON EMPTY HEART */

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className={cn("embla__container", estates.length <= 2 && "gap-4")}>
          {estates.map((estate, index) => (
            <div
              key={estate.id}
              className={cn("group flex-shrink-0 flex-grow-0 embla__slide relative", estates.length <= 4 && "min-w-[33.4%]")}
            >
              <div className="embla__slide__number pt-5">
                {estate.exclusividade &&
                  <div className="absolute z-10 top-0 bg-[#530944] py-[.35rem] px-4 rounded-r-[100vmax] rounded-tl-[100vmax]">EXCLUSIVIDADE</div>
                }
                {estate.desconto &&
                  <div className="absolute z-10 top-0 bg-[#095310] py-[.35rem] px-4 rounded-r-[100vmax] rounded-tl-[100vmax]">IMÓVEL COM DESCONTO</div>
                }
                <div className="relative">
                  <button className="block absolute right-[5%] top-[7.5%]"
                    onClick={() => {
                      if (!activeIndex.includes(index)) return setActiveIndex([...activeIndex, index])
                      setActiveIndex(activeIndex.filter(i => i !== index))
                    }}>
                    <Image
                      className={cn("w-8 absolute top-0 right-0 transition-transform duration-75 z-10 scale-0", activeIndex.includes(index) && "scale-100")}
                      src={SelectedHeartIcon}
                      alt="Ícone de coração selecionado"
                    />
                    <Image
                      className="w-8 top-0 right-0"
                      src={HeartIcon}
                      alt="Ícone de coração"
                    />
                  </button>
                  <Link className="block" href={`/imoveis/${estate.id}`}
                  >
                    <Image
                      className="w-full rounded-lg"
                      src={EstateImage}
                      alt={estate.titulo}
                    />
                  </Link>
                </div>
                <Link href={`/imoveis/${estate.id}`} className="flex items-center justify-between rounded-b-lg bg-[#666666] bg-opacity-60 py-2 px-2 md:px-8 absolute bottom-0 w-full left-0 group-hover:opacity-0 transition-opacity duration-300">
                  <p className="font-semibold text-sm lg:text-base">R$ {estate.valores.precoVenda}</p>
                  <p className="text-[.75rem]">{estate.bairro} / {estate.cidade}</p>
                </Link>
                <Link href={`/imoveis/${estate.id}`} className="absolute flex items-stretch rounded-b-lg overflow-hidden w-full bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 *:py-2">
                  <div className="w-[65%] bg-white flex pl-2 md:pl-4 gap-2 md:gap-7 text-black text-[.75rem]">
                    <span className="inline-flex gap-3 items-center scale-90 group-hover:scale-100 delay-75 transition-transform">
                      <Image
                        src={ResizeIcon}
                        alt="Seta que indica tamanho"
                      />
                      {estate.informacoes.areaTerro}m
                    </span>
                    <span className="inline-flex gap-3 items-center scale-90 group-hover:scale-100 delay-75 transition-transform">
                      <Image
                        src={Bed}
                        alt="Cama"
                      /> {estate.informacoes.dormitorios} quartos
                    </span>
                  </div>
                  <div className="w-[35%] scale-90 group-hover:scale-100 delay-75 transition-transform flex items-center lg:block text-center bg-mainPurple px-3">Conhecer</div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {emblaApi?.canScrollPrev() && (
        <button className="embla__prev absolute top-[calc(50%+1.25rem)] translate-y-1/2 left-[2%] md:left-[-4%]" onClick={scrollPrev}>
          <Image
            src={ArrowLeft}
            alt="Seta para esquerda"
          />
        </button>
      )}

      {emblaApi?.canScrollNext() && (
        <button className="embla__next absolute top-[calc(50%+1.25rem)] translate-y-1/2 right-[2%] md:right-[-4%]" onClick={scrollNext}>
          <Image
            src={ArrowRight}
            alt="Seta para direita"
          />
        </button>
      )}
    </div>
  )
}

export default Carousel