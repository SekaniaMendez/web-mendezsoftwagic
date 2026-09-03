"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import type { IconType } from "react-icons";
import {
  TbZodiacAquarius,
  TbZodiacAries,
  TbZodiacCancer,
  TbZodiacCapricorn,
  TbZodiacGemini,
  TbZodiacLeo,
  TbZodiacLibra,
  TbZodiacPisces,
  TbZodiacSagittarius,
  TbZodiacScorpio,
  TbZodiacTaurus,
  TbZodiacVirgo,
} from "react-icons/tb";

type ElementName = "Fire" | "Earth" | "Air" | "Water";
type StatName = "Vitality" | "Power" | "Guard" | "Insight" | "Resonance" | "Fortune";
type Phase = "idle" | "reading" | "revealed";
type AstronomyBodyName = "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn";

type ZodiacSign = {
  name: string;
  icon: IconType;
  element: ElementName;
  className: string;
  classDescription: string;
};

type CelestialBody = {
  name: string;
  symbol: string;
  radius: number;
  astronomyBody: AstronomyBodyName;
  stat: StatName;
};

type ChartResult = {
  sun: ZodiacSign;
  ascendant: ZodiacSign;
  bodies: Array<CelestialBody & { angle: number; sign: ZodiacSign }>;
  stats: Array<{ name: StatName; value: number }>;
  dominant: { name: ElementName; score: number };
  elementScores: Array<{ name: ElementName; score: number }>;
};

const zodiac: ZodiacSign[] = [
  { name: "Aries", icon: TbZodiacAries, element: "Fire", className: "Dawn Vanguard", classDescription: "A relentless initiator who turns momentum into radiant force." },
  { name: "Taurus", icon: TbZodiacTaurus, element: "Earth", className: "Stone Warden", classDescription: "An immovable guardian who stores power and releases it with precision." },
  { name: "Gemini", icon: TbZodiacGemini, element: "Air", className: "Rift Twin", classDescription: "A mobile tactician who mirrors abilities and fractures enemy intent." },
  { name: "Cancer", icon: TbZodiacCancer, element: "Water", className: "Moon Guardian", classDescription: "A protective channeler whose strength rises around bonded allies." },
  { name: "Leo", icon: TbZodiacLeo, element: "Fire", className: "Solar Regent", classDescription: "A commanding combatant who converts attention into overwhelming presence." },
  { name: "Virgo", icon: TbZodiacVirgo, element: "Earth", className: "Rune Weaver", classDescription: "A precise architect who inscribes conditions into the battlefield." },
  { name: "Libra", icon: TbZodiacLibra, element: "Air", className: "Astral Arbiter", classDescription: "A duelist who redistributes advantage until every debt is answered." },
  { name: "Scorpio", icon: TbZodiacScorpio, element: "Water", className: "Umbra Reaper", classDescription: "A hidden predator who transforms pressure, loss and secrets into power." },
  { name: "Sagittarius", icon: TbZodiacSagittarius, element: "Fire", className: "Star Ranger", classDescription: "A horizon hunter whose attacks grow stronger across distance and discovery." },
  { name: "Capricorn", icon: TbZodiacCapricorn, element: "Earth", className: "Void Sentinel", classDescription: "A disciplined ascendant who becomes harder to break with every trial." },
  { name: "Aquarius", icon: TbZodiacAquarius, element: "Air", className: "Aether Architect", classDescription: "A system breaker who links strange mechanisms into impossible combinations." },
  { name: "Pisces", icon: TbZodiacPisces, element: "Water", className: "Dream Walker", classDescription: "A liminal mystic who moves between memory, illusion and waking reality." },
];

