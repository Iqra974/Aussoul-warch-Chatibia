import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence, motion } from 'framer-motion';
import Frame from '@/components/quiz/Frame';
import StartScreen from '@/components/quiz/StartScreen';
import QuizScreen from '@/components/quiz/QuizScreen';
import ResultsScreen from '@/components/quiz/ResultsScreen';
import { questions } from '@/data/questions';

const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const buildSession = ({ chapter, count }) => {
    let pool = chapter === 'all' ? questions : questions.filter((q) => q.chapter === chapter);
    pool = shuffle(pool).slice(0, Math.min(count, pool.length));
    return pool.map((q) => {
        const order = shuffle(q.options.map((_, i) => i));
        return {
            ...q,
            options: order.map((i) => q.options[i]),
            answer: order.indexOf(q.answer),
        };
    });
};

const HomePage = () => {
    const [stage, setStage] = useState('start');
    const [config, setConfig] = useState(null);
    const [session, setSession] = useState([]);
    const [result, setResult] = useState(null);

    const startQuiz = (cfg) => {
        setConfig(cfg);
        setSession(buildSession(cfg));
        setResult(null);
        setStage('quiz');
    };

    const finishQuiz = (answers) => {
        setResult(answers);
        setStage('results');
    };

    const retry = () => {
        setSession(buildSession(config));
        setResult(null);
        setStage('quiz');
    };

    const newQuiz = () => {
        setResult(null);
        setStage('start');
    };

    return (
        <div className="min-h-[100dvh]">
            <Helmet>
                <title>ورش من طريق الشاطبية | اختبر نفسك في باب الأصول</title>
                <meta
                    name="description"
                    content="منصة تدريب بالأسئلة الاختيارية على أحكام رواية ورش من طريق الشاطبية — باب الأصول: مئات الأسئلة مع التصحيح الفوري والشرح وتتبع النتيجة."
                />
            </Helmet>
            <Frame />
            <main className="px-8 py-10 sm:px-14 sm:py-14">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stage}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {stage === 'start' && <StartScreen onStart={startQuiz} />}
                        {stage === 'quiz' && (
                            <QuizScreen
                                session={session}
                                onFinish={finishQuiz}
                                onQuit={newQuiz}
                            />
                        )}
                        {stage === 'results' && (
                            <ResultsScreen
                                session={session}
                                answers={result}
                                onRetry={retry}
                                onNew={newQuiz}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
                <footer className="mx-auto mt-16 max-w-3xl border-t border-border pt-4 text-center text-xs text-muted-foreground">
                    رواية ورش من طريق الشاطبية — باب الأصول · منصة تدريب بالأسئلة الاختيارية ·{' '}
                    {new Date().getFullYear()}
                </footer>
            </main>
        </div>
    );
};

export default HomePage;
