import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

const Captcha = ({ onValidate }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaText(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    onValidate(e.target.value === captchaText);
  };

  return (
    <div className="space-y-2">
      <div className="bg-gray-200 p-2 text-center font-bold">{captchaText}</div>
      <Input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter the captcha text"
      />
    </div>
  );
};

export default Captcha;