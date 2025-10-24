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
import { useAuthStore } from "@/features/auth/store";
import { useCreateTeamMutation } from "@/features/teams/api/mutations";
import { useWorkspaceStore } from "@/features/workspace/store";
import { getErrorMessage } from "@/shared/lib/utils";
import type { ErrorResponse } from "@/shared/types/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
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

type FormSchema = z.infer<typeof formSchema>;

const TeamCreationPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();
  const { user: currentUser } = useAuthStore();
  const { mutate: createTeam } = useCreateTeamMutation({
    onSuccess: (data) => {
      toast.success("Team created successfully");
      navigate(`/${currentWorkspace?.url}/settings/team/${data.identifier}`);
      queryClient.invalidateQueries({ queryKey: ["workspace-teams"] });
    },
    onError: (error) => {
      toast.error("Failed to create team", {
        description: getErrorMessage(error as ErrorResponse),
      });
    },
  });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      identifier: "",
      icon: {
        icon: "Building",
        color: COLORS.blueGray,
      },
    },
  });

  const onSubmit = (data: FormSchema) => {
    if (!currentWorkspace?.id || !currentUser?.id) return;

    createTeam({
      name: data.name,
      identifier: data.identifier,
      iconName: data.icon.icon,
      color: data.icon.color,
      workspaceId: currentWorkspace.id,
    });
  };

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

        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="gap-0 px-4 py-0">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => {
                  const Icon = ICONS[field.value.icon as keyof typeof ICONS];

                  return (
                    <div className="flex items-center justify-between py-3">
                      <label htmlFor="icon" className="text-primary text-sm">
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

              <Separator />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex flex-col gap-1">
                          <FormLabel>Team name</FormLabel>
                          <FormMessage />
                        </div>
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

              <Separator />

              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex flex-col gap-1">
                          <FormLabel>Identifier</FormLabel>
                          <FormMessage />
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
            </Card>

            <div className="mt-12 flex justify-end">
              <Button variant="primary" type="submit" size="sm">
                Create Team
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TeamCreationPage;
