import { Fragment, type ReactElement } from "react"
import type { CompanyExportBlock } from "experience-sync/lib/linkedin"
import { parseMarkdownSegments } from "experience-sync/lib/markdown"

function renderMarkdownLine(line: string, keyPrefix: string): ReactElement {
  return (
    <>
      {parseMarkdownSegments(line).map((segment, segmentIndex) =>
        segment.type === "link" ? (
          <a key={`${keyPrefix}-${segmentIndex}`} href={segment.href} target="_blank" rel="noopener noreferrer">
            {segment.text}
          </a>
        ) : (
          <Fragment key={`${keyPrefix}-${segmentIndex}`}>{segment.value}</Fragment>
        ),
      )}
    </>
  )
}

function renderBulletLines(bullets: string[], keyPrefix: string): ReactElement {
  return (
    <>
      {bullets.flatMap((bullet, bulletIndex) => {
        const lines = bullet.split("\n")
        return lines.map((line, lineIndex) => (
          <Fragment key={`${keyPrefix}-${bulletIndex}-${lineIndex}`}>
            {(bulletIndex > 0 || lineIndex > 0) && "\n"}
            {renderMarkdownLine(line, `${keyPrefix}-${bulletIndex}-${lineIndex}`)}
          </Fragment>
        ))
      })}
    </>
  )
}

/** LinkedIn export preview with styled role titles. */
export function LinkedInExportPreviewContent({ block }: { block: CompanyExportBlock }): ReactElement {
  return (
    <>
      {block.roles.map((role, roleIndex) => (
        <Fragment key={roleIndex}>
          {roleIndex > 0 && "\n\n"}
          <span className="preview-position">{role.position}</span>
          {"\n"}
          {role.metaLine}
          {"\n"}
          {role.dates}
          {"\n\n"}
          {renderBulletLines(role.bullets, `linkedin-${roleIndex}`)}
        </Fragment>
      ))}
    </>
  )
}

/** Resume export preview with styled company and role headings. */
export function ResumeExportPreviewContent({ block }: { block: CompanyExportBlock }): ReactElement {
  return (
    <>
      <span className="preview-company-heading">
        {block.companyName} — {block.location}
      </span>
      {block.roles.map((role, roleIndex) => (
        <Fragment key={roleIndex}>
          {"\n\n"}
          <span className="preview-position">{role.position}</span>
          {"\n"}
          <em className="preview-role-dates">{role.dates}</em>
          {"\n\n"}
          {renderBulletLines(role.bullets, `resume-${roleIndex}`)}
        </Fragment>
      ))}
    </>
  )
}
