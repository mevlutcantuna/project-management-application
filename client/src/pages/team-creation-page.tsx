import {
  IconPicker,
  IconPickerContent,
  IconPickerTrigger,
  type IconPickerValue,
} from "@/components/common/icon-picker";
import { COLORS } from "@/components/common/icon-picker/constants";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TeamCreationPage = () => {
  const [value, setValue] = useState<IconPickerValue>({
    icon: "Briefcase",
    color: COLORS.blueGray,
  });
  return (
    <div>
      <IconPicker value={value} onChange={setValue}>
        <IconPickerTrigger asChild>
          <Button variant="outline">deneme</Button>
        </IconPickerTrigger>
        <IconPickerContent />
      </IconPicker>
    </div>
  );
};

export default TeamCreationPage;
