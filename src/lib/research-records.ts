import "server-only";
import { z } from "zod";
import rawRecords from "../data/research-records.json";
import rawExtractions from "../data/study-extractions.json";
import { catalog } from "./data";

export const researchRecords = z
  .array(
    z.object({
      documentId: z.string(),
      question: z.string(),
      selectionScope: z.string(),
      searches: z.array(
        z.object({
          date: z.iso.date(),
          method: z.string(),
          query: z.string(),
          limitation: z.string(),
        }),
      ),
      sources: z.array(
        z.object({
          sourceId: z.string(),
          state: z.enum([
            "abstract-read",
            "sections-read",
            "identified-not-read",
            "not-searched",
          ]),
          reason: z.string(),
        }),
      ),
      pending: z.array(z.string()),
      candidates: z.array(
        z.object({
          title: z.string(),
          url: z.url(),
          state: z.literal("identified-not-read"),
          reason: z.string(),
        }),
      ),
    }),
  )
  .parse(rawRecords);
export const studyExtractions = z
  .array(
    z.object({
      sourceId: z.string(),
      design: z.string(),
      population: z.string(),
      duration: z.string(),
      outcome: z.string(),
      reportedFinding: z.string(),
      magnitude: z.string(),
      uncertainty: z.string(),
      interpretation: z.string(),
      access: z.string(),
      extractedAt: z.iso.date(),
      humanReview: z.literal("pending"),
    }),
  )
  .parse(rawExtractions);
for (const id of [
  ...researchRecords.flatMap((record) => record.sources.map((s) => s.sourceId)),
  ...studyExtractions.map((s) => s.sourceId),
])
  if (!catalog.sources.some((source) => source.id === id))
    throw new Error(`Unknown research-record source: ${id}`);
