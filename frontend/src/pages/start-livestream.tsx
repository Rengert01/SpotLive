import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import socket from "@/config/socket"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TestArea from "@/components/test-area";
import { useEffect } from "react";
import { useUserStore } from "@/stores/user-store";

const startLivestreamSchema = z.object({
  title: z.string().min(2, { message: 'A Livestream Title is Required.' }),
  audioInput: z.enum(['microphone', 'obs'])
})

export default function StartLivestreamPage() {
  const { user } = useUserStore()
  const form = useForm<z.infer<typeof startLivestreamSchema>>({
    resolver: zodResolver(startLivestreamSchema),
    defaultValues: {
      title: ''
    }
  })

  const onSubmit = (data: z.infer<typeof startLivestreamSchema>) => {
    console.log(data)

    socket.emit('start-livestream', data.title, user.id, (response: { success: boolean; id: string; title: string }) => {
      if (response.success) {
        console.log("Started Livestream", response.id, response.title)
      } else {
        console.log("error")
      }
    })
  }

  useEffect(() => {

  }, [])

  return (
    <div className="flex h-full shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-10 w-10 text-muted-foreground"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="11" r="1" />
          <path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5ZM8 14a5 5 0 1 1 8 0" />
          <path d="M17 18.5a9 9 0 1 0-10 0" />
        </svg>

        <h3 className="text-lg font-semibold">
          Start Your Live Performance Right Now
        </h3>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="relative">
              Go Live
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Livestream</DialogTitle>
              <DialogDescription>
                Setup your livestream before starting.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="dspace-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Livestream Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose your Livestream Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="audioInput"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audio Input</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>

                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your Audio Input" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="microphone">Microphone</SelectItem>
                          <SelectItem value="obs">OBS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Go Live</Button>
              </form>
            </Form>

            <TestArea type={form.watch('audioInput')} />

            <DialogFooter>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div >
  )
}