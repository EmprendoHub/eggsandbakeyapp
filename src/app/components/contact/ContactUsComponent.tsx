import React from "react";
import BoxesSectionTitle from "../texts/BoxesSectionTitle";
import EmailForm from "../forms/EmailForm";
import { getCookiesName } from "@/backend/helpers";
import { cookies } from "next/headers";
import GoogleCaptchaWrapper from "../forms/GoogleCaptchaWrapper";

const ContactUsComponent = ({
  contactTitle,
  contactSubTitle,
}: {
  contactTitle: string;
  contactSubTitle: string;
}) => {
  //set cookies
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const cookie = `${cookieName}=${nextAuthSessionToken?.value}`;
  return (
    <div className="bg-[#dac340]  flex flex-row maxmd:flex-col p-10 w-[90%] justify-center items-center mx-auto ">
      <div className="w-full maxmd:w-full z-10  maxmd:px-5 maxsm:px-1">
        <div className=" pb-20 w-full">
          <h2>
            <BoxesSectionTitle
              className="mb-5 text-xl text-black"
              title={contactTitle}
              subtitle={contactSubTitle}
            />
          </h2>
          <GoogleCaptchaWrapper>
            <EmailForm cookie={cookie} />
          </GoogleCaptchaWrapper>
        </div>
      </div>
    </div>
  );
};

export default ContactUsComponent;
