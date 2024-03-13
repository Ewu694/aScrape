import React from "react"
import Link from "next/link"
import Image from "next/image"

const navIcons = [//allows for dynamic imaging to not waste more program code on parsing 3 different images
    {src: "/assets/icons/search.svg", alt: "search"},
    {src: "/assets/icons/black-heart.svg", alt: "heart"},
    {src: "/assets/icons/user.svg", alt: "user"},
]

const Navbar = () => {
  return (
    <header className = "w-full"> 
        <nav className = "nav">
            <Link href="/" className = "flex items-center-gap-">
                <Image
                    src="/assets/icons/logo.svg"
                    width={27}
                    height={27}
                    alt="logo"
                />
                <p className="nav-logo">
                     Scrape
                </p>
            </Link>
            <div className="flex items-center gap-5">
                {navIcons.map((icon) => (
                    <Image
                        key={icon.alt}
                        src={icon.src}
                        alt={icon.alt}
                        width={28}
                        height={28}
                        className="object-contain"
                    />
                ))}
            </div>
        </nav>
    </header>
  )
}

export default Navbar