const celestialBodies: CelestialBody[] = [
  { name: "Sun", symbol: "☉", radius: 82, astronomyBody: "Sun", stat: "Vitality" },
  { name: "Moon", symbol: "☾", radius: 106, astronomyBody: "Moon", stat: "Resonance" },
  { name: "Mercury", symbol: "☿", radius: 130, astronomyBody: "Mercury", stat: "Insight" },
  { name: "Venus", symbol: "♀", radius: 154, astronomyBody: "Venus", stat: "Resonance" },
  { name: "Mars", symbol: "♂", radius: 178, astronomyBody: "Mars", stat: "Power" },
  { name: "Jupiter", symbol: "♃", radius: 202, astronomyBody: "Jupiter", stat: "Fortune" },
  { name: "Saturn", symbol: "♄", radius: 226, astronomyBody: "Saturn", stat: "Guard" },
];

const statNames: StatName[] = ["Vitality", "Power", "Guard", "Insight", "Resonance", "Fortune"];
const elementNames: ElementName[] = ["Fire", "Earth", "Air", "Water"];
const elementColors: Record<ElementName, string> = { Fire: "244, 145, 91", Earth: "126, 201, 157", Air: "132, 210, 255", Water: "151, 139, 255" };
const elementStats: Record<ElementName, StatName> = { Fire: "Power", Earth: "Guard", Air: "Insight", Water: "Resonance" };
const defaultAngles = [18, 72, 126, 180, 234, 288, 336];
const ORBIT_CYCLE_MS = 15000;

function wrap(value: number, limit: number) {
  return ((value % limit) + limit) % limit;
}

async function buildChart(date: string, time: string): Promise<ChartResult> {
  const { Body, Ecliptic, GeoVector } = await import("astronomy-engine");
  const [hour, minute] = time.split(":").map(Number);
  const observationTime = new Date(`${date}T${time}:00`);
  const bodies = celestialBodies.map((body) => {
    const vector = GeoVector(Body[body.astronomyBody], observationTime, true);
    const angle = wrap(Ecliptic(vector).elon, 360);
    return { ...body, angle, sign: zodiac[Math.floor(angle / 30)] };
  });
  const sun = bodies[0].sign;
  const sunIndex = zodiac.indexOf(sun);
  const ascendantSteps = Math.floor((hour * 60 + minute - 360) / 120);
  const ascendant = zodiac[wrap(sunIndex + ascendantSteps, zodiac.length)];

  const values = Object.fromEntries(statNames.map((name) => [name, 34])) as Record<StatName, number>;
  values[elementStats[sun.element]] += 17;
  values[elementStats[ascendant.element]] += 8;
  bodies.forEach((body) => {
    const resonance = Math.round(17 + Math.abs(Math.sin((body.angle * Math.PI) / 180)) * 8);
    values[body.stat] += resonance;
  });

  const elementalValues = Object.fromEntries(elementNames.map((name) => [name, 0])) as Record<ElementName, number>;
  elementalValues[sun.element] += 3;
  elementalValues[ascendant.element] += 2;
  bodies.forEach((body) => { elementalValues[body.sign.element] += body.name === "Moon" ? 2 : 1; });
  const elementScores = elementNames.map((name) => ({ name, score: elementalValues[name] }));
  const dominant = elementScores.reduce(
    (strongest, element) => element.score > strongest.score ? element : strongest,
    { name: sun.element, score: elementalValues[sun.element] },
  );

  return {
    sun,
    ascendant,
    bodies,
    dominant,
    elementScores,
    stats: statNames.map((name) => ({ name, value: Math.min(99, values[name]) })),
  };
}

