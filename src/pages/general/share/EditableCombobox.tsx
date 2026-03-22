"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Option {
    value: string
    label: string
}

interface EditableComboboxProps {
    options: Option[]
    placeholder?: string
    value: string
    onChange: (value: string) => void
}

export function EditableCombobox({
    options,
    placeholder = "Seleccionar o escribir...",
    value,
    onChange
}: EditableComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(value)

    // Sincronizar el valor si cambia externamente
    React.useEffect(() => {
        setInputValue(value)
    }, [value])

    const handleInputChange = (val: string) => {
        setInputValue(val)
        onChange(val) // Actualiza el valor en tiempo real mientras escribes
    }

    const handleSelect = (currentValue: string) => {
        // Si seleccionamos la misma que ya está, limpiamos, si no, asignamos
        const newValue = currentValue === value ? "" : currentValue
        onChange(newValue)
        setOpen(false)
    }

    // Buscamos si el valor actual existe en las opciones para mostrar el Label
    const selectedOption = options.find((opt) => opt.value === value)
    const displayValue = selectedOption ? selectedOption.label : value

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    <span className="truncate">
                        {displayValue || <span className="text-muted-foreground">{placeholder}</span>}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={true}>
                    <CommandInput
                        placeholder="Buscar o escribir nuevo..."
                        value={inputValue}
                        onValueChange={handleInputChange}
                    />
                    <CommandList>
                        {/* Si el usuario escribe algo que NO está en la lista, 
                           mostramos una opción especial para "usar ese texto"
                        */}
                        {inputValue && !options.find(o => o.label.toLowerCase() === inputValue.toLowerCase()) && (
                            <CommandGroup heading="Nuevo valor">
                                <CommandItem
                                    value={inputValue}
                                    onSelect={() => {
                                        onChange(inputValue)
                                        setOpen(false)
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Plus className="mr-2 h-4 w-4 text-blue-500" />
                                    Usar: <span className="font-bold ml-1 italic">"{inputValue}"</span>
                                </CommandItem>
                            </CommandGroup>
                        )}

                        <CommandGroup heading="Opciones existentes">
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}