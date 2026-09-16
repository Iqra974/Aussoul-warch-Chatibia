import React, { useMemo, useState } from 'react';
import { BookOpen, ListChecks, Layers, Play } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { chapters, questions, TOTAL_QUESTIONS } from '@/data/questions';
import { toArabicDigits } from '@/lib/arabic';
import { cn } from '@/lib/utils';
const HEADPIECE_URL = 'https://images.hostinger.com/6c115bd7-1d5d-4103-a1dd-d4de7f884ca8.png';
const COUNT_OPTIONS = [{
  value: 10,
  label: '10 أسئلة'
}, {
  value: 20,
  label: '20 سؤالا'
}, {
  value: 50,
  label: '50 سؤالا'
}, {
  value: 'all',
  label: 'الكل'
}];
const StartScreen = ({
  onStart
}) => {
  const [chapter, setChapter] = useState('all');
  const [count, setCount] = useState(20);
  const perChapter = useMemo(() => {
    const map = {};
    questions.forEach(q => {
      map[q.chapter] = (map[q.chapter] || 0) + 1;
    });
    return map;
  }, []);
  const poolSize = chapter === 'all' ? TOTAL_QUESTIONS : perChapter[chapter] || 0;
  const effectiveCount = count === 'all' ? poolSize : Math.min(count, poolSize);
  return <div className="relative mx-auto max-w-3xl">
            {/* عنصر خارج الشبكة */}
            <div aria-hidden className="absolute -left-8 top-40 hidden origin-left -rotate-90 items-center gap-2 lg:flex">
                <span className="h-2 w-2 bg-accent" />
                <span className="whitespace-nowrap text-xs tracking-[0.3em] text-accent">
                    باب الأصول — رواية ورش
                </span>
            </div>

            {/* الترويسة */}
            <Reveal>
                <header className="text-center">
                    <figure className="mx-auto w-44 sm:w-52">
                        <img src={HEADPIECE_URL} alt="سرلوح زخرفي بأسلوب المخطوطات" className="w-full mix-blend-multiply" />
                        <figcaption className="mt-1 text-[11px] tracking-widest text-muted-foreground" />
                    </figure>
                    <p className="mt-6 text-sm tracking-[0.25em] text-accent">رواية ورش</p>
                    <h1 className="font-display mt-2 text-4xl font-bold leading-snug text-foreground sm:text-5xl">
                        من طريق الشاطبية
                    </h1>
                    <p className="font-display mt-2 text-2xl text-primary sm:text-3xl">باب الأصول</p>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                        منصة تدريب بالأسئلة الاختيارية على أحكام رواية ورش: اختر الفصل، أجب،
                        وتحقق من إجابتك مع الشرح، وتتبع تقدمك حتى الإتقان.
                    </p>
                </header>
            </Reveal>

            {/* إحصاءات */}
            <Reveal delay={0.1}>
                <div className="mt-8 flex items-center justify-center gap-8 text-center sm:gap-14">
                    <div>
                        <p className="font-display text-3xl font-bold text-primary">
                            {toArabicDigits(TOTAL_QUESTIONS)}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><ListChecks className="h-3.5 w-3.5" /> سؤالا في جميع الفصول</p>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div>
                        <p className="font-display text-3xl font-bold text-primary">
                            {toArabicDigits(chapters.length)}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Layers className="h-3.5 w-3.5" /> فصلا
                        </p>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div>
                        <p className="font-display text-3xl font-bold text-primary">4</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <BookOpen className="h-3.5 w-3.5" /> خيارات لكل سؤال
                        </p>
                    </div>
                </div>
            </Reveal>

            <div className="rule-double mt-10" />

            {/* اختيار الفصل */}
            <Reveal delay={0.15}>
                <section className="mt-10">
                    <h2 className="flex items-baseline gap-3">
                        <span className="font-display text-xl font-bold text-accent">1.</span>
                        <span className="font-display text-2xl font-bold">اختر الفصل</span>
                    </h2>
                    <div className="mt-5 border-y border-border">
                        <button type="button" onClick={() => setChapter('all')} className={cn('flex w-full items-baseline py-3 text-right transition-colors hover:bg-secondary/60', chapter === 'all' && 'bg-secondary/70')}>
                            <span className={cn('ms-2 inline-block h-2 w-2 shrink-0', chapter === 'all' ? 'bg-accent' : 'bg-transparent')} />
                            <span className={cn('font-display text-lg', chapter === 'all' ? 'font-bold text-primary' : 'text-foreground')}>
                                جميع الفصول
                            </span>
                            <span className="leader-dots" />
                            <span className="me-2 text-sm text-muted-foreground">
                                {toArabicDigits(TOTAL_QUESTIONS)} سؤالا
                            </span>
                        </button>
                        {chapters.map(ch => <button key={ch.id} type="button" onClick={() => setChapter(ch.id)} className={cn('flex w-full items-baseline border-t border-border/60 py-3 text-right transition-colors hover:bg-secondary/60', chapter === ch.id && 'bg-secondary/70')}>
                                <span className={cn('ms-2 inline-block h-2 w-2 shrink-0', chapter === ch.id ? 'bg-accent' : 'bg-transparent')} />
                                <span className="w-8 shrink-0 text-sm text-muted-foreground">
                                    {toArabicDigits(ch.id)}.
                                </span>
                                <span className={cn('font-display text-lg', chapter === ch.id ? 'font-bold text-primary' : 'text-foreground')}>
                                    {ch.name}
                                </span>
                                <span className="leader-dots" />
                                <span className="me-2 text-sm text-muted-foreground">
                                    {toArabicDigits(perChapter[ch.id] || 0)} سؤالا
                                </span>
                            </button>)}
                    </div>
                </section>
            </Reveal>

            {/* عدد الأسئلة */}
            <Reveal delay={0.2}>
                <section className="mt-10">
                    <h2 className="flex items-baseline gap-3">
                        <span className="font-display text-xl font-bold text-accent">2.</span>
                        <span className="font-display text-2xl font-bold">عدد الأسئلة</span>
                    </h2>
                    <div className="mt-5 flex flex-wrap gap-2">
                        {COUNT_OPTIONS.map(opt => <button key={opt.value} type="button" onClick={() => setCount(opt.value)} className={cn('border px-5 py-2.5 text-sm transition-all active:scale-[0.98]', count === opt.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-transparent text-foreground hover:border-primary/50')}>
                                {opt.label}
                            </button>)}
                    </div>
                </section>
            </Reveal>

            {/* زر البدء */}
            <Reveal delay={0.25}>
                <div className="mt-12 text-center">
                    <button type="button" onClick={() => onStart({
          chapter,
          count: effectiveCount
        })} className="inline-flex min-h-[44px] items-center gap-3 border border-primary bg-primary px-10 py-3 font-display text-xl font-bold text-primary-foreground transition-all hover:-translate-y-px hover:bg-primary/90 active:scale-[0.98]">
                        <Play className="h-5 w-5" />
                        ابدأ الاختبار — {toArabicDigits(effectiveCount)} سؤالا
                    </button>
                    <p className="mt-3 text-xs text-muted-foreground">
                        ترتيب الأسئلة والخيارات عشوائي في كل محاولة
                    </p>
                </div>
            </Reveal>
        </div>;
};
export default StartScreen;