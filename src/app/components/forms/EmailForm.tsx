"use client";
import React, { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { isValidEmail, isValidPhone } from "@/backend/helpers";

interface EmailFormProps {
  cookie: string;
}

const EmailForm: React.FC<EmailFormProps> = ({ cookie }) => {
  const [notification, setNotification] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [activeButton, setActiveButton] = useState(false);
  const [formStatus, setFormStatus] = useState(false);

  const [honeypot, setHoneypot] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name === "") {
      setError("Por favor agregar tu nombre para enviar el mensaje.");
      return;
    }

    if (email === "") {
      setError("Por favor agregue su correo para enviar el mensaje. ");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Utilice un correo electrónico válido.");
      return;
    }
    if (message === "") {
      setError("Por favor agregue su mensaje para continuar.");
      return;
    }

    if (!isValidPhone(phone)) {
      setError("Utilice un teléfono válido.");
      return;
    }

    if (!executeRecaptcha) {
      console.log("Execute recaptcha not available yet");
      setNotification(
        "Execute recaptcha not available yet likely meaning key not recaptcha key not set"
      );
      return;
    }
    setActiveButton(true);

    executeRecaptcha("enquiryFormSubmit").then(async (gReCaptchaToken) => {
      try {
        const res = await fetch(`/api/email`, {
          headers: {
            "Content-Type": "application/json",
            Cookie: cookie,
          },
          method: "POST",
          body: JSON.stringify({
            name,
            phone,
            email,
            message,
            recaptcha: gReCaptchaToken,
            honeypot,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setNotification(`Success with score: ${data.score}`);
        } else {
          setNotification(`Failure with score: ${data.score}`);
        }

        if (res.status === 400) {
          setActiveButton(true);
          setError("Error al enviar tu mensaje intenta nuevamente");
        }
        if (res.ok) {
          setFormStatus(true);
          setNotification("Su mensaje se envió exitosamente");

          return;
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputPhone = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    let formattedPhone = "";

    if (inputPhone.length <= 10) {
      formattedPhone = inputPhone.replace(
        /(\d{3})(\d{0,3})(\d{0,4})/,
        "$1$2$3"
      );
    } else {
      // If the phone number exceeds 10 digits, truncate it
      formattedPhone = inputPhone
        .slice(0, 10)
        .replace(/(\d{3})(\d{0,3})(\d{0,4})/, "$1 $2 $3");
    }

    setPhone(formattedPhone);
  };

  return (
    <div className="relative flex fle-col py-7  pr-7 m-auto w-full rounded-xl z-10">
      {!formStatus ? (
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-y-4">
          <input
            type="text"
            placeholder={"Tu nombre aquí"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border-t-0 border-l-0 border-r-0 border-b-black border-b font-playfair-display bg-white bg-opacity-0 appearance-none border  rounded-md py-2 px-3 focus:outline-none focus:border-b-4 ease-in-out duration-300 w-full text-black placeholder:text-black"
          />
          <input
            type="email"
            placeholder={"Correo Electrónico"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border-t-0 border-l-0 border-r-0 border-b-black border-b font-playfair-display bg-white bg-opacity-0 appearance-none border  rounded-md py-2 px-3 focus:outline-none focus:border-b-4 ease-in-out duration-300 w-full text-black placeholder:text-black"
          />
          <input
            className="p-2 border-t-0 border-l-0 border-r-0 border-b-black border-b font-playfair-display bg-white bg-opacity-0 appearance-none border  rounded-md py-2 px-3 focus:outline-none focus:border-b-4 ease-in-out duration-300 w-full text-black placeholder:text-black"
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={handlePhoneChange}
          />
          <input
            hidden
            type="text"
            placeholder="Honeypot"
            onChange={(e) => setHoneypot(e.target.value)}
          />
          <textarea
            cols={30}
            rows={5}
            placeholder="Mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 border-t-0 border-l-0 border-r-0 border-b-black border-b font-playfair-display bg-white bg-opacity-0 appearance-none border  rounded-md py-2 px-3 focus:outline-none focus:border-b-4 ease-in-out duration-300 w-full text-black placeholder:text-black"
          ></textarea>
          <button type="submit" className="mt-5" disabled={activeButton}>
            <p className=" bg-black  text-white py-3 hover:scale-105 ease-in-out duration-300">
              {"Enviar Mensaje"}
            </p>
          </button>
          {error ? error : ""}
          {notification ? notification : ""}
        </form>
      ) : (
        <div className="text-green-700">El mensaje se envió exitosamente</div>
      )}
    </div>
  );
};

export default EmailForm;
