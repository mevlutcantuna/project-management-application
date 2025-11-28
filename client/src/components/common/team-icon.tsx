import { cn } from "@/shared/lib/utils";
import { COLORS, ICONS } from "./icon-picker/constants";

interface TeamIconProps extends React.ComponentProps<"div"> {
  iconName?: keyof typeof ICONS;
  color?: (typeof COLORS)[keyof typeof COLORS];
  size?: "sm" | "md" | "lg";
}

const TeamIcon = ({
  iconName = "Building",
  color = COLORS.blueGray,
  className,
  size = "md",
  ...props
}: TeamIconProps) => {
  const Icon = ICONS[iconName as keyof typeof ICONS];

  const sizeClass = {
    sm: "h-3.5 w-3.5 [&>svg]:!size-3",
    md: "h-4.5 w-4.5 [&>svg]:!size-3.5",
    lg: "h-6 w-6 [&>svg]:!size-5",
  }[size];

  return (
    <div
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
      }}
      className={cn(
        "flex aspect-square items-center justify-center rounded-sm",
        className,
        sizeClass
      )}
      {...props}
    >
      <Icon color={color} className="sub-menu-icon" />
    </div>
  );
};

export default TeamIcon;
