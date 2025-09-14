import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, getErrorMessage } from "@/shared/lib/utils";
import { useSignupMutation } from "../api/mutations";
import { toast } from "sonner";
import type { SignupResponse } from "../api/types";
import { AxiosError } from "axios";

const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain lowercase, uppercase, and number"
      ),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain lowercase, uppercase, and number"
      ),
    terms: z.boolean().refine((val) => val, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface SignupForm {
  className?: string;
  onSuccess?: (data: SignupResponse) => void;
  onError?: () => void;
}

const SignupForm = ({ className, onSuccess, onError }: SignupForm) => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: signup, isPending } = useSignupMutation({
    onSuccess: (data: unknown) => {
      toast.success("Success", {
        description: "You have successfully signed up",
      });
      onSuccess?.(data as SignupResponse);
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        form.setError("email", {
          message: getErrorMessage(error),
        });
      }
      onError?.();
    },
  });

  const onSubmit = (data: z.infer<typeof signupSchema>) => {
    signup({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className={cn("w-full", className)}>
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input className="h-10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input className="h-10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Terms and Conditions</FormLabel>
              </FormItem>
            )}
          />

          <Button className="h-10 w-full" type="submit" disabled={isPending}>
            Sign up
          </Button>
        </form>
      </Form>

      <div className="mt-10 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
