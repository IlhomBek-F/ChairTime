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
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import { Calendar } from "./calendar";
import { Textarea } from "./textarea";
import { format } from "date-fns";
import type { Matcher, Mode } from "react-day-picker";

type FormFieldProps = {
  formControl: any,
  name: string,
  label: string | ReactNode
  loading?: boolean,
  placeholder?: string,
  className?: string
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

const inputField = ({ formControl, name, label ,placeholder, className = ''}: FormFieldProps) => {
  return (
    <FormField
      name={name}
      control={formControl}
      render={({ field }) => (
        <FormItem className={`${className} mb-4`}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
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
            {options?.map((option: any, index: number) => {
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

  const decodeValueToDate = (value: string = "03-09-2025") => {
      const [day, month, year] = value.split("-");
      return new Date(+year, +month - 1, +day);
  }

  const formatMultipleModeDateValues = (date: unknown, onChangeFc: (evt: any[]) => void) => {
     if (Array.isArray(date)) {
       const formatedDates = date.map((d) => {
         if (d instanceof Date) {
          return format(d, "dd-MM-yyyy")
         }
       })

       onChangeFc(formatedDates)
     }
  }

  const formatSingleModeDateValue = (date: unknown, onChangeFc: (evt: any) => void) => {
     if (date instanceof Date) {
       onChangeFc(format(date, "dd-MM-yyyy"))
     }
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
                selected={mode === "multiple" ? field.value?.map((value: string) => decodeValueToDate(value)) : decodeValueToDate(field.value)}
                className="w-full"
                onDayClick={(date) => console.log(date)}
                captionLayout="dropdown"
                onSelect={(date: unknown) => mode === "multiple" ? formatMultipleModeDateValues(date, field.onChange) : formatSingleModeDateValue(date, field.onChange)}
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
                selected={mode === "multiple" ? [decodeValueToDate(field.value)] : decodeValueToDate(field.value)}
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

const textArea = ({ formControl, name, label, placeholder }: FormFieldProps) => (
  <FormField
    control={formControl}
    name={name}
    render={({ field }) => (
      <FormItem className="mb-4">
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea
            placeholder={placeholder}
            className="resize-none"
            {...field}
          />
        </FormControl>
      </FormItem>
    )}
  />
);

export function CustomForm({ children, form, handleSubmit, className} : { children: ReactNode; form: any; handleSubmit: () => void, className: string}) {
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={className}>{children}</form>
    </Form>
  );
}

CustomForm.InputField = inputField;
CustomForm.Select = select;
CustomForm.Date = date;
CustomForm.TextArea = textArea;
