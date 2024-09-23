"use client";
import { motion } from "framer-motion";
import React from "react";
import { IoMdPhonePortrait, IoMdAt, IoMdLocate } from "react-icons/io";

const IconListSectionComponent = ({
  mainTitle,
  textTitleOne,
  textTitleTwo,
  textTitleThree,
  textTwo,
  textThree,
  phoneLinkOne,
  phoneLinkTextOne,
  linkTwo,
  linkThree,
  linkTwoText,
  linkThreeText,
  textAddressThree,
  textAddressBThree,
  textAddressCThree,
}: {
  mainTitle: string;
  textTitleOne: string;
  textTitleTwo: string;
  textTitleThree: string;
  textTwo: string;
  textThree: string;
  phoneLinkOne: string;
  phoneLinkTextOne: string;
  linkTwo: string;
  linkThree: string;
  linkTwoText: string;
  linkThreeText: string;
  textAddressThree: string;
  textAddressBThree: string;
  textAddressCThree: string;
}) => {
  return (
    <div className="relative h-full">
      <div className="mt-0 flex flex-row maxmd:flex-col-reverse mx-auto my-14 w-[80%] maxmd:w-[100%] relative items-center">
        <div className="flex flex-col w-full">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1 }}
            className="text-3xl font-base text-slate-200 font-playfair-display mb-6"
          >
            {mainTitle}
          </motion.h2>

          <div className="flex flex-row gap-x-2 my-3">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1 }}
              className="flex justify-center items-center w-[60px] h-[60px]  p-2 rounded-full"
            >
              <IoMdAt className="w-[30px] h-[30px] text-slate-200" />
            </motion.div>
            <div className="flex-col w-3/4">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.3 }}
                className="font-playfair-display text-2xl"
              >
                {textTitleTwo}
              </motion.div>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.3 }}
                className="text-xs"
              >
                {textTwo}
              </motion.div>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="text-xs font-bold"
              >
                <a href={linkTwo}>{linkTwoText}</a>
              </motion.div>
            </div>
          </div>

          {/* Warehouse 1 */}
          <div className="flex flex-row gap-x-2 my-3">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1 }}
              className="flex justify-center items-center w-[60px] h-[60px]  p-2 rounded-full"
            >
              <IoMdLocate className="w-[30px] h-[30px] text-slate-200" />
            </motion.div>
            <div className="flex-col w-3/4">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.3 }}
                className="font-playfair-display text-2xl"
              >
                {textTitleThree}
              </motion.div>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="text-xs"
              >
                {textThree}
              </motion.div>
              <div className="text-sm">
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.6 }}
                >
                  {textAddressThree}
                </motion.p>
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.7 }}
                >
                  {textAddressBThree}
                </motion.p>
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.8 }}
                >
                  {textAddressCThree}
                </motion.p>
              </div>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.8 }}
              >
                <a
                  href={linkThree}
                  target="_blank"
                  className="text-xs font-bold"
                >
                  {linkThreeText}
                </a>
              </motion.div>
            </div>
          </div>
          {/* Call Us 1 */}
          <div className="flex flex-row gap-x-2 mb-3">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1 }}
              className="flex justify-center items-center w-[60px] h-[60px] p-2 rounded-full"
            >
              <IoMdPhonePortrait className="w-[30px] h-[30px] text-slate-200" />
            </motion.div>
            <div className="flex-col flex gap-1 w-3/4 tracking-widest">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.3 }}
                className="font-playfair-display text-xl"
              >
                {textTitleOne}
              </motion.div>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <a href={phoneLinkOne} className="text-xs font-bold">
                  {phoneLinkTextOne}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconListSectionComponent;
