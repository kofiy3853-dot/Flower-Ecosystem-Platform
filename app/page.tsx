import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { SearchSection } from "@/components/search-section"
import { Categories } from "@/components/categories"
import { FeaturedFlowers } from "@/components/featured-flowers"
import { ExplorePurpose } from "@/components/explore-purpose"
import { ExploreUses } from "@/components/explore-uses"
import { FlowerFamilies } from "@/components/flower-families"
import { SeasonalFlowers } from "@/components/seasonal-flowers"
import { LearningCenter } from "@/components/learning-center"
import { MarketplacePreview } from "@/components/marketplace-preview"
import { Statistics } from "@/components/statistics"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <SearchSection />
      <Categories />
      <FeaturedFlowers />
      <ExplorePurpose />
      <ExploreUses />
      <FlowerFamilies />
      <SeasonalFlowers />
      <LearningCenter />
      <MarketplacePreview />
      <Statistics />
      <Newsletter />
      <Footer />
    </main>
  )
}
