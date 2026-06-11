"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const families = [
  {
    name: "Rosaceae",
    species: "3,000+",
    description: "The rose family, including roses, apples, cherries, and strawberries",
    color: "from-rose-400 to-pink-500",
  },
  {
    name: "Orchidaceae",
    species: "28,000+",
    description: "The orchid family, one of the largest families of flowering plants",
    color: "from-purple-400 to-violet-500",
  },
  {
    name: "Asteraceae",
    species: "32,000+",
    description: "The aster or daisy family, including sunflowers and daisies",
    color: "from-amber-400 to-yellow-500",
  },
  {
    name: "Liliaceae",
    species: "4,000+",
    description: "The lily family, including lilies, tulips, and hyacinths",
    color: "from-emerald-400 to-green-500",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export function FlowerFamilies() {
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
            Flower Families
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Explore the botanical taxonomy and discover flower families
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {families.map((family) => (
            <motion.div key={family.name} variants={itemVariants}>
              <Card className="group h-full">
                <CardHeader>
                  <div
                    className={`w-full h-32 rounded-xl bg-gradient-to-br ${family.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <span className="text-6xl">🌿</span>
                  </div>
                  <CardTitle className="text-2xl text-emerald-900">
                    {family.name}
                  </CardTitle>
                  <CardDescription className="text-emerald-600 font-medium">
                    {family.species} Species
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-sage-600">{family.description}</p>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-emerald-50 transition-colors">
                    Explore Family
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
