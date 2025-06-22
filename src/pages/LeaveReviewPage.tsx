import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ReviewService, ReviewData } from '@/services/reviewService';

const reviewSchema = z.object({
  comment: z.string().min(10, 'Votre avis doit contenir au moins 10 caractères.'),
  rating: z.number().min(1).max(5),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const LeaveReviewPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      comment: '',
      rating: 5,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ReviewData) => ReviewService.submitReview(data),
    onSuccess: () => {
      toast({ title: 'Avis envoyé', description: 'Merci pour votre retour !' });
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    }
  });


  const onSubmit = (data: ReviewFormData) => {
    const { comment, rating } = data;
    if (comment && rating) {
      mutate({ comment, rating });
    } else {
       toast({
        title: 'Erreur de validation',
        description: "L'avis et la note ne peuvent pas être vides.",
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
        <div className="container mx-auto py-10 text-center">
            <p>Veuillez vous connecter pour laisser un avis.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Donnez votre avis sur notre application</CardTitle>
          <CardDescription>
            Vos retours nous sont précieux pour nous améliorer.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Votre avis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Écrivez ce que vous pensez de l'application..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Envoyer mon avis'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default LeaveReviewPage; 