import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><p className="section-kicker">404 / Lost in the void</p><h1>This world does not exist.</h1><Link className="button button-primary" href="/">Return home</Link></main>;
}
