import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Username-ul este obligatoriu",
    "string.alphanum": "Username-ul poate conține doar litere și cifre",
    "string.min": "Username-ul trebuie să aibă cel puțin {#limit} caractere",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Adresa de email nu e validă",
      "string.empty": "Email-ul este obligatoriu",
    }),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Parola trebuie să aibă minim 8 caractere, cu literă mare, cifră și simbol",
      "string.empty": "Parola este obligatorie",
    }),
});
