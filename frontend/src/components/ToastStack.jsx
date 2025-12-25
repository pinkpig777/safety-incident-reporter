const TOAST_STYLES = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-slate-200 bg-white text-slate-900",
};

export function ToastStack({ toasts, onDismiss }) {
  if (!toasts?.length) return null;

  return (
    <div className="fixed right-4 top-4 z-50 flex w-80 max-w-[90vw] flex-col gap-3">
      {toasts.map((toast) => {
        const variant = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
        const title =
          toast.type === "success"
            ? "Success"
            : toast.type === "error"
              ? "Action failed"
              : "Update";

        return (
          <div
            key={toast.id}
            role="status"
            className={`toast-enter rounded-xl border px-4 py-3 shadow-lg ${variant}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  {title}
                </p>
                <p className="mt-1 text-sm">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss?.(toast.id)}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 transition hover:text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
