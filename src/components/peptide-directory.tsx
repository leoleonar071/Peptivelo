"use client";
import { useState } from "react";
import { topics } from "@/lib/site-navigation";
import { type ContentEntry } from "@/lib/content-navigation";
import { ContentCards } from "./discovery";
import { entriesForTopic, isPublicTopicEntry } from "@/lib/content-topics";
import type { TopicId } from "@/lib/topic-registry";
export function PeptideDirectory({ entries }: { entries: ContentEntry[] }) {
  const [topic, setTopic] = useState("all");
  const filtered =
    topic === "all"
      ? entries.filter(isPublicTopicEntry)
      : entriesForTopic(entries, topic as TopicId);
  return (
    <>
      <div className="directory-controls">
        <label htmlFor="directory-topic">Filter by topic</label>
        <select
          id="directory-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="all">All topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        <p role="status">{filtered.length} entries</p>
      </div>
      <ContentCards entries={filtered} />
    </>
  );
}
