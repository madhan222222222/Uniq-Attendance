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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { registerUser } from "@/app/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { locations } from "@/lib/data";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["admin", "staff"], {
    required_error: "You need to select a role.",
  }),
  location: z.string().optional(),
  adminCode: z.string().optional(),
});

export function RegisterForm() {
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

  const selectedRole = form.watch("role");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (values.role === 'admin' && !values.adminCode) {
        form.setError("adminCode", { type: "manual", message: "Admin code is required to register an admin." });
        setIsLoading(false);
        return;
    }
     if (values.role === 'staff' && !values.location) {
        form.setError("location", { type: "manual", message: "Location is required for staff." });
        setIsLoading(false);
        return;
    }

    const result = await registerUser(values);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "User Registered",
        description: `User ${values.name} has been created successfully.`,
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
        <CardTitle className="font-headline text-2xl">Register New User</CardTitle>
        <CardDescription>Create a new account for an admin or staff member.</CardDescription>
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedRole === 'staff' && (
               <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            )}
            {selectedRole === 'admin' && (
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
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Registering...' : 'Register User'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
