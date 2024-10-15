import React from 'react';

interface CustomCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ id, label, checked, onChange, className = '' }) => (
  <div className={`flex items-center ${className}`}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 bg-gray-50 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
    <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
      {label}
    </label>
  </div>
);

export default CustomCheckbox;
