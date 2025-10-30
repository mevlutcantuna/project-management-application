import {
  IconPicker,
  IconPickerContent,
  IconPickerTrigger,
  type IconPickerValue,
} from "@/components/common/icon-picker";
import { COLORS, ICONS } from "@/components/common/icon-picker/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const teamFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  identifier: z
    .string()
    .min(1, { message: "Identifier must be at least 1 character long" }),
  icon: z.object({
    icon: z.string().min(1),
    color: z.string().min(1),
  }),
});

export type TeamFormSchema = z.infer<typeof teamFormSchema>;

interface TeamFormProps {
  layoutType: "horizontal" | "vertical";
  onSubmit: (data: TeamFormSchema) => void;
  defaultValues?: Partial<TeamFormSchema>;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

const TeamForm = ({
  layoutType = "vertical",
  onSubmit,
  defaultValues,
  submitButtonText = "Create Team",
  isSubmitting = false,
}: TeamFormProps) => {
  const form = useForm<TeamFormSchema>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      identifier: "",
      icon: {
        icon: "Building",
        color: COLORS.blueGray,
      },
    },
  });

  const isHorizontal = useMemo(() => layoutType === "horizontal", [layoutType]);

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <Card
          className={cn(
            "flex flex-col gap-0 px-4 py-0",
            isHorizontal && "flex-row gap-4"
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-0",
              isHorizontal && "flex-col gap-1 pt-3"
            )}
          >
            <FormLabel className={cn(!isHorizontal && "hidden", "mb-1")}>
              Icon & Name
            </FormLabel>
            <div
              className={cn(
                "flex flex-col gap-0",
                isHorizontal && "flex-row gap-2.5"
              )}
            >
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => {
                  const Icon = ICONS[field.value.icon as keyof typeof ICONS];

                  return (
                    <div
                      className={cn(
                        "flex items-center justify-between py-3",
                        isHorizontal && "pt-0"
                      )}
                    >
                      <label
                        htmlFor="icon"
                        className={cn(
                          "text-primary text-sm",
                          isHorizontal && "hidden"
                        )}
                      >
                        Team icon
                      </label>
                      <IconPicker
                        value={field.value as IconPickerValue}
                        onChange={(e) => {
                          field.onChange({
                            icon: e.icon,
                            color: e.color,
                          });
                        }}
                      >
                        <IconPickerTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-secondary group aspect-square h-8 w-8 rounded-sm p-0"
                            style={{
                              color: field.value.color,
                            }}
                          >
                            <Icon className="group-hover:text-primary size-6 transition-colors duration-100" />
                          </Button>
                        </IconPickerTrigger>
                        <IconPickerContent />
                      </IconPicker>
                    </div>
                  );
                }}
              />

              {!isHorizontal && <Separator />}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div
                        className={cn(
                          "flex items-center justify-between py-3",
                          isHorizontal && "pt-0"
                        )}
                      >
                        {!isHorizontal && (
                          <div className="flex flex-col gap-1">
                            <FormLabel>Team name</FormLabel>
                            <FormMessage />
                          </div>
                        )}

                        <FormControl>
                          <Input
                            {...field}
                            inputSize="sm"
                            className="max-w-44"
                            placeholder="e.g. Engineering"
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          {!isHorizontal && <Separator />}

          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => {
              return (
                <FormItem>
                  <div
                    className={cn(
                      "flex items-center justify-between py-3",
                      isHorizontal && "flex-col items-start"
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <FormLabel className={cn(isHorizontal && "mb-1")}>
                        Identifier
                      </FormLabel>
                      <FormMessage className={cn(isHorizontal && "hidden")} />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                        }}
                        inputSize="sm"
                        className="max-w-44"
                        placeholder="e.g. ENG"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              );
            }}
          />

          {isHorizontal && form.formState.isDirty && (
            <div className="flex items-end py-3">
              <Button
                variant="primary"
                type="submit"
                size="sm"
                disabled={isSubmitting || form.formState.isSubmitting}
              >
                {submitButtonText}
              </Button>
            </div>
          )}
        </Card>

        <div className={cn("mt-12 flex justify-end", isHorizontal && "hidden")}>
          <Button
            variant="primary"
            type="submit"
            size="sm"
            disabled={isSubmitting || form.formState.isSubmitting}
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamForm;
