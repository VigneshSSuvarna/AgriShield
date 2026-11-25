import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function MarkdownReport({
  markdown = '',
  isDemo = false,
}) {
  const reportContent =
    typeof markdown === 'string' && markdown.trim()
      ? markdown
      : 'No diagnosis report is available.'

  return (
    <section className="mt-8 rounded-lg border border-rule bg-card p-5 sm:p-8">

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">

        <div>
          <h2 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
            Markdown Metric Report Card
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Structured crop diagnosis information displayed using
            Markdown formatting.
          </p>
        </div>

        <span
          className={`rounded border px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wider ${
            isDemo
              ? 'border-caution/30 bg-caution-soft text-caution'
              : 'border-healthy/30 bg-healthy-soft text-healthy'
          }`}
        >
          {isDemo ? 'Sample Report' : 'Diagnosis Report'}
        </span>

      </div>

      {isDemo && (
        <div className="mt-5 rounded border border-caution/30 bg-caution-soft px-4 py-3 text-sm text-ink">
          This is sample diagnosis data for frontend testing.
          No AI prediction has been performed on the uploaded photograph.
        </div>
      )}

      <div className="mt-6 overflow-x-auto text-ink">

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h3 className="mb-4 font-serif text-2xl font-semibold text-ink">
                {children}
              </h3>
            ),

            h2: ({ children }) => (
              <h3 className="mb-3 mt-7 border-b border-rule pb-2 font-serif text-xl font-semibold text-ink first:mt-0">
                {children}
              </h3>
            ),

            h3: ({ children }) => (
              <h4 className="mb-2 mt-5 font-serif text-lg font-medium text-ink">
                {children}
              </h4>
            ),

            p: ({ children }) => (
              <p className="mb-3.5 leading-7 text-ink-muted">
                {children}
              </p>
            ),

            ul: ({ children }) => (
              <ul className="mb-4 list-disc space-y-1.5 pl-6 text-ink-muted marker:text-accent">
                {children}
              </ul>
            ),

            ol: ({ children }) => (
              <ol className="mb-4 list-decimal space-y-1.5 pl-6 text-ink-muted marker:font-mono marker:text-ink">
                {children}
              </ol>
            ),

            li: ({ children }) => (
              <li className="leading-relaxed">
                {children}
              </li>
            ),

            strong: ({ children }) => (
              <strong className="font-semibold text-ink">
                {children}
              </strong>
            ),

            blockquote: ({ children }) => (
              <blockquote className="my-4 border-l-2 border-accent bg-paper-alt/60 px-4 py-3 italic text-ink-muted">
                {children}
              </blockquote>
            ),

            table: ({ children }) => (
              <div className="mb-5 overflow-x-auto rounded border border-rule">
                <table className="min-w-full border-collapse text-left text-sm">
                  {children}
                </table>
              </div>
            ),

            th: ({ children }) => (
              <th className="border-b border-rule bg-paper-alt px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                {children}
              </th>
            ),

            td: ({ children }) => (
              <td className="border-t border-rule px-4 py-2.5 text-ink-muted">
                {children}
              </td>
            ),

            code: ({ children }) => (
              <code className="rounded border border-rule bg-paper-alt px-1.5 py-0.5 font-mono text-xs text-ink">
                {children}
              </code>
            ),
          }}
        >
          {reportContent}
        </ReactMarkdown>

      </div>

    </section>
  )
}

export default MarkdownReport
