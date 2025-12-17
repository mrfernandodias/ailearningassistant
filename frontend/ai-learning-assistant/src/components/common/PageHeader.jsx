const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200/60">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};

export default PageHeader;
