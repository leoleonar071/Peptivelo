import { site } from "./config";

export const pages: Record<
  string,
  { title: string; intro: string; sections: { title: string; text: string }[] }
> = {
  methodology: {
    title: "Our methodology",
    intro:
      "Clear comparisons begin with knowing exactly what is being compared.",
    sections: [
      {
        title: "1. Record the source",
        text: "We document manufacturer label facts, their source URL, and the date consulted. A source check is not independent laboratory verification or clinical review.",
      },
      {
        title: "2. Preserve exact ingredient names",
        text: "Selected label ingredients are compared by exact name, ignoring letter case. We do not merge synonyms, infer concentrations from ingredient order, or treat incomplete lists as complete formulas.",
      },
      {
        title: "3. Normalize the price",
        text: "Cost per mL equals recorded USD price divided by volume in mL. One US fluid ounce equals 29.5735295625 mL. Tax, shipping, promotions and personal discounts are excluded. Observations are dated snapshots, not live offers. Price observations older than 30 days need rechecking before a purchase decision.",
      },
      {
        title: "4. Make uncertainty visible",
        text: "Missing prices, undisclosed concentrations, incomplete labels and absent head-to-head outcomes are explicitly labeled. Lower cost does not establish greater effectiveness. Editorial comparisons remain draft until a human editor has reviewed the specific analysis.",
      },
      {
        title: "5. Publish deliberately",
        text: "Source-backed factual label profiles may be published. Scientific or medical claims require qualified human review and primary research. Drafts, interactive comparisons and internal search are excluded from indexing. No automatic product ratings are used.",
      },
      {
        title: "6. Match each claim to the right evidence",
        text: "Our numbered-reference pilot covers two label guides and the NIOD/The Ordinary copper comparison. References identify label facts, supplier information and human ingredient research separately. Editorial interpretation and illustrative arithmetic are labeled. A study on an ingredient is not automatically a study on a retail product. A reference number is not a quality score.",
      },
      {
        title: "7. Evaluate relevance and study limits",
        text: "For academic sources, record authors, year, journal, DOI, study design, population, duration, reported outcome, relevance to the exact formula, funding and declared conflicts where available. State whether we inspected only an abstract or the full paper. Do not infer missing concentrations, safety rates or results. Check publisher corrections/retractions; disclose the scope of that check. Peer review alone does not establish sufficient evidence, independence or reproducibility. This pilot is not a systematic review or a clinical recommendation, and qualified scientific review is pending.",
      },
      {
        title: "8. Keep commercial interests and corrections visible",
        text: "Manufacturer and supplier pages have a commercial interest. Funding and conflict statements from papers are author declarations, not independently audited facts. No affiliate partnerships are active; future compensation must be disclosed and must not alter conclusions. Reference-check dates, price observations and actual human review dates are separate. No author, credentials or reviewer approval is invented. To suggest a correction, use Contact and identify the page, disputed statement, market/variant and primary source; its availability is shown there.",
      },
    ],
  },
  "editorial-policy": {
    title: "Editorial policy",
    intro: "Evidence, attribution, and visible limitations guide every record.",
    sections: [
      {
        title: "Label facts and evidence are different",
        text: "A manufacturer is a primary source for its own label and disclosed price. Its marketing claims are not independent evidence of efficacy. This initial catalog makes no comparative efficacy claims and has not undergone clinical review.",
      },
      {
        title: "Updates and corrections",
        text: "Source checks use actual consultation dates. No reviewer identity or review date is invented. Before publication, check the US variant, size, ingredient label and source trail. Reformulations are treated as changes rather than silently replacing historical facts.",
      },
      {
        title: "Independence",
        text: "Commercial relationships must not determine comparison conclusions or listing order. Compensation must be disclosed close to relevant links. No affiliate agreements are active in this MVP.",
      },
    ],
  },
  about: {
    title: "A little more clarity.",
    intro: `${site.name} organizes peptide skincare information so the details are easier to compare.`,
    sections: [
      {
        title: "Starting with skincare",
        text: "Our first collection focuses on cosmetic facial serums available through US brand websites. We bring together selected ingredient labels, disclosed information and dated price observations in one place.",
      },
      {
        title: "A considered beginning",
        text: "This is an early product with a deliberately small catalog. It is not a medical service, store, or testing laboratory. The provisional brand name has not been cleared for domain or trademark availability.",
      },
      {
        title: "Who operates this site",
        text: site.operator
          ? `This site is operated by ${site.operator}. Use the contact page for questions or corrections.`
          : "Operator details have not yet been supplied for this preview. A public contact and operator identity are required before launch.",
      },
    ],
  },
  "affiliate-disclosure": {
    title: "Affiliate disclosure",
    intro: `There are currently no active affiliate relationships on ${site.name}.`,
    sections: [
      {
        title: "Manufacturer links",
        text: "Links in the current catalog go directly to manufacturer pages. We receive no commission from these links. A recorded price is not a guaranteed offer or statement of current stock.",
      },
      {
        title: "Future compensated links",
        text: 'If affiliate programs are approved, affected pages must clearly state “We may earn a commission when you purchase through links on this page” close to those links. Compensated links must carry rel="sponsored". Editorial conclusions must remain independent.',
      },
    ],
  },
  privacy: {
    title: "Privacy policy",
    intro:
      "You can use these tools without an account. Newsletter subscriptions are not collected.",
    sections: [
      {
        title: "Data used by the tools",
        text: "Calculations and filter selections are processed in your browser. Shared calculation URLs include the product names, prices and volumes you enter. Do not put personal or sensitive information in those fields. The browser clipboard is used only when you choose to share.",
      },
      {
        title: "Analytics and hosting",
        text: "No third-party analytics provider, advertising cookie, or tracking identifier is enabled. The event adapter dispatches browser-local events for future consent-aware integration. A future hosting provider may process technical request logs; its identity, retention and applicable privacy terms must be documented before public launch.",
      },
      {
        title: "Hosting provider",
        text: site.hostingProvider
          ? `Requests are handled by ${site.hostingProvider}. Technical log retention and processing details still need to be documented and reviewed before public launch.`
          : "A public hosting provider has not yet been selected. Hosting, technical log retention and processing details must be documented before public launch.",
      },
      {
        title: "External websites",
        text: "Manufacturer links open external sites with their own policies. No personal data is sent by this application’s analytics adapter.",
      },
      {
        title: "Launch review",
        text: "The site owner must supply a privacy contact, identify the operating entity and hosting provider, and review applicable requirements before public deployment.",
      },
    ],
  },
  terms: {
    title: "Terms of use",
    intro:
      "Use these tools to understand documented cosmetic information and perform your own price calculations.",
    sections: [
      {
        title: "Information and limitations",
        text: "Information is educational and provided without a guarantee of completeness, current pricing or fitness for a particular purpose. It does not diagnose, prevent or treat disease. Ingredient overlap does not establish clinical equivalence. Check the actual package and retailer before buying.",
      },
      {
        title: "Scope",
        text: "This site does not sell products, process payments, prescribe medication, or provide experimental peptide protocols. No results or search rankings are guaranteed.",
      },
      {
        title: "Before public launch",
        text: "These are preliminary MVP terms. The operator must identify its legal entity, contact details and applicable jurisdiction and obtain appropriate legal review before publishing a commercial service.",
      },
    ],
  },
  contact: {
    title: "Contact & corrections",
    intro: "A useful atlas should be open to correction.",
    sections: [
      {
        title: "What to include in a correction",
        text: "Identify the product, market, exact package size, the field that needs changing, and a primary source URL. Do not include personal medical information.",
      },
      {
        title: "Contact availability",
        text: site.contact
          ? "Use the email address below for questions and source-backed corrections. Do not send personal medical information."
          : "A public contact channel has not yet been configured for this preview. No message form is available.",
      },
    ],
  },
};
