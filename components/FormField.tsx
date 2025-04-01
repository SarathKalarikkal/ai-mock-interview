import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-medium text-cyan-100">{label}</FormLabel>
          <FormControl>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
              <Input
                className="relative w-full px-4 py-3 bg-slate-900/50 border border-blue-500/20 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 placeholder:text-slate-400"
                type={type === "password" && !showPassword ? "password" : type}
                placeholder={placeholder}
                {...field}
              />
              {type === "password" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-sm text-rose-400" />
        </FormItem>
      )}
    />
  );
};

export default FormField;
