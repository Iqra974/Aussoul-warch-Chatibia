import React, { useMemo } from 'react';
import { FilePlus2, RotateCcw } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { chapters } from '@/data/questions';
import { toArabicDigits } from '@/lib/arabic';

const MEDALLION_URL = 'https://images.hostinger.com/3861da05-32f4-46a9-a8f9-fea91b7651a0.png';

const gradeMessage = (pct) => {
    if (pct >= 90) return 'ممتاز — إتقان تام لأحكام باب الأصول.';
    if (pct >= 70) return 'جيد جدا — راجع المواضع التي أخطأت فيها.';
    if (pct >= 50) return 'مقبول — تحتاج إلى مزيد من التدريب.';
    return 'تحتاج إلى مراجعة الأحكام ثم أعد المحاولة.';
};

const ResultsScreen = ({ session, answers, onRetry, onNew }) => {
    const score = useMemo(
        () => answers.filter((a, i) => a.validated && a.selected === session[i].answer).length,
        [answers, session]
    );
    const total = session.length;
    const pct = total ? Math.round((score / total) * 100) : 0;

    const perChapter = useMemo(() => {
        const map = {};
        session.forEach((q, i) => {
            if (!map[q.chapter]) map[q.chapter] = { total: 0, correct: 0 };
            map[q.chapter].total += 1;
            if (answers[i]?.validated && answers[i].selected === q.answer) {
                map[q.chapter].correct += 1;
            }
        });
        return Object.entries(map).map(([id, v]) => ({
            id: Number(id),
            name: chapters.find((ch) => ch.id === Number(id))?.name || '',
            ...v,
        }));
    }, [session, answers]);

    return (
        <div className="relative mx-auto max-w-2xl text-center">
            {/* عنصر خارج الشبكة */}
            <div
                aria-hidden
                className="absolute -left-6 top-24 hidden origin-left -rotate-90 lg:block"
            >
                <span className="whitespace-nowrap text-xs tracking-[0.35em] text-accent">
                    خاتمة الاختبار
                </span>
            </div>

            <Reveal>
                <figure className="mx-auto w-28">
                    <img
                        src={MEDALLION_URL}
                        alt="شمسية زخرفية بأسلوب المخطوطات"
                        className="w-full mix-blend-multiply"
                    />
                    <figcaption className="mt-1 text-[11px] tracking-widest text-muted-foreground">
                        لوحة 2 — شمسية
                    </figcaption>
                </figure>

                <h1 className="font-display mt-6 text-3xl font-bold sm:text-4xl">النتيجة</h1>
                <p className="font-display mt-4 text-7xl font-bold text-primary">
                    {toArabicDigits(pct)}٪
                </p>
                <p className="mt-2 text-lg text-foreground">
                    أجبت بشكل صحيح على{' '}
                    <span className="font-display font-bold text-primary">
                        {toArabicDigits(score)}
                    </span>{' '}
                    من{' '}
                    <span className="font-display font-bold">{toArabicDigits(total)}</span> سؤالا
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{gradeMessage(pct)}</p>
            </Reveal>

            <div className="rule-double mt-10" />

            <Reveal delay={0.1}>
                <section className="mt-8 text-right">
                    <h2 className="font-display text-xl font-bold">التفصيل حسب الفصول</h2>
                    <div className="mt-4 border-y border-border">
                        {perChapter.map((row) => (
                            <div
                                key={row.id}
                                className="flex items-baseline border-t border-border/60 py-2.5 first:border-t-0"
                            >
                                <span className="w-8 shrink-0 text-sm text-muted-foreground">
                                    {toArabicDigits(row.id)}.
                                </span>
                                <span className="font-display text-lg">{row.name}</span>
                                <span className="leader-dots" />
                                <span className="text-sm">
                                    <span className="font-semibold text-primary">
                                        {toArabicDigits(row.correct)}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {' '}
                                        / {toArabicDigits(row.total)}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </Reveal>

            <Reveal delay={0.15}>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={onRetry}
                        className="flex min-h-[44px] items-center gap-2 border border-primary bg-primary px-8 py-3 font-display text-lg font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                    >
                        <RotateCcw className="h-5 w-5" />
                        إعادة الاختبار
                    </button>
                    <button
                        type="button"
                        onClick={onNew}
                        className="flex min-h-[44px] items-center gap-2 border border-border px-8 py-3 font-display text-lg transition-colors hover:border-primary/50 active:scale-[0.98]"
                    >
                        <FilePlus2 className="h-5 w-5" />
                        اختبار جديد
                    </button>
                </div>
            </Reveal>
        </div>
    );
};

export default ResultsScreen;
