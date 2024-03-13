import React from "react"
import Image from "next/image"
import Searchbar from "@/components/Searchbar"
import HeroCarousel from "@/components/HeroCarousel"
import { getAllProducts } from "@/lib/actions"
import ProductCard from "@/components/ProductCard"

const Home = async () => {
  const allProducts = await getAllProducts();//next.js allows for users to just use async in the line above without worrying about use effects and states

  return (
    <>
      <section className="px-6 md:px-20 py-24 border-yellow-400"> 
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="head-text">
              Save With The Power Of 
              <span className="title-yellow"> a</span>Scrape
            </h1>
            <p className="mt-6">
              Powerful, Self-Serve Product and Growth Analytics to Help You Convert, Engage, and Retain Your Money
            </p>
            <Searchbar />
          </div>
            <HeroCarousel />
        </div>
      </section>
      <section className="searched-section">
          <h2 className="section-text">Searched</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-16">
            {allProducts?.map
            ((product) => (
              <ProductCard key = {product._id} product = {product} />
            ))}
          </div>
      </section>
    </>
  )
}

export default Home