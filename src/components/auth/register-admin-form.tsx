
"use client";

import { useState } from "react";
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
import { registerUser } from "@/app/actions/auth";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  adminCode: z.string().min(1, { message: "Admin code is required to register an admin." }),
});

export function RegisterAdminForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      adminCode: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const result = await registerUser({...values, role: 'admin'});
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Admin Registered",
        description: `Admin ${values.name} has been created successfully.`,
      });
      form.reset(); 
    } else {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: result.message,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Register New Admin</CardTitle>
        <CardDescription>Create a new account for an administrator.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
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
                        <FormLabel>Admin Code</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Secret admin code" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Registering...' : 'Register Admin'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
