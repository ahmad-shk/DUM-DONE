import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedDishes } from "@/components/featured-dishes"
import { Menu } from "@/components/menu"
import { About } from "@/components/about"
import { Reviews } from "@/components/reviews"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <FeaturedDishes />
      <Menu />
      <About />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  )
}
