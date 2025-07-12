import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface OrderingConfiguration {
  id?: string;
  name: string;
  description: string;
  algorithm: string;
  parameters: Record<string, any>;
}

interface OrderingConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (configuration: OrderingConfiguration) => void;
  configuration?: OrderingConfiguration;
}

export function OrderingConfigurationDialog({
  open,
  onOpenChange,
  onSave,
  configuration,
}: OrderingConfigurationDialogProps) {
  const [formData, setFormData] = useState<OrderingConfiguration>({
    name: configuration?.name || '',
    description: configuration?.description || '',
    algorithm: configuration?.algorithm || 'random',
    parameters: configuration?.parameters || {},
  });

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof OrderingConfiguration, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {configuration ? 'Edit Configuration' : 'Create Configuration'}
          </DialogTitle>
          <DialogDescription>
            Configure the ordering algorithm settings for sample presentation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="col-span-3"
              placeholder="Configuration name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="col-span-3"
              placeholder="Configuration description"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="algorithm" className="text-right">
              Algorithm
            </Label>
            <select
              id="algorithm"
              value={formData.algorithm}
              onChange={(e) => handleInputChange('algorithm', e.target.value)}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="random">Random</option>
              <option value="sequential">Sequential</option>
              <option value="balanced">Balanced</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}