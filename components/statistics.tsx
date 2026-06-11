"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Flower2, BookOpen, Users, Sprout } from "lucide-react"

const stats = [
  {
    icon: Flower2,
    value: "10,000+",
    label: "Flowers",
    description: "Unique flower species documented",
  },
  {
    icon: Sprout,
    value: "500+",
    label: "Families",
    description: "Botanical flower families",
  },
  {
    icon: BookOpen,
    value: "2,000+",
    label: "Articles",
    description: "Educational resources and guides",
  },
  {
    icon: Users,
    value: "100,000+",
    label: "Users",
    description: "Flower enthusiasts worldwide",
  },
]

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-forest-500 mb-4">
          <stat.icon className="h-8 w-8 text-white" />
        </div>
        <motion.h3
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
          className="text-4xl md:text-5xl font-bold text-gradient mb-2"
        >
          {stat.value}
        </motion.h3>
        <p className="text-xl font-semibold text-emerald-900 mb-2">{stat.label}</p>
        <p className="text-sm text-sage-600">{stat.description}</p>
      </div>
    </motion.div>
  )
}

export function Statistics() {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-mint-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Our Impact
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Join a growing community of flower enthusiasts and explore our comprehensive database
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
