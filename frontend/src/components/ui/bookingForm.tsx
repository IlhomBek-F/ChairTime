import { useState, type ReactNode } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { Textarea } from "./textarea";
import { format } from "date-fns";

const userName = ({ formControl }: { formControl: any }) => {
  return (
    <FormField
      name="username"
      control={formControl}
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="shadcn" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

const phone = ({ formControl }: { formControl: any }) => (
  <FormField
    control={formControl}
    name="phone"
    render={({ field }) => (
      <FormItem className="mb-4">
        <FormLabel>Phone</FormLabel>
        <FormControl>
          <Input placeholder="shadcn" {...field} />
        </FormControl>
      </FormItem>
    )}
  />
);

const master = ({ formControl }: { formControl: any }) => (
  <FormField
    control={formControl}
    name="master"
    render={({ field }) => (
      <FormItem className="mb-4">
        <FormLabel>Master</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl className="w-full">
            <SelectTrigger>
              <SelectValue placeholder="Select a verified email to display" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="m@example.com">m@example.com</SelectItem>
            <SelectItem value="m@google.com">m@google.com</SelectItem>
            <SelectItem value="m@support.com">m@support.com</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>
    )}
  />
);

const style = ({ formControl }: { formControl: any }) => (
  <FormField
    control={formControl}
    name="style"
    render={({ field }) => (
      <FormItem className="mb-4">
        <FormLabel>Style</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl className="w-full">
            <SelectTrigger>
              <SelectValue placeholder="Select a verified email to display" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="m@example.com">m@example.com</SelectItem>
            <SelectItem value="m@google.com">m@google.com</SelectItem>
            <SelectItem value="m@support.com">m@support.com</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>
    )}
  />
);

const date = ({ formControl }: { formControl: any }) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={formControl}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl className="w-[50%]">
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {field.value ? (
                    format(field.value, "dd.MM.yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <ChevronDownIcon />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={field.value}
                className="w-full"
                captionLayout="dropdown"
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};

const time = ({ formControl }: { formControl: any }) => (
  <FormField
    control={formControl}
    name="time"
    render={({ field }) => (
      <FormItem className="w-full">
        <FormLabel>Time</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl className="w-full">
            <SelectTrigger>
              <SelectValue placeholder="Select" className="w-full" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="m@example.com">m@example.com</SelectItem>
            <SelectItem value="m@google.com">m@google.com</SelectItem>
            <SelectItem value="m@support.com">m@support.com</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>
    )}
  />
);

const comment = ({ formControl }: { formControl: any }) => (
  <FormField
    control={formControl}
    name="description"
    render={({ field }) => (
      <FormItem className="mb-4">
        <FormLabel>Comment</FormLabel>
        <FormControl>
          <Textarea
            placeholder="comment..."
            className="resize-none"
            {...field}
          />
        </FormControl>
      </FormItem>
    )}
  />
);

export function BookingForm({
  children,
  form,
  handleSubmit,
}: {
  children: ReactNode;
  form: any;
  handleSubmit: () => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>{children}</form>
    </Form>
  );
}

BookingForm.UserName = userName;
BookingForm.Phone = phone;
BookingForm.Master = master;
BookingForm.Style = style;
BookingForm.Date = date;
BookingForm.Time = time;
BookingForm.Comment = comment;
