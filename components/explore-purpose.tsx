"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart, Ring, PartyPopper, HeartHandshake, Sparkles, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const purposes = [
  {
    icon: Heart,
    name: "Love",
    description: "Flowers that express love and affection",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: Ring,
    name: "Wedding",
    description: "Perfect blooms for ceremonies",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: PartyPopper,
    name: "Celebration",
    description: "Joyful flowers for special moments",
    color: "from-yellow-400 to-amber-500",
  },
  {
    icon: HeartHandshake,
    name: "Sympathy",
    description: "Comforting flowers for difficult times",
    color: "from-slate-400 to-gray-500",
  },
  {
    icon: Sparkles,
    name: "Healing",
    description: "Therapeutic and medicinal blooms",
    color: "from-emerald-400 to-green-500",
  },
  {
    icon: Users,
    name: "Friendship",
    description: "Flowers that celebrate bonds",
    color: "from-purple-400 to-violet-500",
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

export function ExplorePurpose() {
  return (
    <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Explore by Purpose
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Find the perfect flowers for every occasion and sentiment
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {purposes.map((purpose) => (
            <motion.div key={purpose.name} variants={itemVariants}>
              <Card className="group cursor-pointer h-full text-center">
                <CardHeader>
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${purpose.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                  >
                    <purpose.icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-emerald-900 group-hover:text-emerald-600 transition-colors">
                    {purpose.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sage-600">{purpose.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
