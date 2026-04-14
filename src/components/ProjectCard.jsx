import { useNavigate } from 'react-router-dom'

function PreviewContent({ type, color }) {
  if (type === 'bars') {
    return (
      <div className="flex items-end gap-2 h-full p-5">
        {[40, 65, 50, 80, 55, 70, 45].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm opacity-40"
            style={{
              height: `${h}%`,
              backgroundColor: color === '#CEF8E0' ? '#22c55e' : color === '#FFF3D6' ? '#f59e0b' : '#6366f1',
            }}
          />
        ))}
      </div>
    )
  }
  if (type === 'chart') {
    return (
      <div className="flex items-center justify-center h-full p-5">
        <div
          className="w-20 h-20 rounded-full border-8 opacity-30"
          style={{
            borderColor: color === '#D6ECFF' ? '#3b82f6' : '#14b8a6',
            borderTopColor: 'transparent',
          }}
        />
        <div
          className="w-14 h-14 rounded-full border-6 opacity-20 -ml-4"
          style={{
            borderColor: color === '#D6ECFF' ? '#93c5fd' : '#5eead4',
            borderBottomColor: 'transparent',
          }}
        />
      </div>
    )
  }
  if (type === 'cards') {
    return (
      <div className="flex flex-col gap-2.5 p-5 h-full justify-center">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="rounded-lg h-7 opacity-25"
            style={{
              backgroundColor: color === '#E8DBFA' ? '#8b5cf6' : '#a78bfa',
              width: `${100 - n * 12}%`,
            }}
          />
        ))}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2.5 p-5 h-full justify-center">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="flex items-center gap-2.5">
          <div
            className="w-3.5 h-3.5 rounded-full opacity-30"
            style={{
              backgroundColor: color === '#FFE0E0' ? '#ef4444' : '#3b82f6',
            }}
          />
          <div
            className="h-3 rounded opacity-20 flex-1"
            style={{
              backgroundColor: color === '#FFE0E0' ? '#ef4444' : '#3b82f6',
              maxWidth: `${80 - n * 10}%`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default function ProjectCard({
  id,
  title,
  tags,
  previewColor,
  previewType,
}) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/project/${id}`)}
      className="w-full bg-[var(--bg-card)] rounded-2xl cursor-pointer border border-[var(--border)]
        hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200 group"
    >
      {/* Preview */}
      <div
        className="h-[200px] rounded-xl m-2"
        style={{ backgroundColor: previewColor }}
      >
        <PreviewContent type={previewType} color={previewColor} />
      </div>

      {/* Info */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-[16px] font-medium text-[var(--text-primary)] leading-snug">
            {title}
          </h3>
          {/* View arrow */}
          <div className="flex items-center gap-1 text-[12px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors shrink-0 mt-0.5">
            <span>View</span>
            <svg className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Tags */}
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
    </div>
  )
}
