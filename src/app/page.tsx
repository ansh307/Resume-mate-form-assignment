"use client";

import { FormSubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { generatePDF } from "@/lib/generatePDF";
import { FormEventHandler, useRef, useState } from "react";
import Button from "@/components/Button";
import Image from "next/image";

// Validation schema
const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, "Phone must contain only digits")
    .min(10, "Phone must be at least 10 digits"),
  position: z.string().optional(),
  description: z.string().optional(),
});

export type FormData = z.infer<typeof schema>;

export default function Form() {
  const router = useRouter();
  const [activeField, setActiveField] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const positionRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormData, action?: "preview" | "download") => {
    const trimmedValues = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      position: values.position?.trim() || "",
      description: values.description?.trim() || "",
    };

    if (action === "preview") {
      // const query = new URLSearchParams(trimmedValues as any).toString();
      localStorage.setItem("formData", JSON.stringify(trimmedValues));
      router.push(`/preview`);
    } else if (action === "download") {
      const pdf = generatePDF(trimmedValues);

      // Create a nice filename: Name_YYYY-MM-DD.pdf
      const dateStr = new Date().toISOString().split("T")[0];
      const safeName = trimmedValues.name.replace(/\s+/g, "_") || "User";
      pdf.save(`${safeName}_${dateStr}.pdf`);

      reset();
    }
  };

  const handleRandomUser = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("https://dummyjson.com/users");

      if (!res.ok) {
        console.log("err");
      }

      const jsonData = await res.json();

      if (jsonData.users.length > 0) {
        const randIndex = Math.floor(Math.random() * jsonData.users.length);
        const { firstName, lastName, email } = jsonData.users[randIndex];

        setValue("name", `${firstName} ${lastName}`);
        setValue("email", email);

        console.log(`Picked User: ${firstName} ${lastName} (${email})`);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log("Done");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6  bg-white">
      <h1 className="text-2xl font-bold text-center mb-6">Add Your details</h1>

      <form className="flex flex-col gap-4">
        {/* Name */}
        <div
          className="flex border border-gray-300 rounded-2xl items-center px-4 shadow-md cursor-text h-16"
          onClick={() => nameRef.current?.focus()}
        >
          <Image
            src="/icons/user.svg"
            alt="name"
            width={6}
            height={6}
            className="w-6 h-6 opacity-70"
          />
          <div className="w-full pl-5">
            <label
              className={`font-bold transition-all duration-200 ${
                activeField === "name" || watch("name") ? "text-sm" : "text-md"
              }`}
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. John Doe"
              {...register("name", { required: "Name is required" })}
              ref={(el) => {
                // forward ref to react-hook-form
                register("name").ref(el);
                // also forward to your own ref
                nameRef.current = el;
              }}
              onFocus={() => setActiveField("name")}
              onBlur={() => setActiveField(null)}
              className="w-full py-1 focus:outline-none focus:ring-0 active:ring-0 "
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs whitespace-nowrap ">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div
          className="flex border border-gray-300 rounded-2xl items-center px-4 shadow-md cursor-text h-16  "
          onClick={() => emailRef.current?.focus()}
        >
          <Image
            src="/icons/mail.svg"
            alt="email"
            width={6}
            height={6}
            className="w-6 h-6 opacity-70"
          />
          <div className="w-full pl-5">
            <label
              className={`font-bold transition-all duration-200 ${
                activeField === "email" || watch("email")
                  ? "text-sm"
                  : "text-md"
              }`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="e.g. Johndoe@gmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Invalid email",
                },
              })}
              ref={(el) => {
                // forward ref to react-hook-form
                register("email").ref(el);
                // also forward to your own ref
                emailRef.current = el;
              }}
              onFocus={() => setActiveField("email")}
              onBlur={() => setActiveField(null)}
              className="w-full py-1 focus:outline-none focus:ring-0 active:ring-0"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs whitespace-nowrap">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div
          className="flex border border-gray-300 rounded-2xl items-center px-4 shadow-md cursor-text h-16  "
          onClick={() => phoneRef.current?.focus()}
        >
          <Image
            src="/icons/phone-call.svg"
            alt="phone"
            width={6}
            height={6}
            className="w-6 h-6 opacity-70"
          />
          <div className="w-full pl-5">
            <label
              className={`font-bold transition-all duration-200 ${
                activeField === "phone" || phoneRef.current?.value
                  ? "text-sm"
                  : "text-md"
              }`}
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g. (220) 222 -20002"
              {...register("phone", {
                required: "Phone number is required",
                minLength: {
                  value: 10,
                  message: "At least 10 digits required",
                },
              })}
              ref={(el) => {
                // forward ref to react-hook-form
                register("phone").ref(el);
                // also forward to your own ref
                phoneRef.current = el;
              }}
              onFocus={() => setActiveField("phone")}
              onBlur={() => setActiveField(null)}
              className="w-full py-1 focus:outline-none focus:ring-0 active:ring-0"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs whitespace-nowrap">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Position */}
        <div
          className="flex border border-gray-300 rounded-2xl items-center px-4 shadow-md cursor-text h-16  "
          onClick={() => positionRef.current?.focus()}
        >
          <Image
            src="/icons/position.svg"
            alt="position"
            width={6}
            height={6}
            className="w-6 h-6 opacity-70"
          />
          <div className="w-full pl-5">
            <label
              className={`font-bold transition-all duration-200 ${
                activeField === "position" || positionRef.current?.value
                  ? "text-sm"
                  : "text-md"
              }`}
              htmlFor="position"
            >
              Position
            </label>
            <input
              id="position"
              type="text"
              placeholder="e.g. Junior Frontend Developer"
              {...register("position")}
              ref={(el) => {
                // forward ref to react-hook-form
                register("position").ref(el);
                // also forward to your own ref
                positionRef.current = el;
              }}
              onFocus={() => setActiveField("position")}
              onBlur={() => setActiveField(null)}
              className="w-full py-1 focus:outline-none focus:ring-0 active:ring-0"
            />
          </div>
        </div>

        {/* Description */}
        <div
          className="flex border border-gray-300 rounded-2xl items-center px-4 shadow-md cursor-text h-16  "
          onClick={() => descriptionRef.current?.focus()}
        >
          <Image
            src="/icons/Description.svg"
            alt="description"
            width={6}
            height={6}
            className="w-6 h-6 opacity-70"
          />
          <div className="w-full pl-5">
            <label
              className={`font-bold transition-all duration-200 ${
                activeField === "description" || descriptionRef.current?.value
                  ? "text-sm"
                  : "text-md"
              }`}
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="e.g. Work experiences"
              rows={1}
              {...register("description")}
              ref={(el) => {
                // forward ref to react-hook-form
                register("description").ref(el);
                // also forward to your own ref
                descriptionRef.current = el;
              }}
              onFocus={() => setActiveField("description")}
              onBlur={() => setActiveField(null)}
              className="w-full resize-none py-1 focus:outline-none focus:ring-0 active:ring-0"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <Button
            onClick={handleSubmit((v) => onSubmit(v, "preview"))}
            variant="blue"
          >
            View PDF
          </Button>

          <Button
            onClick={handleSubmit((v) => onSubmit(v, "download"))}
            variant="blue"
          >
            <Image
              src="/icons/Download.svg"
              alt="download"
              width={6}
              height={6}
              className="w-6 h-6 opacity-70"
            />
            Download PDF
          </Button>

          <Button variant="blue" onClick={handleRandomUser}>
            random user
          </Button>
          {/* new button random user */}
        </div>
      </form>
    </div>
  );
}
