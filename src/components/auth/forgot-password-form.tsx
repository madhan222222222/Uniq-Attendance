
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resetPasswordWithAdminCode } from "@/app/actions/admin";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  code: z.string().min(1, { message: "Secret code is required." }),
});

export function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", newPassword: "", code: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    const result = await resetPasswordWithAdminCode(values);

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
            <CardTitle className="font-headline text-2xl">Reset Password</CardTitle>
            <CardDescription>Enter the user's email, a new password, and the secret code.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  name="newPassword"
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
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret Code</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter secret code" {...field} />
                      </FormControl>
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
