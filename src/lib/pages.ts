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
        text: "This is a public beta with a deliberately small catalog. It is not a medical service, store, or testing laboratory. Source checks document what a source says; they do not establish clinical approval or independent product testing.",
      },
      {
        title: "Who operates this site",
        text: site.operator
          ? `This site is operated by ${site.operator}. Use the contact page for questions or corrections.`
          : "The operator has not yet supplied a public name. Operator identity and a working contact channel remain outstanding for this public beta.",
      },
    ],
  },
  "affiliate-disclosure": {
    title: "Affiliate disclosure",
    intro: `There are currently no active affiliate relationships on ${site.name}.`,
    sections: [
      {
        title: "Manufacturer and store links",
        text: "Current catalog and offer links go to manufacturers and stores. We receive no commission from these ordinary links. A recorded price is not a guaranteed offer or statement of current stock. Stores handle purchases, delivery and order support; Peptivelo does not fulfil orders.",
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
        text: "Calculations and filter interactions are processed in your browser. Searches and other shared page URLs can be sent to the hosting provider when you load or navigate to them. Shared calculation URLs contain the product names, prices and volumes you enter. Do not put personal or sensitive information in search or calculator fields. The share action uses the browser clipboard only when you request it.",
      },
      {
        title: "Theme preference",
        text: "When you change the theme, your browser stores the light or dark preference in local storage under pv-theme. This is a display preference, not an analytics identifier. You can remove it through your browser's site-data controls.",
      },
      {
        title: "Camera and code scanning",
        text: "Camera access starts only after you choose to enable it and grant browser permission. QR and barcode decoding, including images selected for scanning, runs in your browser; the application does not upload those images or camera frames. A match still requires you to confirm the product and size. A decoded code does not authenticate a product.",
      },
      {
        title: "Analytics",
        text: "The buying block sends a first-visible event and outbound store clicks to our own server. Events contain catalog product, offer, retailer and market identifiers, timestamp and affiliation status. No visitor identifier or advertising cookie is created. Do Not Track and Global Privacy Control disable this collection. Events are recorded in hosting logs with the retention limitations described below. They count interactions, not unique visitors, customers or confirmed sales. Other interface events remain browser-local.",
      },
      {
        title: "Hosting provider",
        text: `The public site is hosted on ${site.hostingProvider}. Requests pass through the hosting provider, which processes technical request data. The deployed Worker configuration enables request logs and sampled traces and requests query-string redaction. This is not a guarantee that URLs are absent from every infrastructure log. ${site.hostingLogRetention ? `Owner-supplied retention information: ${site.hostingLogRetention}` : "The operator has not yet confirmed the retention periods and complete processing details for those logs."}`,
      },
      {
        title: "External websites",
        text: "Store links open external sites with their own policies. Buying-block event payloads exclude personal identifiers, search terms and full URLs. The hosting provider still processes technical request data.",
      },
      {
        title: "Operator and privacy contact",
        text: `${site.operator ? `Operator: ${site.operator}.` : "A public operator identity is still outstanding."} ${site.contact ? `Privacy questions and correction requests can be sent to ${site.contact}. Do not include personal medical information.` : "A working privacy contact has not yet been supplied; this page does not provide a monitored request channel."} These outstanding details and applicable requirements need review before a full editorial or commercial launch.`,
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
          : "A public contact channel has not yet been configured for this beta. No monitored message form is available; entering a search or calculator value does not send a correction request.",
      },
    ],
  },
};
