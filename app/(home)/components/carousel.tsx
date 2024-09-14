"use client"

import UseEmblaCarousel from "embla-carousel-react"
import { EmblaCarouselType, EmblaEventType } from "embla-carousel"
import { useCallback, useEffect, useRef } from "react"

import { imoveis } from "@/data"
import Image from "next/image"
import Link from "next/link"

import EstateImage from "/public/marqueseleao/imovel-1.webp"
import Bed from "/public/marqueseleao/cama.svg"
import ResizeIcon from "/public/marqueseleao/resize-icon.svg"
import ArrowLeft from "/public/marqueseleao/arrow-left.webp"
import ArrowRight from "/public/marqueseleao/arrow-right.webp"

const TWEEN_FACTOR_BASE = .1

const numberWithinRange = (number: number, min: number, max: number): number => Math.min(Math.max(number, min), max)

type Estates = typeof imoveis

type CarouselProps = {
  estates: Estates
}

const Carousel = ({ estates }: CarouselProps) => {
  const [emblaRef, emblaApi] = UseEmblaCarousel({ loop: true })
  const tweenFactor = useRef(0)
  const tweenNodes = useRef<HTMLElement[]>([])

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
      console.log(emblaApi.selectedScrollSnap())
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
      console.log(emblaApi.selectedScrollSnap())
    }
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
  }, [emblaApi, tweenScale])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {estates.map((estate, index: number) => (
            <Link
              key={estate.id}
              className="group flex-shrink-0 flex-grow-0 embla__slide relative"
              href={`/imoveis/${estate.id}`}
            >
              <div className="embla__slide__number pt-5">
                {estate.exclusividade &&
                  <div className="absolute top-0 bg-[#530944] py-[.35rem] px-4 rounded-r-lg rounded-tl-lg">EXCLUSIVIDADE</div>
                }
                {estate.desconto &&
                  <div className="absolute -top-4 bg-[#095310] py-[.35rem] px-4 rounded-r-lg rounded-tl-lg">imóvel COM DESCONTO</div>
                }
                <Image
                  className="w-full rounded-lg"
                  src={EstateImage}
                  alt={estate.titulo}
                />
                <div className="flex items-center justify-between rounded-b-lg bg-[#666666] bg-opacity-60 py-2 px-8 absolute bottom-0 w-full left-0 group-hover:opacity-0 transition-opacity">
                  <p className="font-semibold">R$ {estate.valores.precoVenda}</p>
                  <p className="text-[.75rem]">{estate.bairro} / {estate.cidade}</p>
                </div>
                <div className="absolute flex items-stretch rounded-b-lg overflow-hidden w-full bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity *:py-2">
                  <div className="w-[65%] bg-white flex pl-4 gap-7 text-black text-[.75rem]">
                    <span className="inline-flex gap-3 items-center">
                      <Image
                        src={ResizeIcon}
                        alt="Seta que indica tamanho"
                      />
                      125,14m
                    </span>
                    <span className="inline-flex gap-3 items-center">
                      <Image
                        src={Bed}
                        alt="Cama"
                      /> 3 quartos
                    </span>
                  </div>
                  <div className="w-[35%] text-center bg-mainPurple px-3">Conhecer</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <button className="embla__prev absolute top-1/2 translate-y-1/2 left-[-4%]" onClick={scrollPrev}>
        <Image
          src={ArrowLeft}
          alt="Seta para esquerda"
        />
      </button>
      <button className="embla__next absolute top-1/2 translate-y-1/2 right-[-4%]" onClick={scrollNext}>
        <Image
          src={ArrowRight}
          alt="Seta para direita"
        />
      </button>
    </div>
  )
}

export default Carousel