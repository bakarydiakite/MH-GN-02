interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  body: string;
  align?: "left" | "center";
  light?: boolean;
}

export const SectionTitle = ({ 
  eyebrow, 
  title, 
  body, 
  align = "left", 
  light = false 
}: SectionTitleProps) => {
  const alignment = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl";
  const bodyColor = light ? "text-slate-300" : "text-slate-600";

  return (
    <div className={alignment}>
      {eyebrow && (
        <span className={`eyebrow ${light ? "border-white/15 bg-white/10 text-white" : ""}`}>
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-5 font-display text-3xl font-bold tracking-tight md:text-5xl ${
          light ? "text-white" : "text-[#153f6f]"
        }`}
      >
        {title}
      </h2>
      <p className={`mt-4 text-base leading-8 md:text-lg ${bodyColor}`}>{body}</p>
    </div>
  );
};

export default SectionTitle;
