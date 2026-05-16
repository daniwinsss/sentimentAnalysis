function SectionHeading({ label, title, description }) {
  return (
    <div className="space-y-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
        {label}
      </p>
      <h2 className="text-4xl font-medium tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-white/40">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default SectionHeading
