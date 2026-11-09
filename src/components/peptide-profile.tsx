import Link from "next/link";
import { EditorialImage } from "./editorial-image";
import { peptideSectionTitles, type Peptide } from "@/lib/peptide-schema";
import { topicRegistry } from "@/lib/topic-registry";
import { editorialStatusLabels } from "@/lib/editorial-status";

type ProfileLink = { title: string; href: string };
export type PeptideProfileLinks = {
  products: ProfileLink[];
  comparisons: ProfileLink[];
  related: ProfileLink[];
};

// Pure presentation: editorial data and public-only relationships are supplied
// by the server. No draft registry is passed to a client component.
export function PeptideProfile({
  peptide: p,
  links,
}: {
  peptide: Peptide;
  links: PeptideProfileLinks;
}) {
  const primary = topicRegistry.find((topic) => topic.id === p.primaryTopicId)!;
  const references = (ids: string[]) =>
    ids.length > 0 && (
      <span className="peptide-citations">
        {" "}
        {ids.map((id) => {
          const index = p.sources.findIndex((source) => source.id === id);
          return (
            <a
              key={id}
              href={`#reference-${index + 1}`}
              aria-label={`Reference ${index + 1}`}
            >
              [{index + 1}]{" "}
            </a>
          );
        })}
      </span>
    );
  const paragraphs = (key: keyof Peptide["sections"]) =>
    p.sections[key].length > 0 && (
      <section id={key} key={key}>
        <h2>{peptideSectionTitles[key]}</h2>
        {p.sections[key].map((block, index) => (
          <p key={index}>
            {block.text}
            {references(block.sourceIds)}
          </p>
        ))}
      </section>
    );
  const linkList = (items: ProfileLink[]) => (
    <ul>
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href}>{item.title}</Link>
        </li>
      ))}
    </ul>
  );
  return (
    <article className="wrap library-page peptide-profile">
      <nav aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/peptides/">Peptides A–Z</Link>{" "}
        / <span aria-current="page">{p.name}</span>
      </nav>
      <header className="identify-intro">
        <span className="eyebrow">
          {primary.title} · {editorialStatusLabels[p.status]}
        </span>
        <h1>{p.name}</h1>
        {(p.additionalTopicIds.length > 0 || p.tags.length > 0) && (
          <div className="tags">
            {[
              ...p.additionalTopicIds.map(
                (id) => topicRegistry.find((t) => t.id === id)!.title,
              ),
              ...p.tags,
            ].map((tag) => (
              <span className="badge" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <EditorialImage
          image={p.images.find((image) => image.approval === "approved")}
        />
      </header>
      {paragraphs("overview")}
      {paragraphs("howItWorks")}
      {paragraphs("research")}
      {paragraphs("applications")}
      {(p.sections.safety.length > 0 || p.regulatoryRecords.length > 0) && (
        <section id="safety">
          <h2>{peptideSectionTitles.safety}</h2>
          {p.sections.safety.map((block, index) => (
            <p key={index}>
              {block.text}
              {references(block.sourceIds)}
            </p>
          ))}
          {p.regulatoryRecords.map((record, index) => (
            <div key={index}>
              <h3>
                {record.jurisdiction} · {record.preparation}
              </h3>
              <p>
                {record.statement}
                {references(record.sourceIds)}
              </p>
              <p>
                <time dateTime={record.checkedAt}>{record.checkedAt}</time>
              </p>
            </div>
          ))}
        </section>
      )}
      {(p.sections.products.length > 0 || links.products.length > 0) && (
        <section id="products">
          <h2>{peptideSectionTitles.products}</h2>
          {p.sections.products.map((block, i) => (
            <p key={i}>
              {block.text}
              {references(block.sourceIds)}
            </p>
          ))}
          {linkList(links.products)}
        </section>
      )}
      {(p.sections.comparisons.length > 0 || links.comparisons.length > 0) && (
        <section id="comparisons">
          <h2>{peptideSectionTitles.comparisons}</h2>
          {p.sections.comparisons.map((block, i) => (
            <p key={i}>
              {block.text}
              {references(block.sourceIds)}
            </p>
          ))}
          {linkList(links.comparisons)}
        </section>
      )}
      {p.faq.length > 0 && (
        <section id="faq">
          <h2>{peptideSectionTitles.faq}</h2>
          {p.faq.map((faq) => (
            <details className="reader-disclosure" key={faq.question}>
              <summary>{faq.question}</summary>
              <div className="reader-disclosure-body">
                <p>
                  {faq.answer.text}
                  {references(faq.answer.sourceIds)}
                </p>
              </div>
            </details>
          ))}
        </section>
      )}
      {p.sources.length > 0 && (
        <section id="sources">
          <h2>{peptideSectionTitles.sources}</h2>
          <ol>
            {p.sources.map((source, index) => (
              <li id={`reference-${index + 1}`} key={source.id}>
                <a href={source.url}>{source.title}</a> · {source.publisher} ·{" "}
                <time dateTime={source.accessedAt}>{source.accessedAt}</time>
              </li>
            ))}
          </ol>
        </section>
      )}
      {(p.updatedAt || p.reviewedAt || p.sections.methodology.length > 0) && (
        <section id="methodology">
          <h2>{peptideSectionTitles.methodology}</h2>
          {p.updatedAt && (
            <p>
              Last updated: <time dateTime={p.updatedAt}>{p.updatedAt}</time>
            </p>
          )}
          {p.reviewedAt && (
            <p>
              Last reviewed: <time dateTime={p.reviewedAt}>{p.reviewedAt}</time>
            </p>
          )}
          {p.sections.methodology.map((block, index) => (
            <p key={index}>
              {block.text}
              {references(block.sourceIds)}
            </p>
          ))}
        </section>
      )}
      {links.related.length > 0 && (
        <aside>
          <h2>Related reading</h2>
          {linkList(links.related)}
        </aside>
      )}
    </article>
  );
}
