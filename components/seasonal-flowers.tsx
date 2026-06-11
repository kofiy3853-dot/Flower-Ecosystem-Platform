"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Snowflake, Sun, Leaf, Flower2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const seasons = [
  {
    icon: Flower2,
    name: "Spring",
    description: "Tulips, Daffodils, Cherry Blossoms",
    flowers: ["🌷", "🌼", "🌸"],
    color: "from-pink-400 to-rose-500",
  },
  {
    icon: Sun,
    name: "Summer",
    description: "Sunflowers, Roses, Lavender",
    flowers: ["🌻", "🌹", "💜"],
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Leaf,
    name: "Autumn",
    description: "Chrysanthemums, Marigolds, Asters",
    flowers: ["🌼", "🌻", "🌾"],
    color: "from-orange-400 to-red-500",
  },
  {
    icon: Snowflake,
    name: "Winter",
    description: "Poinsettias, Holly, Winter Jasmine",
    flowers: ["🌺", "❄️", "🌸"],
    color: "from-blue-400 to-indigo-500",
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export function SeasonalFlowers() {
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
            Seasonal Flowers
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Discover beautiful blooms for every season of the year
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {seasons.map((season) => (
            <motion.div key={season.name} variants={itemVariants}>
              <Card className="group cursor-pointer h-full">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${season.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}
                  >
                    <season.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-emerald-900 group-hover:text-emerald-600 transition-colors">
                    {season.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex justify-center gap-2 text-4xl">
                    {season.flowers.map((flower, index) => (
                      <motion.span
                        key={index}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="inline-block"
                      >
                        {flower}
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-sm text-sage-600">{season.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
