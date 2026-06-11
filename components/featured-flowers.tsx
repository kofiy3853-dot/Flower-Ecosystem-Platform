"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Eye, Heart } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const flowers = [
  {
    name: "Rose",
    scientificName: "Rosa",
    family: "Rosaceae",
    uses: ["Decorative", "Fragrance", "Symbolic"],
    image: "🌹",
    color: "from-rose-400 to-red-500",
  },
  {
    name: "Orchid",
    scientificName: "Orchidaceae",
    family: "Orchidaceae",
    uses: ["Decorative", "Indoor", "Exotic"],
    image: "🌸",
    color: "from-purple-400 to-violet-500",
  },
  {
    name: "Tulip",
    scientificName: "Tulipa",
    family: "Liliaceae",
    uses: ["Garden", "Cut Flowers", "Spring"],
    image: "🌷",
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "Lavender",
    scientificName: "Lavandula",
    family: "Lamiaceae",
    uses: ["Aromatic", "Medicinal", "Relaxation"],
    image: "💜",
    color: "from-indigo-400 to-purple-500",
  },
  {
    name: "Sunflower",
    scientificName: "Helianthus",
    family: "Asteraceae",
    uses: ["Decorative", "Seeds", "Garden"],
    image: "🌻",
    color: "from-amber-400 to-yellow-500",
  },
  {
    name: "Lily",
    scientificName: "Lilium",
    family: "Liliaceae",
    uses: ["Decorative", "Fragrance", "Symbolic"],
    image: "⚪",
    color: "from-white to-gray-100",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function FeaturedFlowers() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Featured Flowers
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Explore our curated selection of beautiful and popular flowers
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {flowers.map((flower) => (
            <motion.div key={flower.name} variants={itemVariants}>
              <Card className="group h-full overflow-hidden">
                <CardHeader className="pb-4">
                  <div
                    className={`w-full h-48 rounded-xl bg-gradient-to-br ${flower.color} flex items-center justify-center text-8xl mb-4 group-hover:scale-105 transition-transform duration-300`}
                  >
                    {flower.image}
                  </div>
                  <CardTitle className="text-2xl text-emerald-900">
                    {flower.name}
                  </CardTitle>
                  <p className="text-sm text-sage-500 italic">{flower.scientificName}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-sage-700">Family</p>
                    <p className="text-emerald-600">{flower.family}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-sage-700">Uses</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {flower.uses.map((use) => (
                        <span
                          key={use}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" className="flex-1 group-hover:bg-emerald-50 transition-colors">
                    <Eye className="h-4 w-4 mr-2" />
                    Quick View
                  </Button>
                  <Button variant="ghost" size="icon" className="group-hover:text-rose-500 transition-colors">
                    <Heart className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
