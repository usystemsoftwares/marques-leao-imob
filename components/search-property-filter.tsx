"use client"

const SearchPropertyFilter = () => {
  return (
    <form
      action=""
      className="w-[min(100%,65rem)] flex justify-between absolute bottom-[10rem] translate-x-1/2 right-1/2 bg-white py-4 px-5 rounded-lg"
    >
      <input
        type="text"
        placeholder="Clique para iniciar sua busca"
        className="flex-1 placeholder:text-black placeholder:text-sm md:placeholder:text-base placeholder:italic text-black outline-none"
      />
      <button
        className="bg-[#2a2b2f] text-sm py-2 px-4 md:px-6 rounded-lg"
        type="submit"
      >Buscar imóveis</button>
    </form>
  )
}

export default SearchPropertyFilter