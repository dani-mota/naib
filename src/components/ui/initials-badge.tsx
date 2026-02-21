interface InitialsBadgeProps {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
}

const COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500",
  "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-orange-500",
];

function hashName(first: string, last: string): number {
  const str = `${first}${last}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const sizes = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

export function InitialsBadge({ firstName, lastName, size = "md" }: InitialsBadgeProps) {
  const colorIndex = hashName(firstName, lastName) % COLORS.length;

  return (
    <div className={`${sizes[size]} ${COLORS[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold`}>
      {firstName.charAt(0)}{lastName.charAt(0)}
    </div>
  );
}
