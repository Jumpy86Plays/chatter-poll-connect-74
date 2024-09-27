import React, { useState, useEffect } from 'react';

const Captcha: React.FC<{ onValidate: (isValid: boolean) => void }> = ({ onValidate }) => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    onValidate(e.target.value === captchaText);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Captcha: {captchaText}</label>
      <input
        type="text"
        className="form-control"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter the captcha text"
      />
    </div>
  );
};

export default Captcha;