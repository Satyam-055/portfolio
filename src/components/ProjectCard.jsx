import { Link } from 'react-router-dom'

export default function ProjectCard({ id, title, tags, thumbnail }) {
  return (
    <Link
      to={`/project/${id}`}
      className="block w-full bg-[var(--bg-card)] rounded-2xl border border-[var(--border)]
        hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200 group"
    >
      <div className="h-[200px] rounded-xl m-2 overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="px-4 pb-4 pt-2">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-[16px] font-medium text-[var(--text-primary)] leading-snug">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-[12px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors shrink-0 mt-0.5">
            <span>View</span>
            <svg className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="h-6 inline-flex items-center px-2.5 rounded-md border border-[var(--border)] text-[11px] font-medium text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
