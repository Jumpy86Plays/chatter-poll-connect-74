import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircleIcon, MinusCircleIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";

const AddPoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { addPoll } = useAuth();
  const { toast } = useToast();

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question && options.every(option => option.trim() !== '')) {
      addPoll({
        question,
        options: options.filter(option => option.trim() !== ''),
        votes: {}
      });
      setQuestion('');
      setOptions(['', '']);
      toast({
        title: "Poll Created",
        description: "Your poll has been successfully created.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields before creating the poll.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter poll question"
            required
          />
          {options.map((option, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              {index > 1 && (
                <Button onClick={() => handleRemoveOption(index)} variant="destructive" size="icon">
                  <MinusCircleIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={handleAddOption} variant="outline">
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Add Option
          </Button>
          <Button type="submit">Create Poll</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPoll;