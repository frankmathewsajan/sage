import { type ReactNode } from "react";

/**
 * Reusable badge component for consistent styling
 */
interface BadgeProps {
  variant: "success" | "info" | "warning" | "error";
  icon?: string;
  children: ReactNode;
}

export function Badge({ variant, icon, children }: BadgeProps) {
  const variants = {
    success: "bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700",
    info: "bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700",
    warning: "bg-linear-to-r from-amber-100 to-orange-100 text-amber-700",
    error: "bg-linear-to-r from-red-100 to-rose-100 text-red-700",
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${variants[variant]}`}>
      {icon && <i className={`${icon} mr-1`} aria-hidden />}
      {children}
    </span>
  );
}

/**
 * Reusable button component for consistent styling
 */
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  onClick,
  type = "button",
  disabled,
  children,
  className = "",
}: ButtonProps) {
  const variants = {
    primary: "bg-linear-to-r from-blue-50 to-cyan-50 border-slate-300 text-slate-700 hover:border-blue-500 hover:from-blue-100 hover:to-cyan-100 hover:text-blue-600",
    secondary: "bg-linear-to-r from-slate-50 to-gray-50 border-slate-300 text-slate-700 hover:from-slate-100 hover:to-gray-100",
    danger: "bg-linear-to-r from-red-50 to-rose-50 border-red-300 text-red-700 hover:border-red-500 hover:from-red-100 hover:to-rose-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-lg border font-semibold shadow-sm transition hover:shadow whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <i className={`${icon} text-xs`} aria-hidden />}
      {children}
    </button>
  );
}

/**
 * Reusable card component for consistent container styling
 */
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${
        hover ? "transition hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
