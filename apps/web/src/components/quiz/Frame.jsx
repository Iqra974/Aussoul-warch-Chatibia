const Frame = () => (
    <>
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-30" />
        <div aria-hidden className="pointer-events-none fixed inset-2 z-40 border-[3px] border-primary/70 sm:inset-3" />
        <div aria-hidden className="pointer-events-none fixed inset-4 z-40 border border-primary/60 sm:inset-6" />
    </>
);

export default Frame;
