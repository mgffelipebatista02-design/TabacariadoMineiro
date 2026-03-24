'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { categories } from '@/data/categories'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function CategoriesGrid() {
  return (
    <section className="bg-bg-secondary py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center font-display text-3xl font-bold text-text-primary md:text-4xl"
        >
          Categorias
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/catalogo/${category.slug}`}
                className={cn(
                  'group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[--radius-xl]',
                  'border border-border-default bg-bg-card p-6',
                  'transition-all hover:border-accent-amber hover:scale-[1.02]'
                )}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/40 to-transparent" />

                <div className="relative z-10">
                  <span className="inline-block rounded-[--radius-pill] bg-accent-amber/10 px-3 py-1 text-xs font-medium text-accent-amber">
                    {category.productCount} produtos
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold text-text-primary">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
