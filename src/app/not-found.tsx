import Link from "next/link";
export default function NotFound() {
  return (
    <div className="wrap section">
      <span className="eyebrow">404 / OUTSIDE THE ATLAS</span>
      <h1>This page isn’t in the collection.</h1>
      <p>Try the product catalog or return to the home page.</p>
      <Link className="button" href="/">
        Back to the atlas
      </Link>
    </div>
  );
}
