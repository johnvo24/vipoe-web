"use client"

import { useState } from "react"
import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AIModel } from "@/types/assistant"

const AI_MODELS: AIModel[] = [
  {
    model: "phobert_gpt2",
    label: "phobert_gpt2",
  },
  {
    model: "gemini-1.5-flash", 
    label: "gemini-1.5-flash",
  },
  {
    model: "claude-3-5-sonnet-20241022",
    label: "claude-3-5-sonnet-20241022",
  },
]

interface ModelSelectorProps {
  selectedModel: string
  onModelSelect: (model: string) => void
}

export default function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedModel
            ? AI_MODELS.find((m) => m.model === selectedModel)?.label
            : "Chọn AI model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Tìm model..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy.</CommandEmpty>
            <CommandGroup>
              {AI_MODELS.map((model) => (
                <CommandItem
                  key={model.model}
                  value={model.model}
                  onSelect={(currentValue) => {
                    onModelSelect(currentValue === selectedModel ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedModel === model.model ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {model.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}