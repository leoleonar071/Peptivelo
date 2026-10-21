// Extraction from the evidence records checked on 2026-10-19.
// Assessments have no single trial population or follow-up period.
export const studyData = [
  {
    sourceId: "argireline-trial",
    sample:
      "60 Chinese participants; randomized placebo-controlled ingredient study (3:1 allocation).",
    duration: "4 weeks",
    scope:
      "Ingredient evidence; neither retail serum was identified as the tested product.",
  },
  {
    sourceId: "kraeling-penetration",
    sample:
      "Human cadaver and hairless guinea pig skin in a laboratory diffusion model; no living human participants.",
    duration: "24 hours",
    scope:
      "Penetration under the tested conditions; not a clinical benefit or safety trial.",
  },
  {
    sourceId: "phenoxyethanol-cases",
    sample:
      "2 individual case reports involving other cosmetics; no comparison group.",
    duration: "Follow-up duration not recorded in the inspected summary",
    scope:
      "An allergy signal, not an estimate of how often reactions occur in either serum.",
  },
  {
    sourceId: "sccs-phenoxyethanol",
    sample:
      "Regulatory assessment of multiple evidence sources; not one trial cohort.",
    duration: "Not applicable — evidence assessment",
    scope:
      "Preservative use up to 1% under the assessed conditions; not approval of these finished products.",
  },
  {
    sourceId: "cir-peptides",
    sample:
      "Expert assessment of specified peptide identities and uses; not one trial cohort.",
    duration: "Not applicable — evidence assessment",
    scope:
      "Limited to the identities, uses and concentrations reviewed; not proof of years of finished-formula safety.",
  },
];

export function studyDataFor(comparisonId: string) {
  const acetylSafety = {
    sourceId: "cir-acetyl",
    sample: "Expert assessment of Acetyl Hexapeptide-8 cosmetic use, not a product trial.",
    duration: "Not applicable — evidence assessment",
    scope: "Favorable conclusion up to 0.005%; insufficient data above that amount. Unknown pure-peptide amounts prevent a finished-serum safety conclusion.",
  };
  if (comparisonId === "niod-vs-ordinary") return [...studyData, acetylSafety];
  if (comparisonId === "ordinary-ha-vs-copper") return [
    ...studyData.filter((row) => ["argireline-trial", "cir-peptides"].includes(row.sourceId)),
    acetylSafety,
  ];
  if (comparisonId === "ptiox-vs-ha")
    return [
      {
        sourceId: "ptiox-zhu-2026",
        sample:
          "Separate clinical groups: 50 static-wrinkle and 42 dynamic-wrinkle participants, plus ex vivo skin work. Not assumed to be 92 unique participants.",
        duration:
          "12 weeks reported for static outcomes; dynamic follow-up not extracted",
        scope:
          "Multi-ingredient formula; detailed clinical control methods not verified from abstract. Not an isolated peptide or retail head-to-head test.",
      },
      {
        sourceId: "ptiox-adjunct-2026",
        sample:
          "Randomized split-face vehicle comparison around injections; sample size not extracted in this check.",
        duration: "10 weeks",
        scope:
          "Adjunct setting, not proof that the serum replaces injections. SkinCeuticals-linked research.",
      },
    ];
  return [];
}
