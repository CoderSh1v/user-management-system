const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const authValidator = ({email, password, name}) => {
  if (!email) return "email not found";
  if (!password) return "password not found";
  if (name !== undefined && !name) return "name not found";
  if (!emailRegex.test(email)) return "Invalid email format"
    
  return null;
};
