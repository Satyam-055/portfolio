import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import HeroSection from '../components/HeroSection'
import ProjectCard from '../components/ProjectCard'
import ProcessSection from '../components/ProcessSection'
import projects from '../data/projects'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Work() {
  usePageMeta({})
  const restoredRef = useRef(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('work-scroll')
    if (saved && !restoredRef.current) {
      restoredRef.current = true
      requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)))
    }
    return () => {
      sessionStorage.setItem('work-scroll', String(window.scrollY))
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen pb-28"
    >
      <HeroSection />

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-8 lg:px-16">
        <div className="border-t border-[var(--border)]" />
      </div>

      {/* Section label */}
      <div className="max-w-5xl mx-auto px-8 lg:px-16 pt-10 pb-6">
        <span
          className="text-[14px] italic text-[var(--text-muted)]"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          Selected work
        </span>
      </div>

      {/* Project Grid  -  3 per row */}
      <div className="max-w-5xl mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <ProjectCard key={p.id} id={p.id} title={p.title} tags={p.tags} thumbnail={p.thumbnail} />
          ))}
        </div>
      </div>

      <ProcessSection />
    </motion.div>
  )
}
