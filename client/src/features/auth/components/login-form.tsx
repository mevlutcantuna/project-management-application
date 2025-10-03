import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, getErrorMessage } from "@/shared/lib/utils";
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
import { useLoginMutation } from "../api/mutations";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useState } from "react";
import { TokenService } from "@/shared/lib/token";
import { useAuthStore } from "../store";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

interface LoginForm {
  className?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

const LoginForm = ({ className, onSuccess, onError }: LoginForm) => {
  const [formError, setFormError] = useState<string | null>(null);
  const { login: loginStore } = useAuthStore();
  const { setAccessToken, setRefreshToken, setTokenExpiry } = TokenService;

  const { mutate: login, isPending } = useLoginMutation({
    onSuccess: (data) => {
      const { accessToken, refreshToken, expiresIn } = data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setTokenExpiry(expiresIn);
      loginStore(data.user, accessToken);

      onSuccess?.();
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        setFormError(getErrorMessage(error));
      }
      onError?.();
    },
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login(data);
  };

  return (
    <div className={cn("w-full", className)}>
      <Form {...form}>
        <form
          className="space-y-3"
          onChange={() => setFormError(null)}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
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
                {formError && (
                  <p className="text-destructive text-sm">{formError}</p>
                )}
              </FormItem>
            )}
          />
          <Button className="h-10 w-full" disabled={isPending} type="submit">
            Login
          </Button>
        </form>
      </Form>

      <div className="mt-10 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
