"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { topics } from "@/lib/site-navigation";
import type { ContentEntry } from "@/lib/content-navigation";
import { ContentCards } from "./discovery";
import { entriesForTopic, isPublicTopicEntry } from "@/lib/content-topics";
import type { TopicId } from "@/lib/topic-registry";
import { matchesDirectoryName } from "@/lib/directory-search";
import { ShareDiscovery } from "./share-discovery";

// Intent: preserve a reader's topic and reading format in a shareable URL.
// Shared paper/ink tokens, native accessible controls, Manrope/Inter, 4px grid.
export function PeptideDirectory({
  entries,
  topic = "all",
  format = "all",
  qname = "",
}: {
  entries: ContentEntry[];
  topic?: string;
  format?: string;
  qname?: string;
}) {
  const router = useRouter();
  const formats = [...new Set(entries.map((entry) => entry.format))];
  const selectedTopic = topics.some((item) => item.id === topic)
    ? topic
    : "all";
  const selectedFormat = formats.includes(format as ContentEntry["format"])
    ? format
    : "all";
  const available =
    selectedTopic === "all"
      ? entries.filter(isPublicTopicEntry)
      : entriesForTopic(entries, selectedTopic as TopicId);
  const filtered = available.filter(
    (entry) =>
      (selectedFormat === "all" || entry.format === selectedFormat) &&
      matchesDirectoryName(entry, qname),
  );
  const returnTo =
    "/peptides/?" +
    new URLSearchParams({
      topic: selectedTopic,
      format: selectedFormat,
      ...(qname ? { qname } : {}),
    });
  return (
    <>
      <form
        className="directory-controls"
        action="/peptides/"
        method="get"
        key={returnTo}
        onChange={(event) => {
          if (event.target instanceof HTMLSelectElement)
            event.currentTarget.requestSubmit();
        }}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          router.push(
            "/peptides/?" +
              new URLSearchParams({
                topic: String(data.get("topic")),
                format: String(data.get("format")),
                qname: String(data.get("qname") ?? "")
                  .trim()
                  .slice(0, 200),
              }),
            { scroll: false },
          );
        }}
      >
        <div className="directory-field directory-name">
          <label htmlFor="directory-name">Find by name</label>
          <input
            id="directory-name"
            name="qname"
            type="search"
            maxLength={200}
            defaultValue={qname}
            placeholder="Name or documented alias"
          />
        </div>
        <div className="directory-field">
          <label htmlFor="directory-topic">Filter by topic</label>
          <select
            id="directory-topic"
            name="topic"
            defaultValue={selectedTopic}
          >
            <option value="all">All topics</option>
            {topics.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <div className="directory-field">
          <label htmlFor="directory-format">Reading format</label>
          <select
            id="directory-format"
            name="format"
            defaultValue={selectedFormat}
          >
            <option value="all">All formats</option>
            {formats.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <button className="button secondary" type="submit">
          Apply filters
        </button>
        <p role="status">{filtered.length} entries</p>
      </form>
      <div className="directory-share">
        <ShareDiscovery href={returnTo} />
      </div>
      {filtered.length ? (
        <ContentCards entries={filtered} returnTo={returnTo} />
      ) : (
        <div className="search-empty">
          <h2>No entries in this selection yet.</h2>
          <p>
            No recorded names match this combination. Try another name, topic or
            format; this does not mean the peptide does not exist.
          </p>
          <Link className="text-link" href="/peptides/">
            Reset filters →
          </Link>
        </div>
      )}
    </>
  );
}
