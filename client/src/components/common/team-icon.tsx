import { cn } from "@/shared/lib/utils";
import { ICONS } from "./icon-picker/constants";

interface TeamIconProps extends React.ComponentProps<"div"> {
  iconName: keyof typeof ICONS;
  color: string;
}

const TeamIcon = ({ iconName, color, className, ...props }: TeamIconProps) => {
  const Icon = ICONS[iconName as keyof typeof ICONS];
  return (
    <div
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
      }}
      className={cn(
        "flex aspect-square h-4.5 w-4.5 items-center justify-center rounded-sm",
        className
      )}
      {...props}
    >
      <Icon color={color} className="sub-menu-icon" />
    </div>
  );
};

export default TeamIcon;
