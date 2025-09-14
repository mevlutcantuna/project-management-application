import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLES } from "@/shared/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const invitationFormSchema = z.object({
  email: z.string({ message: "Email is required" }).email({
    message: "Invalid email address",
  }),
  role: z.enum(USER_ROLES, {
    message: "Role is required",
  }),
});

export type InvitationFormSchema = z.infer<typeof invitationFormSchema>;

const InvitationForm = ({
  onSubmit,
}: {
  onSubmit: (data: InvitationFormSchema) => void;
}) => {
  const form = useForm<InvitationFormSchema>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      email: "",
      role: undefined,
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form, form.formState.isSubmitSuccessful]);

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            Send Invitation
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InvitationForm;
