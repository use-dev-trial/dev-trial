'use client';

// import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { createOrganization } from '@/actions/clerk';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { CreateOrganizationResponse, createOrganizationRequestSchema } from '@/types/clerk';

// import { ROUTES } from '@/lib/constants';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Organization name must be at least 2 characters.',
  }),
});

export default function SettingsPage() {
  const { user } = useUser();
  // const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const createOrganizationRequest = createOrganizationRequestSchema.parse({
      user_id: user?.id,
      name: values.name,
    });
    const createOrganizationResponse: CreateOrganizationResponse =
      await createOrganization(createOrganizationRequest);
    console.log(createOrganizationResponse.id);
    // router.push(ROUTES.CHALLENGES);
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Create an Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="DevTrial" {...field} />
                    </FormControl>
                    <FormDescription>
                      The organization name will be seen by candidates.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
