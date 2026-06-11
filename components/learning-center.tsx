"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { BookOpen, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const articles = [
  {
    title: "Understanding Flower Families",
    description: "Learn about the botanical classification and taxonomy of flowers",
    readTime: "8 min read",
    category: "Classification",
    color: "from-emerald-400 to-green-500",
  },
  {
    title: "Flower Classification Guide",
    description: "A comprehensive guide to understanding flower categories and types",
    readTime: "12 min read",
    category: "Guide",
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Natural vs Artificial Flowers",
    description: "Discover the differences and benefits of natural and artificial blooms",
    readTime: "6 min read",
    category: "Comparison",
    color: "from-purple-400 to-violet-500",
  },
  {
    title: "Flower Care Guide",
    description: "Essential tips for keeping your flowers fresh and healthy",
    readTime: "10 min read",
    category: "Care",
    color: "from-pink-400 to-rose-500",
  },
  {
    title: "Flower Meanings Explained",
    description: "Explore the symbolic meanings and language of flowers",
    readTime: "15 min read",
    category: "Symbolism",
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "Growing Flowers Indoors",
    description: "Tips and tricks for successful indoor flower gardening",
    readTime: "9 min read",
    category: "Gardening",
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

export function LearningCenter() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            Learning Center
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Educational Resources
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Expand your knowledge with our comprehensive flower guides and articles
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {articles.map((article) => (
            <motion.div key={article.title} variants={itemVariants}>
              <Card className="group cursor-pointer h-full">
                <CardHeader>
                  <div
                    className={`w-full h-40 rounded-xl bg-gradient-to-br ${article.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-sage-500">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-emerald-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-sage-600 line-clamp-2">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="group-hover:bg-emerald-50 transition-colors w-full">
                    Read Article
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
