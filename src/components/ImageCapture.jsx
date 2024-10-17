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
      skipFonts: true, // Skip font inlining
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-image-name.png';
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
    <div>
      <div ref={ref} style={{ fontFamily: 'Orbitron, sans-serif' }}>
        {/* Your content to be captured goes here */}
        <h1>This is a test</h1>
        <p>This text should use the Orbitron font</p>
      </div>
      <Button onClick={onButtonClick}>Capture Image</Button>
    </div>
  );
};

export default ImageCapture;