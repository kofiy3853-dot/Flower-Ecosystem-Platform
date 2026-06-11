"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const trendingSearches = [
  "Rose",
  "Orchid",
  "Lavender",
  "Wedding Flowers",
  "Medicinal Flowers",
  "Tropical Flowers",
]

export function SearchSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  return (
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient mb-4">
            Search the Flower Database
          </h2>
          <p className="text-center text-sage-600 mb-10 text-lg">
            Find flowers by name, scientific name, family, category, or use
          </p>

          {/* Search Bar */}
          <div className="relative mb-8">
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sage-400" />
                <Input
                  type="text"
                  placeholder="Search for flowers, families, or uses..."
                  className="pl-12 pr-4 h-14 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
              </div>
            </motion.div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-10"
              >
                <div className="p-4">
                  <p className="text-sm font-medium text-sage-500 mb-3">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => setSearchQuery(search)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm hover:bg-emerald-100 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Trending Searches */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sage-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Trending:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingSearches.map((search, index) => (
                <motion.button
                  key={search}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchQuery(search)}
                  className="px-4 py-2 glass rounded-full text-sm text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  {search}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
