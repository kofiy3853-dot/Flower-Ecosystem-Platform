"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart, Leaf, Sprout, Sun, Flower2, Star, Home, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const categories = [
  {
    icon: Heart,
    name: "Wedding Flowers",
    description: "Perfect blooms for your special day",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: Leaf,
    name: "Medicinal Flowers",
    description: "Healing properties and natural remedies",
    color: "from-emerald-400 to-green-500",
  },
  {
    icon: Home,
    name: "Indoor Flowers",
    description: "Bring nature inside your home",
    color: "from-teal-400 to-cyan-500",
  },
  {
    icon: Sun,
    name: "Outdoor Flowers",
    description: "Garden beauties for outdoor spaces",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Flower2,
    name: "Tropical Flowers",
    description: "Exotic blooms from warm climates",
    color: "from-purple-400 to-violet-500",
  },
  {
    icon: Star,
    name: "Rare Flowers",
    description: "Unique and uncommon species",
    color: "from-indigo-400 to-blue-500",
  },
  {
    icon: Sprout,
    name: "Garden Flowers",
    description: "Popular choices for gardens",
    color: "from-lime-400 to-green-500",
  },
  {
    icon: Calendar,
    name: "Seasonal Flowers",
    description: "Blooms by season and time",
    color: "from-sky-400 to-blue-500",
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

export function Categories() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Explore Flower Categories
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Discover flowers organized by their unique characteristics and uses
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div key={category.name} variants={itemVariants}>
              <Card className="group cursor-pointer h-full">
                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-emerald-900 group-hover:text-emerald-600 transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-sage-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
