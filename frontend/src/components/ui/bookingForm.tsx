import { useState, type ReactNode } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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

const inputField = ({ formControl, name, label }: { formControl: any, name: string, label: string }) => {
  return (
    <FormField
      name={name}
      control={formControl}
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder="shadcn" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

const select = ({ formControl, options, name, label }: { formControl: any, options: any, name: string, label: string }) => (
  <FormField
    control={formControl}
    name={name}
    render={({ field }) => (
      <FormItem className="w-full mb-4">
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl className="w-full">
            <SelectTrigger>
              <SelectValue placeholder="Select" className="w-full"/>
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option: string) => {
              return <SelectItem value={option}>{option}</SelectItem>
            })}
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

const textArea = ({ formControl, name, label }: { formControl: any, name: string, label: string }) => (
  <FormField
    control={formControl}
    name={name}
    render={({ field }) => (
      <FormItem className="mb-4">
        <FormLabel>{label}</FormLabel>
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

export function BookingForm({ children, form, handleSubmit} : { children: ReactNode; form: any; handleSubmit: () => void}) {
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>{children}</form>
    </Form>
  );
}

BookingForm.InputField = inputField;
BookingForm.Select = select;
BookingForm.Date = date;
BookingForm.TextArea = textArea;
