import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLessonSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function LessonPlanner() {
  const { user } = useAuth();
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedYearGroup, setSelectedYearGroup] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(insertLessonSchema),
    defaultValues: {
      teacherId: user!.id,
      title: "",
      content: "",
      aiGenerated: true,
      createdAt: new Date()
    }
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { subject: string; yearGroup: string }) => {
      const res = await apiRequest("POST", "/api/lessons/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedLesson(data);
      // Format the lesson content
      const content = `
Objectives:
${data.objectives.map((obj: string) => `- ${obj}`).join('\n')}

Activities:
${data.activities.map((act: string) => `- ${act}`).join('\n')}

Assessment:
${data.assessment.map((ass: string) => `- ${ass}`).join('\n')}
      `.trim();

      form.setValue("title", data.title);
      form.setValue("content", content);
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/lessons", {
        ...data,
        teacherId: user!.id,
        aiGenerated: true,
        createdAt: new Date()
      });
      return res.json();
    }
  });

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography"
  ];

  const yearGroups = [
    "Reception",
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Year 5",
    "Year 6",
    "Year 7",
    "Year 8",
    "Year 9",
    "Year 10",
    "Year 11",
    "Year 12",
    "Year 13"
  ];

  const handleGenerate = () => {
    if (!selectedSubject || !selectedYearGroup) {
      return;
    }
    generateMutation.mutate({
      subject: selectedSubject,
      yearGroup: selectedYearGroup
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate New Lesson</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year Group</label>
              <Select onValueChange={setSelectedYearGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year group" />
                </SelectTrigger>
                <SelectContent>
                  {yearGroups.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !selectedSubject || !selectedYearGroup}
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Lesson Plan"
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedLesson && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review and Save Lesson</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson Content</FormLabel>
                      <FormControl>
                        <textarea 
                          {...field}
                          className="w-full min-h-[200px] p-2 border rounded-md"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Saving..." : "Save Lesson"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      )}
    </div>
  );
}