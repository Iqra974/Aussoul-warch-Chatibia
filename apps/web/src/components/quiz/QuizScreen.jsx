import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Flag, X } from 'lucide-react';
import { chapters } from '@/data/questions';
import { OPTION_LETTERS, toArabicDigits } from '@/lib/arabic';
import { cn } from '@/lib/utils';

const QuizScreen = ({ session, onFinish, onQuit }) => {
    const [idx, setIdx] = useState(0);
    const [furthest, setFurthest] = useState(0);
    const [answers, setAnswers] = useState(() =>
        session.map(() => ({ selected: null, validated: false }))
    );

    const q = session[idx];
    const current = answers[idx];
    const validatedCount = answers.filter((a) => a.validated).length;
    const chapterName = chapters.find((ch) => ch.id === q.chapter)?.name || '';
    const isLast = idx === session.length - 1;

    const select = (i) => {
        if (current.validated) return;
        setAnswers((prev) => prev.map((a, k) => (k === idx ? { ...a, selected: i } : a)));
    };

    const validate = () => {
        if (current.selected === null || current.validated) return;
        setAnswers((prev) => prev.map((a, k) => (k === idx ? { ...a, validated: true } : a)));
    };

    const goTo = (i) => {
        setIdx(i);
        setFurthest((f) => Math.max(f, i));
    };

    const next = () => {
        if (isLast) {
            onFinish(answers);
        } else {
            goTo(idx + 1);
        }
    };

    return (
        <div className="relative mx-auto max-w-4xl">
            {/* عنصر خارج الشبكة: اسم الفصل عموديا */}
            <div
                aria-hidden
                className="absolute -left-10 top-1/2 hidden origin-left -rotate-90 lg:block"
            >
                <span className="whitespace-nowrap text-xs tracking-[0.35em] text-accent">
                    {chapterName}
                </span>
            </div>

            {/* الشريط العلوي */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs tracking-widest text-accent">{chapterName}</p>
                    <p className="font-display mt-1 text-xl font-bold">
                        السؤال {toArabicDigits(idx + 1)} من {toArabicDigits(session.length)}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onQuit}
                    className="flex min-h-[44px] items-center gap-2 border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                    <Flag className="h-4 w-4" />
                    إنهاء
                </button>
            </div>

            {/* شريط التقدم */}
            <div className="mt-4 h-[3px] w-full bg-border">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(validatedCount / session.length) * 100}%` }}
                />
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_200px]">
                {/* منطقة السؤال */}
                <div className="min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            <p className="text-xs tracking-widest text-muted-foreground">
                                س {toArabicDigits(idx + 1)}
                            </p>
                            <h2 className="font-display mt-2 text-2xl font-bold leading-relaxed text-foreground sm:text-3xl">
                                {q.question}
                            </h2>

                            {/* الخيارات */}
                            <div className="mt-8 border-y border-border">
                                {q.options.map((opt, i) => {
                                    const isSelected = current.selected === i;
                                    const isCorrect = q.answer === i;
                                    const showState = current.validated;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => select(i)}
                                            disabled={current.validated}
                                            className={cn(
                                                'flex w-full items-center gap-4 border-t border-border/60 px-2 py-4 text-right transition-colors first:border-t-0',
                                                !showState && 'hover:bg-secondary/60',
                                                !showState && isSelected && 'bg-secondary/70',
                                                showState && isCorrect && 'bg-primary/10',
                                                showState && isSelected && !isCorrect && 'bg-accent/10',
                                                showState && !isCorrect && !isSelected && 'opacity-50'
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'flex h-8 w-8 shrink-0 items-center justify-center border font-display text-base',
                                                    !showState && isSelected
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-border text-muted-foreground',
                                                    showState && isCorrect &&
                                                        'border-primary bg-primary text-primary-foreground',
                                                    showState && isSelected && !isCorrect &&
                                                        'border-accent bg-accent text-accent-foreground'
                                                )}
                                            >
                                                {OPTION_LETTERS[i]}
                                            </span>
                                            <span className="font-display flex-1 text-lg leading-relaxed">
                                                {opt}
                                            </span>
                                            {showState && isCorrect && (
                                                <Check className="h-5 w-5 shrink-0 text-primary" />
                                            )}
                                            {showState && isSelected && !isCorrect && (
                                                <X className="h-5 w-5 shrink-0 text-accent" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* التغذية الراجعة */}
                            {current.validated && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className={cn(
                                        'mt-6 border-s-2 ps-4',
                                        current.selected === q.answer ? 'border-primary' : 'border-accent'
                                    )}
                                >
                                    <p
                                        className={cn(
                                            'font-display text-lg font-bold',
                                            current.selected === q.answer ? 'text-primary' : 'text-accent'
                                        )}
                                    >
                                        {current.selected === q.answer ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                                    </p>
                                    {current.selected !== q.answer && (
                                        <p className="mt-1 text-sm text-foreground">
                                            الجواب الصحيح:{' '}
                                            <span className="font-semibold">{q.options[q.answer]}</span>
                                        </p>
                                    )}
                                    {q.explanation && (
                                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                            {q.explanation}
                                        </p>
                                    )}
                                </motion.div>
                            )}

                            {/* أزرار التحكم */}
                            <div className="mt-8 flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => goTo(idx - 1)}
                                    disabled={idx === 0}
                                    className="flex min-h-[44px] items-center gap-2 border border-border px-5 py-2.5 text-sm transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                    السابق
                                </button>
                                {!current.validated ? (
                                    <button
                                        type="button"
                                        onClick={validate}
                                        disabled={current.selected === null}
                                        className="min-h-[44px] border border-primary bg-primary px-8 py-2.5 font-display text-lg font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        تحقق
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={next}
                                        className="flex min-h-[44px] items-center gap-2 border border-primary bg-primary px-8 py-2.5 font-display text-lg font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                                    >
                                        {isLast ? 'عرض النتيجة' : 'التالي'}
                                        <ArrowLeft className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* خريطة الأسئلة */}
                <aside className="lg:border-s lg:border-border lg:ps-6">
                    <p className="text-xs tracking-widest text-muted-foreground">خريطة الأسئلة</p>
                    <div className="mt-3 grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-5">
                        {session.map((item, i) => {
                            const a = answers[i];
                            const reachable = i <= furthest;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => reachable && goTo(i)}
                                    disabled={!reachable}
                                    className={cn(
                                        'flex h-8 w-8 items-center justify-center border text-xs transition-colors',
                                        i === idx && 'border-primary ring-1 ring-primary',
                                        a.validated && a.selected === item.answer &&
                                            'border-primary bg-primary text-primary-foreground',
                                        a.validated && a.selected !== item.answer &&
                                            'border-accent bg-accent text-accent-foreground',
                                        !a.validated && 'border-border text-muted-foreground',
                                        !reachable && 'cursor-not-allowed opacity-40'
                                    )}
                                >
                                    {toArabicDigits(i + 1)}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-4 space-y-1.5 text-[11px] text-muted-foreground">
                        <p className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 bg-primary" /> إجابة صحيحة
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 bg-accent" /> إجابة خاطئة
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 border border-border" /> لم يجب بعد
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default QuizScreen;
