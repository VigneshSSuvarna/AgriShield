
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
    <section className="mt-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">

      <div className="flex flex-wrap items-center justify-between gap-3">

        <h2 className="text-xl font-bold text-emerald-900">
          Markdown Metric Report Card
        </h2>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isDemo
              ? 'bg-amber-100 text-amber-800'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {isDemo ? 'Sample Report' : 'Diagnosis Report'}
        </span>

      </div>

      <p className="mt-2 text-sm text-slate-500">
        Structured crop diagnosis information displayed using
        Markdown formatting.
      </p>

      {isDemo && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          This is sample diagnosis data for frontend testing.
          No AI prediction has been performed on the uploaded photograph.
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-slate-50 p-5 text-slate-700">

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h3 className="mb-4 text-2xl font-bold text-emerald-900">
                {children}
              </h3>
            ),

            h2: ({ children }) => (
              <h3 className="mb-3 mt-6 text-xl font-bold text-emerald-900 first:mt-0">
                {children}
              </h3>
            ),

            h3: ({ children }) => (
              <h4 className="mb-2 mt-4 text-lg font-semibold text-emerald-800">
                {children}
              </h4>
            ),

            p: ({ children }) => (
              <p className="mb-3 leading-7">
                {children}
              </p>
            ),

            ul: ({ children }) => (
              <ul className="mb-4 list-disc space-y-2 pl-6">
                {children}
              </ul>
            ),

            ol: ({ children }) => (
              <ol className="mb-4 list-decimal space-y-2 pl-6">
                {children}
              </ol>
            ),

            li: ({ children }) => (
              <li className="leading-6">
                {children}
              </li>
            ),

            strong: ({ children }) => (
              <strong className="font-bold text-slate-900">
                {children}
              </strong>
            ),

            blockquote: ({ children }) => (
              <blockquote className="my-4 border-l-4 border-emerald-500 bg-white p-4 italic">
                {children}
              </blockquote>
            ),

            table: ({ children }) => (
              <table className="mb-5 min-w-full border-collapse text-left text-sm">
                {children}
              </table>
            ),

            th: ({ children }) => (
              <th className="border border-slate-200 bg-emerald-100 px-4 py-3 font-semibold">
                {children}
              </th>
            ),

            td: ({ children }) => (
              <td className="border border-slate-200 px-4 py-3">
                {children}
              </td>
            ),

            code: ({ children }) => (
              <code className="rounded bg-slate-200 px-1 py-0.5 text-sm">
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
