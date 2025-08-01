
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/app/actions/auth";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "New password must be at least 6 characters." }),
  adminCode: z.string().min(1, { message: "Secret code is required." }),
});

export function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", adminCode: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    const result = await resetPassword(values);

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Password Reset Successful",
        description: result.message,
      });
      router.push('/login');
    } else {
        toast({
            variant: "destructive",
            title: "Password Reset Failed",
            description: result.message,
        })
    }
  }

  return (
    <>
        <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Forgot Password</CardTitle>
            <CardDescription>Enter your email and the secret code to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="user@example.com" {...field} />
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
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                control={form.control}
                name="adminCode"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Secret Code</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Secret admin code" {...field} />
                        </FormControl>
                         <FormDescription>
                           A secret code is required to reset a password.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
                </Button>
            </form>
            </Form>
        </CardContent>
        </Card>
        <div className="mt-4 text-center text-sm">
            Remember your password?{' '}
            <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/login">
                Login
            </Link>
            </Button>
        </div>
    </>
  );
}
