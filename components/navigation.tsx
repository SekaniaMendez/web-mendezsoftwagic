"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<{ context: AudioContext; oscillator: OscillatorNode; gain: GainNode } | null>(null);

  useEffect(() => () => {
    const active = audioRef.current;
    if (active) {
      active.oscillator.stop();
      void active.context.close();
      audioRef.current = null;
    }
  }, []);

  const toggleSound = () => {
    if (soundOn && audioRef.current) {
      const active = audioRef.current;
      active.gain.gain.exponentialRampToValueAtTime(0.0001, active.context.currentTime + 0.45);
      window.setTimeout(() => {
        if (audioRef.current === active) {
          active.oscillator.stop();
          void active.context.close();
          audioRef.current = null;
        }
      }, 500);
      setSoundOn(false);
      return;
    }
    const context = new window.AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 72;
    gain.gain.value = 0.0001;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.018, context.currentTime + 1.2);
    audioRef.current = { context, oscillator, gain };
    setSoundOn(true);
  };

  const close = () => setOpen(false);

  return (
    <nav className="nav-shell" aria-label="Primary navigation">
      <Link className="brand" href="/#top" onClick={close} aria-label="MendezSoftwagic home">
        <span className="brand-mark">M</span><span>MendezSoftwagic</span>
      </Link>
      <div className={`nav-links ${open ? "is-open" : ""}`}>
        <Link href="/#work" onClick={close}>Work</Link>
        <Link href="/#lab" onClick={close}>Magic Lab</Link>
        <Link href="/#about" onClick={close}>About</Link>
        <button className="sound-toggle" type="button" onClick={toggleSound} aria-pressed={soundOn} aria-label={soundOn ? "Mute ambient sound" : "Play ambient sound"}>
          <span className={soundOn ? "sound-bars is-playing" : "sound-bars"} aria-hidden="true"><i /><i /><i /></span>
          {soundOn ? "Sound on" : "Sound off"}
        </button>
        <Link className="nav-cta" href="/#contact" onClick={close}>Start a project</Link>
      </div>
      <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation"><span /><span /></button>
    </nav>
  );
}
