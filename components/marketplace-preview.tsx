"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const categories = [
  {
    name: "Fresh Flowers",
    description: "Beautiful cut flowers for arrangements",
    icon: "🌸",
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "Bouquets",
    description: "Expertly arranged flower bouquets",
    icon: "💐",
    color: "from-purple-400 to-violet-500",
  },
  {
    name: "Seeds",
    description: "Grow your own flowers from seeds",
    icon: "🌱",
    color: "from-emerald-400 to-green-500",
  },
  {
    name: "Artificial Flowers",
    description: "Long-lasting artificial blooms",
    icon: "🌺",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Potted Plants",
    description: "Living plants in decorative pots",
    icon: "🪴",
    color: "from-teal-400 to-cyan-500",
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

export function MarketplacePreview() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            <ShoppingBag className="h-4 w-4" />
            Marketplace
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Shop Flowers & Products
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Browse our curated marketplace for flowers and flower-related products
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <Card className="group cursor-pointer h-full text-center">
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg text-emerald-900 group-hover:text-emerald-600 transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-sage-600">{category.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button size="lg" className="group">
            Visit Marketplace
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
