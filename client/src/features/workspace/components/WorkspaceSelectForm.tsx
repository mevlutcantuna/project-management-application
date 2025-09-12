import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import WorkspaceSelect from "./WorkspaceSelect";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

const workspaceSelectFormSchema = z.object({
  workspace: z.string().min(1, { message: "Workspace is required" }),
});

type WorkspaceSelectFormSchema = z.infer<typeof workspaceSelectFormSchema>;

const WorkspaceSelectForm = () => {
  const navigate = useNavigate();
  const form = useForm<WorkspaceSelectFormSchema>({
    resolver: zodResolver(workspaceSelectFormSchema),
    defaultValues: {
      workspace: "",
    },
  });

  const onSubmit = (data: WorkspaceSelectFormSchema) => {
    navigate(`/${data.workspace}`);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="workspace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace</FormLabel>
                <FormControl>
                  <WorkspaceSelect
                    onChange={(workspace) => {
                      field.onChange(workspace?.url ?? "");
                    }}
                    value={field.value}
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
            Continue
          </Button>
        </form>
      </Form>

      <div className="mt-10 text-center">
        <p className="text-muted-foreground text-sm">
          Don't have a workspace?{" "}
          <Link to="/join" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default WorkspaceSelectForm;
