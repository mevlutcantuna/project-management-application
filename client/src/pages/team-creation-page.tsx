import {
  IconPicker,
  IconPickerContent,
  IconPickerTrigger,
  type IconPickerValue,
} from "@/components/common/icon-picker";
import { COLORS, ICONS } from "@/components/common/icon-picker/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const TeamCreationPage = () => {
  const [value, setValue] = useState<IconPickerValue>({
    icon: "Briefcase",
    color: COLORS.blueGray,
  });

  const Icon = ICONS[value.icon];

  return (
    <div className="mx-10 my-16 flex items-start justify-center">
      <div className="w-full max-w-[40rem]">
        <div className="mb-8 space-y-1">
          <h1 className="text-primary text-2xl leading-8 font-medium">
            Create a new team
          </h1>
          <p className="text-muted-foreground text-sm leading-[22px]">
            Create a new team to manage separate cycles, workflows and
            notifications
          </p>
        </div>

        <Card className="gap-0 px-4 py-0">
          <div className="flex items-center justify-between py-3">
            <label htmlFor="icon" className="text-primary text-sm">
              Team icon
            </label>

            <IconPicker value={value} onChange={setValue}>
              <IconPickerTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-secondary group aspect-square h-8 w-8 rounded-sm p-0"
                  style={{
                    color: value.color,
                  }}
                >
                  <Icon className="group-hover:text-primary size-6 transition-colors duration-100" />
                </Button>
              </IconPickerTrigger>
              <IconPickerContent />
            </IconPicker>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <label htmlFor="name" className="text-primary text-sm">
              Team name
            </label>

            <Input
              className="max-w-44"
              id="name"
              placeholder="e.g. Engineering"
            />
          </div>
        </Card>

        <IconPicker value={value} onChange={setValue}>
          <IconPickerTrigger asChild>
            <Button variant="outline">deneme</Button>
          </IconPickerTrigger>
          <IconPickerContent />
        </IconPicker>
      </div>
    </div>
  );
};

export default TeamCreationPage;
