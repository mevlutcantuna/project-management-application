import React, { createContext, useContext, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { COLORS, ICONS } from "./constants";
import { PopoverClose } from "@radix-ui/react-popover";

export interface IconPickerValue {
  icon: keyof typeof ICONS;
  color: (typeof COLORS)[keyof typeof COLORS];
}

interface IconPickerProps extends React.ComponentProps<typeof Popover> {
  value: IconPickerValue;
  onChange: (value: IconPickerValue) => void;
}

interface IconPickerContextValue {
  value: IconPickerValue;
  onChange: (value: IconPickerValue) => void;
}

const IconPickerContext = createContext<IconPickerContextValue | undefined>(
  undefined
);

function useIconPicker() {
  const context = useContext(IconPickerContext);
  if (!context) {
    throw new Error("useIconPicker must be used within an IconPicker");
  }
  return context;
}

function IconPicker({ value, onChange, ...props }: IconPickerProps) {
  return (
    <IconPickerContext.Provider value={{ value, onChange }}>
      <Popover data-slot="icon-picker" {...props} />
    </IconPickerContext.Provider>
  );
}

function IconPickerTrigger({
  ...props
}: React.ComponentProps<typeof PopoverTrigger>) {
  return <PopoverTrigger data-slot="icon-picker-trigger" {...props} />;
}

function IconPickerContent({
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  const { value = { icon: undefined, color: COLORS.blueGray }, onChange } =
    useIconPicker();
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    return Object.keys(ICONS).filter((icon) =>
      icon.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <PopoverContent
      className="px-0 pt-0"
      data-slot="icon-picker-content"
      {...props}
    >
      <div className="border-active-tab relative mx-2 -mb-px h-full w-fit border-b-2 px-3 pt-[7px] pb-1 text-[13px]">
        Icons
      </div>

      <div className="border-border mb-4 border-t" />

      <div className="grid grid-cols-8 gap-2 px-4">
        {Object.values(COLORS).map((color) => (
          <button
            style={{
              backgroundColor: color,
              outlineColor: color,
            }}
            onClick={() => onChange({ icon: value.icon!, color })}
            className="flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full hover:outline-1 hover:outline-offset-1"
          >
            {value.color === color && <Check className="size-4 text-white" />}
          </button>
        ))}
      </div>

      <div className="border-border mt-4 border-t" />

      <div className="px-2 py-[5px]">
        <input
          placeholder="Search icons..."
          className="h-7 w-full px-2.5 py-1.5 text-[13px] outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border-border mb-4 border-t" />

      <div className="grid max-h-40 grid-cols-10 gap-x-2 overflow-y-auto px-3">
        {filteredIcons.map((icon) => {
          const Icon = ICONS[icon as keyof typeof ICONS];
          return (
            <PopoverClose asChild>
              <button
                style={{
                  color: value.color,
                  backgroundColor:
                    value.icon === icon
                      ? `color-mix(in srgb, ${value.color} 10%, transparent)`
                      : "transparent",
                  ["--hover-bg" as string]: `color-mix(in srgb, ${value.color} 10%, transparent)`,
                }}
                className="hover:!text-primary flex h-7 w-7 items-center justify-center rounded-md p-1.5 transition-colors duration-150 hover:[background-color:var(--hover-bg)]"
                key={icon}
                onClick={() =>
                  onChange({
                    icon: icon as keyof typeof ICONS,
                    color: value.color,
                  })
                }
              >
                <Icon className="size-3.5 cursor-pointer" />
              </button>
            </PopoverClose>
          );
        })}
      </div>
    </PopoverContent>
  );
}

export { IconPicker, IconPickerTrigger, IconPickerContent };
