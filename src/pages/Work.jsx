import { motion } from 'framer-motion'
import HeroSection from '../components/HeroSection'
import ProjectCard from '../components/ProjectCard'
import projects from '../data/projects'

export default function Work() {
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

      {/* Project Grid — 3 per row */}
      <div className="max-w-5xl mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
