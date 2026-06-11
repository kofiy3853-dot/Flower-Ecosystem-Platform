"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Flower2, Leaf, Mail, Github, Twitter, Instagram } from "lucide-react"

const footerSections = [
  {
    title: "Explore",
    links: [
      { name: "Flowers", href: "/flowers" },
      { name: "Categories", href: "/categories" },
      { name: "Families", href: "/families" },
      { name: "Uses", href: "/uses" },
      { name: "Purposes", href: "/purposes" },
    ],
  },
  {
    title: "Learn",
    links: [
      { name: "Learning Center", href: "/learning" },
      { name: "Guides", href: "/guides" },
      { name: "Articles", href: "/articles" },
      { name: "Flower Meanings", href: "/meanings" },
      { name: "Care Tips", href: "/care" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { name: "Shop", href: "/shop" },
      { name: "Vendors", href: "/vendors" },
      { name: "Products", href: "/products" },
      { name: "Deals", href: "/deals" },
      { name: "Gift Cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Careers", href: "/careers" },
    ],
  },
]

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Mail, href: "#", label: "Email" },
]

export function Footer() {
  return (
    <footer className="bg-emerald-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <Flower2 className="h-8 w-8 text-emerald-300" />
                  <Leaf className="h-4 w-4 text-emerald-400 absolute -bottom-1 -right-1" />
                </div>
                <span className="text-xl font-bold">Flora</span>
              </div>
              <p className="text-emerald-200 mb-6 max-w-sm">
                Your premium botanical knowledge platform. Discover, learn, and explore the world of flowers.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center hover:bg-emerald-700 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 4 }}
                      className="text-emerald-200 hover:text-white transition-colors"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-emerald-800 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-emerald-300 text-sm">
            © {new Date().getFullYear()} Flora. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-emerald-300">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
