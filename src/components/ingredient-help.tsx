"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Info, X } from "lucide-react";
import Link from "next/link";
import { ingredientPath } from "@/lib/config";
import { ingredientForName } from "@/lib/data";
import { IngredientEducation } from "./ingredient-education";
import { useClientReady } from "@/lib/use-client-ready";

export function IngredientHelp({
  name,
  comparisonQuery = "",
}: {
  name: string;
  comparisonQuery?: string;
}) {
  const ingredient = ingredientForName(name);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const ready = useClientReady();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [open]);
  if (!ingredient) return <span>{name}</span>;
  const guideHref =
    ingredientPath(ingredient.slug) +
    (comparisonQuery ? `?${comparisonQuery}` : "");
  return (
    <div className="ingredient-explanation">
      <strong>{name}</strong>
      <p>{ingredient.education.summary}</p>
      <div className="ingredient-learning-actions">
        <button
          type="button"
          className="ingredient-help-trigger"
          ref={trigger}
          disabled={!ready}
          aria-label={`What does it do? ${name}`}
          aria-haspopup="dialog"
          aria-controls={id}
          onClick={() => {
            dialog.current?.showModal();
            setOpen(true);
            closeButton.current?.focus();
          }}
        >
          <Info size={16} /> What does it do?
        </button>
        <Link href={guideHref} aria-label={`Full guide to ${name}`}>
          Full guide
        </Link>
      </div>
      <dialog
        ref={dialog}
        id={id}
        className="ingredient-help-dialog"
        aria-labelledby={`${id}-title`}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="ingredient-help-header">
          <div>
            <span className="eyebrow">INGREDIENT, EXPLAINED</span>
            <h2 id={`${id}-title`}>{name}</h2>
          </div>
          <button
            type="button"
            ref={closeButton}
            className="ingredient-help-close"
            aria-label="Close ingredient explanation"
            onClick={() => dialog.current?.close()}
          >
            <X size={22} />
          </button>
        </div>
        <div className="ingredient-help-body">
          <p className="education-lead">{ingredient.education.summary}</p>
          <IngredientEducation
            ingredient={ingredient}
            compact
            guideHref={guideHref}
          />
        </div>
      </dialog>
    </div>
  );
}
