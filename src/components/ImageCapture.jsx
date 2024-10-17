import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const ImageCapture = () => {
  const ref = useRef(null);
  const { toast } = useToast();

  const onButtonClick = () => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { 
      cacheBust: true,
      imagePlaceholder: '/placeholder.svg',
      skipFonts: true,
      filter: (node) => {
        // Skip capturing the button itself
        return node.tagName !== 'BUTTON';
      },
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'warframe-hub-capture.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "There was an error capturing the image. Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="space-y-4">
      <div ref={ref} className="p-4 bg-background border border-border rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">Warframe Hub Capture</h1>
        <p className="text-foreground">This is a sample capture from Warframe Hub.</p>
        {/* Add more content here as needed */}
      </div>
      <Button onClick={onButtonClick}>Capture Image</Button>
    </div>
  );
};

export default ImageCapture;