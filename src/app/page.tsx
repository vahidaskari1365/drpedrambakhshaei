import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Services } from "@/components/site/services";
import { GallerySection } from "@/components/site/gallery-section";
import { About } from "@/components/site/about";
import { Prices } from "@/components/site/prices";
import { Faq } from "@/components/site/faq";
import { Reviews } from "@/components/site/reviews";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <GallerySection />
        <About />
        <Prices />
        <Faq />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
