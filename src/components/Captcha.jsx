import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useTheme } from '../contexts/ThemeContext';

const Captcha = ({ onValidate }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const { isDarkMode } = useTheme();

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
      <div className={`p-4 text-center font-bold text-lg ${
        isDarkMode 
          ? 'bg-gray-800 text-white' 
          : 'bg-gray-200 text-gray-800'
      } rounded-md`}>
        {captchaText}
      </div>
      <Input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter the captcha text"
        className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
      />
    </div>
  );
};

export default Captcha;