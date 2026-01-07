"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tunerFormSchema, type TunerFormData } from "@/validators/tuner-form"

interface TunerFormProps {
  onSubmit: (data: TunerFormData) => void
  isLoading?: boolean
}

export function TunerForm({ onSubmit, isLoading }: TunerFormProps) {
  const form = useForm<TunerFormData>({
    resolver: zodResolver(tunerFormSchema),
    defaultValues: {
      memory: "",
      cpus: "",
      profile: "default",
      dryRun: true,
    },
  })

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>TimescaleDB Tuning Configuration</CardTitle>
        <CardDescription>
          Configure your system specifications to generate optimized TimescaleDB settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="memory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memory (GB)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 8"
                      type="number"
                      min="1"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Total system memory in gigabytes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPU Cores</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 4"
                      type="number"
                      min="1"
                      max="128"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of CPU cores available
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tuning Profile</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tuning profile" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="promscale">Promscale</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the optimization profile for your use case
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="dryRun"
                checked={form.watch("dryRun")}
                onChange={(e) => form.setValue("dryRun", e.target.checked)}
                className="rounded"
              />
              <label htmlFor="dryRun" className="text-sm font-medium">
                Dry run (preview only, don&apos;t apply changes)
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Configuration"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}