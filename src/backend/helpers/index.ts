export const cx = (
  ...classNames: (string | false | null | undefined)[]
): string => classNames.filter(Boolean).join(" ");

export const isValidEmail = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string) => {
  const phoneRegex = /^(\+\d{2}\s?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4})$/;
  return phoneRegex.test(phone);
};

export const getCookiesName = () => {
  let cookieName = "";

  if (process.env.NODE_ENV === "development") {
    cookieName = "next-auth.csrf-token";
  }

  if (process.env.NODE_ENV === "production") {
    cookieName = "__Host-next-auth.csrf-token";
  }

  return cookieName;
};
