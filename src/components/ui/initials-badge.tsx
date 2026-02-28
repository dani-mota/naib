interface InitialsBadgeProps {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
}

const COLORS = [
  "bg-aci-blue", "bg-emerald-600", "bg-amber-600", "bg-purple-600",
  "bg-rose-600", "bg-cyan-600", "bg-indigo-600", "bg-orange-600",
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
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-12 h-12 text-sm",
};

export function InitialsBadge({ firstName, lastName, size = "md" }: InitialsBadgeProps) {
  const colorIndex = hashName(firstName, lastName) % COLORS.length;

  return (
    <div className={`${sizes[size]} ${COLORS[colorIndex]} flex items-center justify-center text-white font-semibold`}>
      {firstName.charAt(0)}{lastName.charAt(0)}
    </div>
  );
}