function pointOnCircle(angle: number, radius: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  const stableCoordinate = (value: number) => Number(value.toFixed(3));
  return {
    x: stableCoordinate(300 + Math.cos(radians) * radius),
    y: stableCoordinate(300 + Math.sin(radians) * radius),
  };
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInCubic(value: number) {
  return value * value * value;
}

function interpolate(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function orbitAngle(progress: number, target: number) {
  if (progress < .25) return interpolate(target - 720, target - 38, easeOutCubic(progress / .25));
  if (progress < .33) return interpolate(target - 38, target, easeOutCubic((progress - .25) / .08));
  if (progress < .66) return target;
  if (progress < .76) return interpolate(target, target + 24, easeInCubic((progress - .66) / .1));
  return interpolate(target + 24, target + 360, easeInCubic((progress - .76) / .24));
}

export function AstralClassifier() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<ChartResult | null>(null);
  const [run, setRun] = useState(0);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const motionRefs = useRef<Array<SVGGElement | null>>([]);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const revealTimer = useRef<number | null>(null);

  const displayedBodies = useMemo(() => celestialBodies.map((body, index) => ({
    ...body,
    angle: result?.bodies[index]?.angle ?? defaultAngles[index],
    sign: result?.bodies[index]?.sign ?? zodiac[Math.floor(defaultAngles[index] / 30)],
  })), [result]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = true;
    let resonant = false;
    const startedAt = performance.now();
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .05 });

    const animate = (time: number) => {
      if (visible) {
        const progress = reduceMotion ? .5 : ((time - startedAt) % ORBIT_CYCLE_MS) / ORBIT_CYCLE_MS;
        const nextResonant = Boolean(result) && progress >= .33 && progress < .66;
        if (nextResonant !== resonant) {
          chart.classList.toggle("is-resonant", nextResonant);
          resonant = nextResonant;
        }
        displayedBodies.forEach((body, index) => {
          const angle = reduceMotion ? body.angle : orbitAngle(progress, body.angle);
          motionRefs.current[index]?.setAttribute("transform", `rotate(${angle} 300 300)`);
          nodeRefs.current[index]?.setAttribute("transform", `rotate(${-angle} 300 ${300 - body.radius})`);
        });
      }
      frame = window.requestAnimationFrame(animate);
    };

    observer.observe(chart);
    frame = window.requestAnimationFrame(animate);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      chart.classList.remove("is-resonant");
    };
  }, [displayedBodies, result]);

  useEffect(() => () => {
    if (revealTimer.current !== null) window.clearTimeout(revealTimer.current);
  }, []);

  const revealChart = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!birthDate || !birthTime) return;
    if (revealTimer.current !== null) window.clearTimeout(revealTimer.current);
    setPhase("reading");
    const chart = await buildChart(birthDate, birthTime);
    setResult(chart);
    setRun((value) => value + 1);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("revealed");
      return;
    }
    revealTimer.current = window.setTimeout(() => {
      setPhase("revealed");
      revealTimer.current = null;
    }, 5000);
  };

  const chartStyle = { "--astral-rgb": result ? elementColors[result.dominant.name] : "120, 248, 228" } as CSSProperties;
  const aspectPoints = result?.bodies.map((body) => pointOnCircle(body.angle, body.radius)) ?? [];

  return (
    <div className="lab-console astral-console reveal" style={chartStyle}>
      <div className="lab-toolbar"><div><span className="live-dot" /> Umbra Caeli astral engine</div><span>Natal combat profile / Lite</span></div>
      <div className="astral-workspace">
        <form className="astral-form" onSubmit={revealChart}>
          <p className="astral-overline">Constellation protocol</p>
          <h3>Reveal your celestial class.</h3>
          <p>Your Sun awakens an element. Your birth hour estimates the Ascendant that determines your class. Seven celestial bodies shape your attributes and dominant affinity.</p>
          <label><span>Date of birth</span><input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} required /></label>
          <label><span>Exact birth time</span><input type="time" value={birthTime} onChange={(event) => setBirthTime(event.target.value)} required /></label>
          <small>Geocentric ephemeris · Planetary positions use your device time zone. A complete natal chart also requires birthplace and historical time zone.</small>
          <button type="submit" disabled={phase === "reading"}>{phase === "reading" ? "Reading celestial motion…" : result ? "Recast constellation" : "Reveal constellation"}</button>
        </form>

        <div className="astral-visual">
          <div className={`astral-chart is-${phase}`} ref={chartRef} key={run}>
            <svg className="astral-map" viewBox="0 0 600 600" role="img" aria-label="Animated Umbra Caeli natal chart">
              <defs><radialGradient id="astralCore" cx="50%" cy="45%" r="60%"><stop offset="0" stopColor="rgb(var(--astral-rgb))" stopOpacity=".28" /><stop offset="1" stopColor="#05080b" stopOpacity=".96" /></radialGradient></defs>
              <g className="astral-zodiac-grid">
                <circle cx="300" cy="300" r="260" /><circle cx="300" cy="300" r="240" /><circle cx="300" cy="300" r="58" />
                {zodiac.map((sign, index) => {
                  const outer = pointOnCircle(index * 30, 260);
                  const inner = pointOnCircle(index * 30, 58);
                  const label = pointOnCircle(index * 30 + 15, 250);
                  const isDominant = result?.dominant.name === sign.element;
                  const ZodiacIcon = sign.icon;
                  return (
                    <g className={isDominant ? "is-dominant" : undefined} key={sign.name}>
                      <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} />
                      <g className="astral-zodiac-icon" transform={`translate(${label.x - 11} ${label.y - 11})`}>
                        <ZodiacIcon width="22" height="22" aria-hidden="true" focusable="false" />
                      </g>
                    </g>
                  );
                })}
              </g>
              <g className="astral-aspects">
                {aspectPoints.map((point, index) => {
                  const next = aspectPoints[(index + 2) % aspectPoints.length];
                  return next ? <line x1={point.x} y1={point.y} x2={next.x} y2={next.y} key={`${point.x}-${next.y}`} /> : null;
                })}
              </g>
              {displayedBodies.map((body, index) => (
                <g className="astral-body-layer" key={body.name}>
                  <circle className="astral-orbit-path" cx="300" cy="300" r={body.radius} />
                  <g ref={(node) => { motionRefs.current[index] = node; }}>
                    <line className="astral-body-ray" x1="300" y1="300" x2="300" y2={300 - body.radius} />
                    <g ref={(node) => { nodeRefs.current[index] = node; }}>
                      <circle className="astral-body-halo" cx="300" cy={300 - body.radius} r={body.name === "Sun" ? 13 : 10} />
                      <circle className="astral-body-node" cx="300" cy={300 - body.radius} r={body.name === "Sun" ? 8 : 6} />
                      <text className="astral-body-symbol" x="300" y={301 - body.radius}>{body.symbol}</text>
                    </g>
                  </g>
                </g>
              ))}
              <circle className="astral-svg-core" cx="300" cy="300" r="48" fill="url(#astralCore)" />
              <text className="astral-svg-monogram" x="300" y="306">UC</text>
            </svg>
          </div>

          <div className={`astral-result is-${phase}`} aria-live="polite">
            {!result || phase === "idle" ? <p>Awaiting date and hour</p> : phase === "reading" ? <p>Calculating celestial resonance…</p> : (
              <>
                <p className="astral-solar-signature"><result.sun.icon className="astral-inline-zodiac" aria-hidden="true" /> {result.sun.name} Sun · {result.sun.element} affinity</p>
                <strong>{result.ascendant.className}</strong>
                <span>Umbra Ascendant · <result.ascendant.icon className="astral-inline-zodiac" aria-hidden="true" /> {result.ascendant.name}</span>
                <div className="astral-dominant" aria-label={`Dominant element: ${result.dominant.name}`}>
                  <span>Dominant element</span>
                  <b>{result.dominant.name}</b>
                  <small>{result.dominant.score} of {result.elementScores.reduce((total, element) => total + element.score, 0)} celestial points</small>
                </div>
                <small>{result.ascendant.classDescription}</small>
              </>
            )}
          </div>

          {result && phase === "revealed" ? (
            <div className="astral-profile">
              <div className="astral-stats" aria-label="Umbra Caeli character statistics">
                {result.stats.map((stat) => <div key={stat.name}><span>{stat.name}<b>{stat.value}</b></span><i><em style={{ width: `${stat.value}%` }} /></i></div>)}
              </div>
              <div className="astral-influences" aria-label="Celestial influences">
                {result.bodies.map((body) => <span key={body.name}><b>{body.symbol}</b><i>{body.name}</i><small>{body.sign.name} · {body.stat}</small></span>)}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
