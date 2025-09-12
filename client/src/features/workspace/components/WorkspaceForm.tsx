import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const workspaceFormSchema = z.object({
  name: z.string().min(1, { message: "Workspace is required" }),
  url: z.string().min(1, { message: "URL is required" }),
  description: z.string().optional(),
});

export type WorkspaceFormSchema = z.infer<typeof workspaceFormSchema>;

const WorkspaceForm = ({
  onSubmit,
}: {
  onSubmit: (data: WorkspaceFormSchema) => void;
}) => {
  const form = useForm<WorkspaceFormSchema>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
    },
  });

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name" className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="URL" className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Description"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="w-full"
          >
            Create Workspace
          </Button>
        </form>
      </Form>

      <div className="mt-10 text-center">
        <p className="text-muted-foreground text-sm">
          Already have a workspace?{" "}
          <a href="/" className="text-primary font-medium hover:underline">
            Join one
          </a>
        </p>
      </div>
    </div>
  );
};

export default WorkspaceForm;
