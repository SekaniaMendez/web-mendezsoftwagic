"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EtherealArrow } from "@/components/ethereal-arrow";

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
      audio.volume = 0.24;
      void audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  };

  const startIntro = () => {
    const video = videoRef.current;
    if (!video) return;

    audioRef.current?.pause();
    video.currentTime = 0;
    video.muted = false;
    setIntroStarted(true);
    setIntroRun((run) => run + 1);
    void video.play().catch(() => setIntroStarted(false));
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
        <button className="intro-skip" type="button" onClick={dismissIntro}>Skip <EtherealArrow small /></button>
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
          <Link href="/#lab" onClick={close}>Magic Lab</Link>
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
