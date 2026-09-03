"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EtherealArrow } from "@/components/ethereal-arrow";
import { AUDIO_ENERGY_EVENT, type AudioEnergyDetail } from "@/lib/audio-reactivity";

const ANALYSIS_INTERVAL_MS = 100;

function averageFrequencyRange(data: Uint8Array<ArrayBuffer>, start: number, end: number) {
  let total = 0;
  const safeEnd = Math.min(end, data.length);

  for (let index = start; index < safeEnd; index += 1) total += data[index];
  return safeEnd > start ? total / (safeEnd - start) / 255 : 0;
}

function normalizeEnergy(value: number) {
  return Math.min(1, Math.max(0, (value - 0.055) * 1.75));
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [introVisible, setIntroVisible] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [introRun, setIntroRun] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const soundWantedRef = useRef(true);
  const introLeavingRef = useRef(false);
  const introTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frequencyDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const analysisTimerRef = useRef<number | null>(null);

  const prepareAudioAnalysis = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!audioContextRef.current) {
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      const source = context.createMediaElementSource(audio);

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser);
      analyser.connect(context.destination);

      audioContextRef.current = context;
      analyserRef.current = analyser;
      frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume();
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const emitEnergy = (detail: AudioEnergyDetail) => {
      window.dispatchEvent(new CustomEvent<AudioEnergyDetail>(AUDIO_ENERGY_EVENT, { detail }));
    };

    const stopAnalysis = () => {
      if (analysisTimerRef.current !== null) window.clearInterval(analysisTimerRef.current);
      analysisTimerRef.current = null;
      emitEnergy({ active: false, high: 0 });
    };

    const analyse = () => {
      if (audio.paused || document.visibilityState !== "visible") {
        stopAnalysis();
        return;
      }

      const analyser = analyserRef.current;
      const frequencyData = frequencyDataRef.current;
      if (analyser && frequencyData) {
        analyser.getByteFrequencyData(frequencyData);
        emitEnergy({
          active: true,
          high: normalizeEnergy(averageFrequencyRange(frequencyData, 18, 48)),
        });
      }
    };

    const startAnalysis = () => {
      if (!analyserRef.current || analysisTimerRef.current !== null || document.visibilityState !== "visible") return;
      analyse();
      analysisTimerRef.current = window.setInterval(analyse, ANALYSIS_INTERVAL_MS);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !audio.paused) startAnalysis();
      else stopAnalysis();
    };

    audio.addEventListener("play", startAnalysis);
    audio.addEventListener("pause", stopAnalysis);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      audio.removeEventListener("play", startAnalysis);
      audio.removeEventListener("pause", stopAnalysis);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAnalysis();
      void audioContextRef.current?.close();
      audioContextRef.current = null;
      analyserRef.current = null;
      frequencyDataRef.current = null;
    };
  }, []);

  const dismissIntro = useCallback(() => {
    if (introLeavingRef.current) return;
    introLeavingRef.current = true;
    setIntroLeaving(true);
    introTimeoutRef.current = window.setTimeout(() => {
      videoRef.current?.pause();
      setIntroVisible(false);
      setIntroLeaving(false);
      setIntroStarted(false);
      introLeavingRef.current = false;
      introTimeoutRef.current = null;
    }, 650);
  }, []);

  useEffect(() => {
    if (!introVisible) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissIntro();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [dismissIntro, introVisible]);

  useEffect(() => () => {
    if (introTimeoutRef.current !== null) window.clearTimeout(introTimeoutRef.current);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const audioElement: HTMLAudioElement = audio;

    audioElement.volume = 0.24;
    if (introVisible || !soundWantedRef.current) {
      audioElement.pause();
      return () => audioElement.pause();
    }

    let listeningForUnlock = false;

    const removeUnlockListeners = () => {
      if (!listeningForUnlock) return;
      window.removeEventListener("pointerdown", attemptPlayback, true);
      window.removeEventListener("keydown", attemptPlayback, true);
      listeningForUnlock = false;
    };

    const addUnlockListeners = () => {
      if (listeningForUnlock || !soundWantedRef.current) return;
      window.addEventListener("pointerdown", attemptPlayback, true);
      window.addEventListener("keydown", attemptPlayback, true);
      listeningForUnlock = true;
    };

    function attemptPlayback() {
      if (!soundWantedRef.current) return;
      void audioElement.play().then(removeUnlockListeners).catch(addUnlockListeners);
    }

    attemptPlayback();

    return () => {
      removeUnlockListeners();
      audioElement.pause();
    };
  }, [introVisible]);

  const toggleSound = () => {
    const nextSoundOn = !soundOn;
    const audio = audioRef.current;

    soundWantedRef.current = nextSoundOn;
    setSoundOn(nextSoundOn);

    if (!audio) return;
    if (nextSoundOn) {
      prepareAudioAnalysis();
      audio.volume = 0.24;
      void audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  };

  const startIntro = () => {
    const video = videoRef.current;
    if (!video) return;

    prepareAudioAnalysis();
    audioRef.current?.pause();
    video.currentTime = 0;
    video.muted = false;
    setIntroStarted(true);
    setIntroRun((run) => run + 1);
    void video.play().catch(() => setIntroStarted(false));
  };

  const skipIntro = () => {
    prepareAudioAnalysis();
    dismissIntro();
  };

  const replayIntro = () => {
    const video = videoRef.current;
    if (!video) return;

    if (introTimeoutRef.current !== null) window.clearTimeout(introTimeoutRef.current);
    introTimeoutRef.current = null;
    introLeavingRef.current = false;
    setIntroLeaving(false);
    setIntroVisible(true);
    setOpen(false);
    startIntro();
  };

  const close = () => setOpen(false);

  return (
    <>
      <div className={`site-intro ${introStarted ? "has-started" : "is-awaiting"} ${introLeaving ? "is-leaving" : ""}`} role="dialog" aria-modal="true" aria-label="MendezSoftwagic introduction" aria-hidden={!introVisible} hidden={!introVisible}>
        <video ref={videoRef} className="intro-video" src="/images/SoftwaficPresentation.mp4" playsInline preload="auto" onEnded={dismissIntro} onError={dismissIntro} />
        <div className="intro-vignette" aria-hidden="true" />
        <div className="intro-label" aria-hidden="true"><span /> MendezSoftwagic / Presentation</div>
        <button className="intro-skip" type="button" onClick={skipIntro}>Skip <EtherealArrow small /></button>
        <div className="intro-gate" hidden={introStarted}>
          <p>Eight second transmission</p>
          <button className="intro-enter-button" type="button" onClick={startIntro} autoFocus>
            <span className="intro-enter-orb" aria-hidden="true"><i /></span>
            <span><strong>View Intro</strong><small>Enable sound</small></span>
          </button>
          <span className="intro-audio-note"><i aria-hidden="true" /> Audio experience</span>
        </div>
        <div className="intro-progress" aria-hidden="true" hidden={!introStarted}><span key={introRun} /></div>
      </div>

      <nav className="nav-shell" aria-label="Primary navigation">
        <audio ref={audioRef} src="/Narvent-Fainted.mp3" loop preload="auto" playsInline />
        <Link className="brand" href="/#top" onClick={close} aria-label="MendezSoftwagic home">
          <span className="brand-mark">M</span><span>MendezSoftwagic</span>
        </Link>
        <div className={`nav-links ${open ? "is-open" : ""}`}>
          <Link href="/#work" onClick={close}>Work</Link>
          <Link href="/#astral" onClick={close}>Astral Classifier</Link>
          <Link href="/#about" onClick={close}>About</Link>
          <button className="sound-toggle" type="button" onClick={toggleSound} aria-pressed={soundOn} aria-label={soundOn ? "Pause Narvent — Fainted" : "Play Narvent — Fainted"} title="Narvent — Fainted">
            <span className={soundOn ? "sound-bars is-playing" : "sound-bars"} aria-hidden="true"><i /><i /><i /></span>
            {soundOn ? "Sound on" : "Sound off"}
          </button>
          <Link className="nav-cta" href="/#contact" onClick={close}>Start a project</Link>
        </div>
        <div className="nav-end">
          <button className="intro-replay-button" type="button" onClick={replayIntro} aria-label="View introduction with sound" title="View the MendezSoftwagic intro with sound">
            <span className="intro-button-orb" aria-hidden="true"><i /></span>
            <span className="intro-button-copy">View Intro</span>
          </button>
          <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation"><span /><span /></button>
        </div>
      </nav>
    </>
  );
}
