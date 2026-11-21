"use client";

import { useState } from "react";
import { Input, Checkbox, Select, Button, PhoneIcon } from "@car-rentals/ui";

const RegisterForm = () => {
  const show = true;
  const error = undefined;
  return (
    <div className="flex-1 p-8">
      <div className="flex justify-center items-center">
      <h1 className="fx-text-3d">Sign Up</h1>
      </div>
      <form className="space-y-2 lg:space-y-3 2xl:space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="carrentals@gmail.com"
          error={
            error
              ? "Enter a full email address, like carrentals@gmail.com."
              : ""
          }
          variant="outline"
          required
        />
        <Input
          label="Username"
          type="autoComplete"
          placeholder="@rentalscar"
          required
        />
        <div className="grid grid-cols-[1fr_3fr] gap-2">
          <Select
            label="Country"
            placeholder="Code"
            required
            options={[
              { value: "India", label: "+91" },
              { value: "USA", label: "+1" },
            ]}
          />
          <Input
            label="Phone Number"
            type="number"
            startIcon={<PhoneIcon />}
            maxLength={12}
            minLength={10}
            placeholder="1234567890"
            required
          />
        </div>
        <Input
          label="Password"
          type={show ? "text" : "password"}
          placeholder="@Car1234"
          hint="use uppercase, smallcase, numbers, symbols"
          required
        />
        <Input label="Confirm Password" type={show ? "text" : "password"} />
        <Checkbox
          name="privacyPolicy"
          label="I accept the Privacy Policy and Term & Condition"
          description="I accept, I read the Privacy Policy and Term & Condition"
          required
        />
        <Button fullWidth variant="highlight">
          Sign Up
        </Button>
        <div className="container flex items-center justify-center">
          <Button variant="link">Privacy Policy</Button>
          <Button variant="link">Term & Condtion</Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
