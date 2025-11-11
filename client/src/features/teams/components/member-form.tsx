import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddUserToTeamMutation } from "../api/mutations";
import { useWorkspaceStore } from "@/features/workspace/store";
import type { Team } from "@/shared/types/team";

const memberFormSchema = z.object({
  email: z
    .string()
    .refine(
      (val) => val.split(",").filter((email) => email.trim() !== "").length > 0,
      {
        message: "Enter at least one email address",
      }
    )
    .refine(
      (val) =>
        val
          .split(",")
          .filter((email) => email.trim() !== "")
          .every((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())),
      {
        message: "Enter valid email addresses",
      }
    ),
});

export type MemberFormSchema = z.infer<typeof memberFormSchema>;

const MemberForm = ({
  team,
  onSuccess,
}: {
  team: Team;
  onSuccess?: () => void;
}) => {
  const { currentWorkspace } = useWorkspaceStore();
  const form = useForm<MemberFormSchema>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutateAsync: addUserToTeam } = useAddUserToTeamMutation();

  const onSubmit = async (data: MemberFormSchema) => {
    const emails = data.email.split(",").map((email) => email.trim());

    await Promise.all(
      emails.map((email) =>
        addUserToTeam({
          workspaceId: currentWorkspace?.id ?? "",
          teamId: team.id,
          email: email,
        })
      )
    );

    onSuccess?.();
    form.reset();
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="email@example.com, username@example.com..."
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button variant="primary" type="submit" size="sm">
            Add members
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MemberForm;
