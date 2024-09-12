"use client"

import UseEmblaCarousel from "embla-carousel-react"
import { EmblaCarouselType, EmblaEventType } from "embla-carousel"
import { useCallback, useEffect, useRef } from "react"

import { imoveis } from "@/data"
import Image from "next/image"
import Link from "next/link"

const TWEEN_FACTOR_BASE = 0.52

const numberWithinRange = (number: number, min: number, max: number): number => Math.min(Math.max(number, min), max)

const SelectedForYou = () => {
  const FeaturedProperties = imoveis.filter((imovel) => imovel.categoria === "destaque");

  const tweenFactor = useRef(0)
  const tweenNodes = useRef<HTMLElement[]>([])

  const [emblaRef, emblaApi] = UseEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__slide__number') as HTMLElement
    })
  }, [])

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine()
      const scrollProgress = emblaApi.scrollProgress()
      const slidesInView = emblaApi.slidesInView()
      const isScrollEvent = eventName === 'scroll'

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
    },
    []
  )

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
          {FeaturedProperties.map((featuredProperty) => (
            <Link href={`/imoveis/${featuredProperty.id}`} className="embla__slide relative" key={featuredProperty.id}>
              <div className="embla__slide__number pt-5">
                {featuredProperty.exclusividade ?
                  <div className="absolute top-0 bg-[#530944] py-[.35rem] px-4 rounded-r-md rounded-tl-md">EXCLUSIVIDADE</div>
                  : null}
                {featuredProperty.desconto ? <div className="absolute -top-4 bg-[#095310] py-[.35rem] px-4 rounded-r-md rounded-tl-md">imóvel COM DESCONTO</div> : null}
                <Image
                  className="w-full rounded-md"
                  src={featuredProperty.fotos[0]}
                  alt={featuredProperty.titulo}
                  width={550}
                  height={350}
                />
                <div className="flex items-center justify-between bg-[rgb(0,0,0,0.3)] p-2 absolute bottom-0 w-full left-0">
                  <p className="font-bold">R$ {featuredProperty.valores.precoVenda}</p>
                  <p className="text-sm">{featuredProperty.bairro} / {featuredProperty.cidade}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <button className="embla__prev absolute top-1/2 translate-y-1/2 left-0" onClick={scrollPrev}>Prev</button>
      <button className="embla__next absolute top-1/2 translate-y-1/2 right-0" onClick={scrollNext}>Next</button>
    </div>

  )
}

export default SelectedForYou