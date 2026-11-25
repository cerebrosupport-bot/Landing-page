import React, { useState } from 'react';
import { Check, Compass, Headphones, Layers, Play, Pause, Sparkles } from 'lucide-react';
import { OFFICIAL_ASSETS } from '../data/content';
import { useLocale } from '../context/LocaleContext';
import { CharacterPortrait } from './CharacterPortrait';

type PreviewTab = 'myDay' | 'myPrograms' | 'myProgress';

export function PlatformPreviewSection() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<PreviewTab>('myDay');
  const [demoChecked, setDemoChecked] = useState(false);
  const [demoPlayingVisual, setDemoPlayingVisual] = useState(false);

  const tabs: { id: PreviewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'myDay', label: t.preview.tabs.myDay, icon: <Compass className="w-4 h-4" /> },
    { id: 'myPrograms', label: t.preview.tabs.myPrograms, icon: <Layers className="w-4 h-4" /> },
    { id: 'myProgress', label: t.preview.tabs.myProgress, icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#171E31] border-t border-[#E2E8F2] dark:border-[#242E49]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#2270E2] dark:text-[#63A0FA]">
              {t.preview.kicker}
            </p>
            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#1A2035] dark:text-[#F4F6FA]">
              {t.preview.title}
            </h2>
            <p className="mt-3.5 text-[15px] sm:text-base leading-relaxed text-[#525E7A] dark:text-[#9BA8C4]">
              {t.preview.subtitle}
            </p>
          </div>

          {/* Interactive segmented tab selector */}
          <div
            role="tablist"
            aria-label="Áreas de la futura plataforma"
            className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-[#F4F6FA] dark:bg-[#121726] border border-[#E2E8F2] dark:border-[#2B3654] self-start lg:self-auto"
          >
            {tabs.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selected
                      ? 'bg-[#2270E2] text-white'
                      : 'text-[#4A556E] dark:text-[#9BA8C4] hover:text-[#1A2035] dark:hover:text-[#F4F6FA]'
                  }`}
                >
                  <span aria-hidden="true">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Demonstrative platform showcase canvas */}
        <div className="mt-10 rounded-3xl bg-[#1A2035] text-[#F4F6FA] border border-[#2B3654] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2B3654] flex flex-wrap items-center justify-between gap-3 text-xs text-[#9BA8C4]">
            <span>{t.preview.demoNote}</span>
            <span>Te cuento tu primer paso · Interfaz conceptual</span>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left explanatory column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              {activeTab === 'myDay' && (
                <div>
                  <p className="text-xs font-medium text-[#63A0FA]">01 · Vista Mi día</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Un paso a la vez, sin saturarte
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#B2BDD6]">
                    En tu espacio diario encontrarás un audio breve sugerido y una acción concreta
                    de pocos minutos para aterrizar lo que escuchas en tu rutina cotidiana.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-[#D6DEF0]">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2270E2] shrink-0" />
                      <span>Reproductor integrado para escuchar en momentos tranquilos.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#17A96D] shrink-0" />
                      <span>Micro-actividades opcionales que puedes marcar a tu propio ritmo.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F5B700] shrink-0" />
                      <span>Acceso claro a tus programas o a orientación profesional cuando la necesites.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'myPrograms' && (
                <div>
                  <p className="text-xs font-medium text-[#63A0FA]">02 · Vista Mis programas</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Rutas organizadas según lo que quieres trabajar
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#B2BDD6]">
                    Cada programa divide un tema complejo en bloques comprensibles: entender qué
                    está ocurriendo, cambiar el enfoque y definir acciones realistas.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-[#D6DEF0]">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7C3AED] shrink-0" />
                      <span>Secuencias breves pensadas para escuchar sin interrupciones largas.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2270E2] shrink-0" />
                      <span>Posibilidad de cambiar de enfoque o pausar en cualquier momento.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'myProgress' && (
                <div>
                  <p className="text-xs font-medium text-[#63A0FA]">03 · Vista Mi progreso</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Seguimiento personal sereno y sin presión
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#B2BDD6]">
                    Un registro privado de los pasos que decides guardar para observar con claridad
                    tu constancia y qué reflexiones te han ayudado más, sin puntuaciones invasivas.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-[#D6DEF0]">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#17A96D] shrink-0" />
                      <span>Historial visual sencillo de tus sesiones y notas personales.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F44356] shrink-0" />
                      <span>Sin rachas punitivas ni comparaciones con otras personas.</span>
                    </li>
                  </ul>
                </div>
              )}

              <p className="text-xs text-[#8794B2] pt-4 border-t border-[#2B3654]">
                * Pantalla ilustrativa de diseño. Los ejemplos mostrados son únicamente
                demostrativos y no representan resultados ni métricas reales.
              </p>
            </div>

            {/* Right demonstrative UI screen matching the uploaded dark-navy mobile aesthetic */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-[#121726] border border-[#2B3654] p-5 sm:p-6">
                {/* Screen mini header */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#242E49]">
                  <div>
                    <p className="text-sm font-bold text-white">Tu espacio</p>
                    <p className="text-xs text-[#8F9DBB]">Un paso a la vez, a tu ritmo</p>
                  </div>
                  <span className="text-xs text-[#8F9DBB]">Demo visual</span>
                </div>

                {activeTab === 'myDay' && (
                  <div className="mt-5 space-y-4">
                    {/* Official quintet calm banner inside preview */}
                    <div className="rounded-xl overflow-hidden bg-[#F5F7FC] px-4 pt-3 pb-1 border border-[#2B3654]">
                      <img
                        src={OFFICIAL_ASSETS.quintetLineup}
                        alt="Personajes oficiales en la vista previa de Tu espacio"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-24 sm:h-28 object-contain"
                      />
                    </div>

                    {/* Demonstrative mini audio player preview */}
                    <div className="rounded-xl bg-[#1A2238] border border-[#2B3654] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <CharacterPortrait character="mateo" size="sm" />
                          <div className="min-w-0">
                            <p className="text-xs text-[#8F9DBB]">
                              Audio de ejemplo · Mateo
                            </p>
                            <p className="text-sm font-semibold text-white truncate">
                              Entender por qué pospones el inicio
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDemoPlayingVisual((p) => !p)}
                          aria-label={
                            demoPlayingVisual
                              ? 'Pausar demostración visual'
                              : 'Activar demostración visual'
                          }
                          className="w-10 h-10 rounded-full bg-[#2270E2] hover:bg-[#1B5EC0] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                        >
                          {demoPlayingVisual ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                      </div>
                      <div className="mt-3.5 flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-[#2B3654] overflow-hidden">
                          <div
                            className={`h-full bg-[#2270E2] rounded-full transition-all duration-500 ${
                              demoPlayingVisual ? 'w-2/3' : 'w-1/3'
                            }`}
                          />
                        </div>
                        <span className="text-xs text-[#9BA8C4] tabular-nums">
                          {demoPlayingVisual ? '02:14 / 04:30' : '01:20 / 04:30'}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] text-[#8794B2]">
                        Para escuchar el audio real, utiliza el reproductor en la siguiente sección.
                      </p>
                    </div>

                    {/* Demonstrative interactive practical activity */}
                    <div className="rounded-xl bg-[#1A2238] border border-[#2B3654] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-[#8F9DBB]">
                            Actividad práctica de ejemplo · 3 minutos
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            Divide una tarea pendiente en un primer paso de 5 minutos
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDemoChecked((v) => !v)}
                          aria-pressed={demoChecked}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                            demoChecked
                              ? 'bg-[#17A96D] text-white'
                              : 'bg-[#26314D] text-[#D6DEF0] hover:bg-[#314063]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{demoChecked ? 'Marcado (demo)' : 'Probar marca'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'myPrograms' && (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl bg-[#1A2238] border border-[#2B3654] p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <CharacterPortrait character="tito" size="sm" />
                        <div>
                          <p className="text-xs text-[#F5B700]">Ruta de ejemplo · Tito</p>
                          <p className="text-sm font-semibold text-white">
                            Salir del bloqueo de la procrastinación
                          </p>
                          <p className="text-xs text-[#9BA8C4] mt-0.5">
                            4 pasos breves · Audios y ejercicios prácticos
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#1A2238] border border-[#2B3654] p-4 space-y-2.5">
                      {[
                        { num: '1', label: 'Comprende qué activa el aplazamiento', state: 'Paso inicial' },
                        { num: '2', label: 'Cambia el enfoque de exigencia a acción mínima', state: 'Audio + reto' },
                        { num: '3', label: 'Define tu siguiente paso realista de hoy', state: 'Práctica breve' },
                        { num: '4', label: 'Revisa qué te funcionó sin juzgarte', state: 'Cierre sereno' },
                      ].map((row) => (
                        <div
                          key={row.num}
                          className="flex items-center justify-between gap-3 py-2 border-b last:border-b-0 border-[#26314D] text-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-[#24304F] text-[#9BA8C4] text-xs font-semibold flex items-center justify-center tabular-nums shrink-0">
                              {row.num}
                            </span>
                            <span className="text-[#E5EAF5] truncate">{row.label}</span>
                          </div>
                          <span className="text-xs text-[#8F9DBB] whitespace-nowrap shrink-0">
                            {row.state}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'myProgress' && (
                  <div className="mt-5 space-y-4">
                    <div className="rounded-xl bg-[#1A2238] border border-[#2B3654] p-4">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#9BA8C4]">
                        <span>Esquema de seguimiento semanal (ejemplo visual)</span>
                        <span>Sin presión ni rachas obligatorias</span>
                      </div>
                      <div className="mt-4 grid grid-cols-7 gap-2 text-center">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, idx) => {
                          const highlighted = idx === 0 || idx === 2 || idx === 4;
                          return (
                            <div
                              key={day}
                              className={`rounded-xl py-3 border text-xs font-semibold ${
                                highlighted
                                  ? 'bg-[#2270E2]/20 border-[#2270E2] text-white'
                                  : 'bg-[#151C2E] border-[#26314D] text-[#7E8BA8]'
                              }`}
                            >
                              <div>{day}</div>
                              <div className="mt-1.5 text-[10px] font-normal">
                                {highlighted ? 'Paso' : 'Pausa'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#1A2238] border border-[#2B3654] p-4 flex items-center gap-3.5">
                      <CharacterPortrait character="bruno" size="sm" />
                      <div>
                        <p className="text-xs text-[#17A96D]">Nota personal de ejemplo</p>
                        <p className="text-sm text-[#E5EAF5] mt-0.5">
                          «Separar una tarea grande en 5 minutos me ayudó a empezar con menos
                          tensión.»
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom preview tab indicator mirroring mobile structure */}
                <div className="mt-5 pt-3 border-t border-[#242E49] grid grid-cols-3 text-center text-xs text-[#8F9DBB]">
                  <span className={activeTab === 'myDay' ? 'text-[#63A0FA] font-semibold' : ''}>
                    Mi día
                  </span>
                  <span
                    className={activeTab === 'myPrograms' ? 'text-[#63A0FA] font-semibold' : ''}
                  >
                    Mis programas
                  </span>
                  <span
                    className={activeTab === 'myProgress' ? 'text-[#63A0FA] font-semibold' : ''}
                  >
                    Mi progreso
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
