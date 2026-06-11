"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Palette, Pill, Droplets, Utensils, Church, Trees } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const uses = [
  {
    icon: Palette,
    name: "Decorative",
    description: "Beautiful blooms for arrangements and displays",
    color: "from-pink-400 to-rose-500",
  },
  {
    icon: Pill,
    name: "Medicinal",
    description: "Healing properties and natural remedies",
    color: "from-emerald-400 to-green-500",
  },
  {
    icon: Droplets,
    name: "Aromatic",
    description: "Fragrant flowers for perfumes and oils",
    color: "from-purple-400 to-violet-500",
  },
  {
    icon: Utensils,
    name: "Edible",
    description: "Safe to eat and use in cooking",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Church,
    name: "Religious",
    description: "Sacred flowers for ceremonies",
    color: "from-sky-400 to-blue-500",
  },
  {
    icon: Trees,
    name: "Landscaping",
    description: "Perfect for gardens and outdoor spaces",
    color: "from-lime-400 to-green-500",
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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function ExploreUses() {
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
            Explore by Uses
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Discover how flowers can enhance different aspects of life
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {uses.map((use) => (
            <motion.div key={use.name} variants={itemVariants}>
              <Card className="group cursor-pointer h-full hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${use.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}
                  >
                    <use.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-emerald-900 group-hover:text-emerald-600 transition-colors">
                    {use.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sage-600">{use.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
