import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Combobox genérico de múltipla seleção
export function MultiSelectCombobox<T extends { id: string }>({
  items,
  selectedIds,
  setSelectedIds,
  placeholder,
  getLabel,
}: {
  items: T[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  placeholder: string;
  getLabel: (item: T) => string;
}) {
  const [open, setOpen] = useState(false);

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-full bg-zinc-100 rounded-md p-2 flex justify-between items-center
            hover:border-purple-600 hover:bg-zinc-200 hover:-translate-y-0.5 transition-all duration-300 border border-transparent cursor-pointer"
        >
          {selectedIds.length > 0
            ? `${selectedIds.length} selecionado(s)`
            : placeholder}
          <ChevronsUpDown className="opacity-50 ml-2" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder={`Buscar ${placeholder.toLowerCase()}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>Nenhum encontrado.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => toggleItem(item.id)}
                >
                  {getLabel(item)}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedIds.includes(item.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
