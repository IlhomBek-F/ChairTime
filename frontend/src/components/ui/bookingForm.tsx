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
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import { Calendar } from "./calendar";
import { Textarea } from "./textarea";
import { format } from "date-fns";
import type { Matcher, Mode } from "react-day-picker";

type FormFieldProps = {
  formControl: any,
  name: string,
  label: string
  loading?: boolean
}

type FormFieldDateProps = FormFieldProps & {
  matcher?: Matcher | Matcher[],
  popover?: boolean,
  mode: Mode
}

type FormFieldSelectProps = FormFieldProps & {
  options: any[],
  type?: "number" | "string", 
  optionLabel?: string,
  optionValue?: string,
}

const inputField = ({ formControl, name, label }: FormFieldProps) => {
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

const select = ({ formControl, options, name, label, optionValue, optionLabel, loading, type = "string" }: FormFieldSelectProps) => {
  return <FormField
    disabled={loading}
    control={formControl}
    name={name}
    render={({ field }) => (
      <FormItem className="w-full mb-4">
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={(value: string) => field.onChange(type === 'number' ? Number(value) : value)} value={String(field.value)}>
          <FormControl className="w-full">
            <SelectTrigger>
              {loading && <Loader2Icon className="animate-spin" />}
              <SelectValue  className="w-full"/>
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option: any, index: number) => {
              return <SelectItem key={index} 
                                 value={optionValue && `${option[optionValue]}` || option}>{optionLabel && option[optionLabel] || option}</SelectItem>
            })}
          </SelectContent>
        </Select>
      </FormItem>
    )}
  />
  }

const date = ({ formControl, loading, label, matcher, name, mode, popover }: FormFieldDateProps) => {
  const [open, setOpen] = useState(false);
  const decodeValueToDate = (value: string = "") => {
      const [day, month, year] = value.split("-");
      return new Date(+year, +month - 1, +day);
  }
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <FormLabel>{label} </FormLabel>
          {!popover ?  <Calendar
                mode={mode}
                disabled={matcher}
                selected={decodeValueToDate(field.value)}
                className="w-full"
                captionLayout="dropdown"
                onSelect={(date: unknown) => {
                  if(date instanceof Date) {
                    field.onChange(format(date, "dd-MM-yyyy"));
                    setOpen(false);
                  }
                }}
                required={mode !== "range"}
              /> : <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl className="w-[50%]">
                <Button
                  variant="outline"
                  disabled={loading}
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {loading && <Loader2Icon className="animate-spin" />}
                  {field.value && field.value}
                  <ChevronDownIcon />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode={mode}
                disabled={matcher}
                selected={decodeValueToDate(field.value)}
                className="w-full"
                captionLayout="dropdown"
                onSelect={(date: unknown) => {
                  if(date instanceof Date) {
                    field.onChange(format(date, "dd-MM-yyyy"));
                    setOpen(false);
                  }
                }}
                required={mode !== "range"}
              />
            </PopoverContent>
          </Popover>}
        </FormItem>
      )}
    />
  );
};

const textArea = ({ formControl, name, label }: FormFieldProps) => (
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
