import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { CHARACTERS, DEFAULT_AUDIO_SAMPLES } from '../data/content';
import { useLocale } from '../context/LocaleContext';
import { CharacterPortrait } from './CharacterPortrait';
import type { AudioSample } from '../types';

interface AudioExperienceSectionProps {
  samples: AudioSample[];
  onTrackPlay: (trackId: string) => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioExperienceSection({
  samples,
  onTrackPlay,
}: AudioExperienceSectionProps) {
  const { t } = useLocale();
  const activeSamples = samples.filter((s) => s.active);
  const tracks = activeSamples.length > 0 ? activeSamples : DEFAULT_AUDIO_SAMPLES;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackedPlaysRef = useRef<Set<string>>(new Set());

  const currentTrack = tracks[Math.min(selectedIndex, tracks.length - 1)] || tracks[0];
  const currentChar = CHARACTERS[currentTrack.character] || CHARACTERS.mateo;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(0);
    setDuration(0);
    setAudioError(null);
    audio.load();
    if (isPlaying) {
      audio
        .play()
        .then(() => {
          if (!trackedPlaysRef.current.has(currentTrack.id)) {
            trackedPlaysRef.current.add(currentTrack.id);
            onTrackPlay(currentTrack.id);
          }
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack.audioUrl, currentTrack.id]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioError(null);

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      if (!trackedPlaysRef.current.has(currentTrack.id)) {
        trackedPlaysRef.current.add(currentTrack.id);
        onTrackPlay(currentTrack.id);
      }
    } catch {
      setAudioError('No fue posible reproducir esta pista en este momento.');
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const nextTime = Number(e.target.value);
    setCurrentTime(nextTime);
    if (audio && Number.isFinite(nextTime)) {
      audio.currentTime = nextTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVol = Number(e.target.value);
    setVolume(nextVol);
    if (nextVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleSelectTrack = (index: number) => {
    if (index === selectedIndex) {
      void togglePlay();
      return;
    }
    setSelectedIndex(index);
    setIsPlaying(true);
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <section
      id="audio-experiencia"
      className="py-16 sm:py-24 border-t border-[#E2E8F2] dark:border-[#242E49]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#2270E2] dark:text-[#63A0FA]">
            {t.audioSection.kicker}
          </p>
          <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#1A2035] dark:text-[#F4F6FA]">
            {t.audioSection.title}
          </h2>
          <p className="mt-3.5 text-[15px] sm:text-base leading-relaxed text-[#525E7A] dark:text-[#9BA8C4]">
            {t.audioSection.subtitle}
          </p>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          preload="metadata"
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
            setAudioError('No se pudo cargar el archivo de audio seleccionado.');
          }}
        />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Active audio player card */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-start gap-5">
              <CharacterPortrait character={currentTrack.character} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-[#525E7A] dark:text-[#9BA8C4]">
                  <span
                    className="w-2.5 h-0.5 rounded-full"
                    style={{ backgroundColor: currentChar.color }}
                    aria-hidden="true"
                  />
                  <span>{currentChar.name}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {duration > 0 ? formatTime(duration) : currentTrack.durationLabel}
                  </span>
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-bold text-[#1A2035] dark:text-[#F4F6FA]">
                  {currentTrack.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#525E7A] dark:text-[#9BA8C4]">
                  {currentTrack.description}
                </p>
              </div>
            </div>

            {/* Playback & Progress Controls */}
            <div className="mt-8 pt-6 border-t border-[#EEF2F7] dark:border-[#26314D]">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? t.audioSection.pause : t.audioSection.play}
                  className="w-12 h-12 rounded-2xl bg-[#2270E2] hover:bg-[#1B5EC0] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" aria-hidden="true" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="relative flex items-center h-6">
                    <div className="w-full h-1.5 rounded-full bg-[#E2E8F2] dark:bg-[#2B3654] overflow-hidden pointer-events-none">
                      <div
                        className="h-full bg-[#2270E2] rounded-full transition-all duration-100"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={duration || 24}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      aria-label="Progreso del audio"
                      className="tctpp-range absolute inset-0 w-full h-full opacity-100"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-[#525E7A] dark:text-[#9BA8C4] tabular-nums">
                    <span>{formatTime(currentTime)}</span>
                    <span>{duration > 0 ? formatTime(duration) : currentTrack.durationLabel}</span>
                  </div>
                </div>
              </div>

              {/* Volume control */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMuted((m) => !m)}
                    aria-label={isMuted ? t.audioSection.unmute : t.audioSection.mute}
                    className="w-9 h-9 rounded-xl border border-[#DCE3F0] dark:border-[#2B3654] flex items-center justify-center text-[#4A556E] dark:text-[#A9B4CC] hover:text-[#1A2035] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Volume2 className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                  <label className="sr-only" htmlFor="audio-volume-slider">
                    {t.audioSection.volume}
                  </label>
                  <input
                    id="audio-volume-slider"
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    aria-label={t.audioSection.volume}
                    className="tctpp-range w-28 sm:w-32 h-1.5 rounded-full bg-[#E2E8F2] dark:bg-[#2B3654]"
                  />
                  <span className="text-xs text-[#525E7A] dark:text-[#9BA8C4] tabular-nums w-9">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>

                {audioError && (
                  <p role="alert" className="text-xs text-[#F44356]">
                    {audioError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Track list selector */}
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-[#525E7A] dark:text-[#9BA8C4] mb-4">
                {t.audioSection.trackListLabel}
              </p>

              <div className="space-y-2.5">
                {tracks.map((track, idx) => {
                  const selected = idx === selectedIndex;
                  const char = CHARACTERS[track.character] || CHARACTERS.mateo;

                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => handleSelectTrack(idx)}
                      className={`w-full text-left rounded-2xl p-3.5 border transition-colors flex items-center gap-3.5 cursor-pointer ${
                        selected
                          ? 'bg-[#F4F6FA] dark:bg-[#222B45] border-[#2270E2]'
                          : 'bg-transparent border-[#EEF2F7] dark:border-[#26314D] hover:bg-[#F8FAFD] dark:hover:bg-[#1E263D]'
                      }`}
                    >
                      <CharacterPortrait character={track.character} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#1A2035] dark:text-[#F4F6FA] truncate">
                          {track.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-[#525E7A] dark:text-[#9BA8C4]">
                          <span>{char.name}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{track.durationLabel}</span>
                        </div>
                      </div>
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          selected
                            ? 'bg-[#2270E2] text-white'
                            : 'bg-[#EEF2F8] dark:bg-[#26314D] text-[#4A556E] dark:text-[#A9B4CC]'
                        }`}
                        aria-hidden="true"
                      >
                        {selected && isPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 ml-0.5" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-6 pt-4 border-t border-[#EEF2F7] dark:border-[#26314D] text-xs leading-relaxed text-[#525E7A] dark:text-[#9BA8C4]">
              {t.audioSection.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
